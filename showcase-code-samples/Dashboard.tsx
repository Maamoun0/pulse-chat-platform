import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface User {
  id: string;
  username: string;
  email: string;
  status: string;
  last_seen: string;
  is_restricted?: boolean;
  role?: string;
}

interface Stats {
  totalUsers: number;
  activeSessions: number;
  totalMessages: number;
  history: { date: string; count: number }[];
  users: User[];
}

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ token, onLogout }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#00696E');

  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:3002'
    : 'https://maamoun0-chat-backend.hf.space';

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/users/stats`, {
        headers: authHeaders,
      });

      if (response.status === 401 || response.status === 403) {
        onLogout();
        throw new Error('Unauthorized');
      }

      if (!response.ok) throw new Error('Failed to fetch from backend');
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Connection to backend lost or access denied.');
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchStats();

    const newSocket = io(API_URL, {
      transports: ['websocket'],
      auth: { token },
    });

    newSocket.on('presence_update', (data: { userId: string, status: string }) => {
      setStats(prev => {
        if (!prev) return prev;
        const updatedUsers = prev.users.map(u =>
          u.id === data.userId ? { ...u, status: data.status } : u,
        );
        const activeCount = updatedUsers.filter(u => u.status === 'online').length;
        return { ...prev, users: updatedUsers, activeSessions: activeCount };
      });
    });

    newSocket.on('connect_error', () => {
      setError('Admin socket connection failed.');
    });

    return () => {
      newSocket.close();
    };
  }, [fetchStats, API_URL, token]);

  const toggleRestriction = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}/restrict`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ restricted: !currentStatus }),
      });

      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }

      if (res.ok) fetchStats();
    } catch (err) {
      console.error('Restriction toggle failed:', err);
    }
  };

  const deleteUser = async (userId: string, username: string) => {
    if (window.confirm(`Permanently delete user ${username}?`)) {
      try {
        const res = await fetch(`${API_URL}/users/${userId}`, {
          method: 'DELETE',
          headers: authHeaders,
        });

        if (res.status === 401 || res.status === 403) {
          onLogout();
          return;
        }

        if (res.ok) fetchStats();
      } catch (err) {
        console.error('Deletion failed:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9FB] dark:bg-[#0A192F] text-[#1B1B1D] dark:text-white p-4 md:p-8 font-sans transition-colors duration-300">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="animate-in fade-in slide-in-from-left duration-500">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00696E]">Infrastructure Node Alpha</span>
            <div className="h-[2px] w-12 bg-[#00696E] rounded-full opacity-30" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter">
            Pulse <span style={{ color: primaryColor }}>Control Center</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={onLogout} className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-bold hover:bg-gray-50">
            Logout
          </button>
          <div className="flex gap-2 bg-white dark:bg-[#112240] p-2.5 rounded-3xl shadow-sm border border-gray-200/50 dark:border-[#233554]">
            {['#00696E', '#1A73E8', '#EB5757', '#F2994A'].map(color => (
              <button
                key={color}
                onClick={() => setPrimaryColor(color)}
                className={`w-7 h-7 rounded-2xl transition-all hover:scale-110 ${primaryColor === color ? 'ring-4 ring-offset-4 ring-gray-100 dark:ring-[#233554]' : 'opacity-30 hover:opacity-100'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <main className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Users', value: stats?.totalUsers, icon: '👥' },
          { label: 'Active Now', value: stats?.activeSessions, icon: '⚡' },
          { label: 'Msg Volume', value: stats?.totalMessages, icon: '💬' },
          { label: 'Uptime', value: '99.9%', icon: '🚀' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#112240] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-[#233554] transition-all hover:shadow-xl group">
            <div className="flex justify-between items-center mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-[#1B2A4E] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{stat.icon}</div>
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
            </div>
            <p className="text-4xl font-black tracking-tight" style={{ color: primaryColor }}>{stat.value ?? '0'}</p>
          </div>
        ))}
      </main>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white dark:bg-[#112240] p-8 rounded-[2rem] border border-gray-100 dark:border-[#233554] shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-xl tracking-tight">Growth Velocity</h3>
            <span className="text-[10px] font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full">+12% this week</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.history || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#AAA' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#AAA' }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                <Area type="monotone" dataKey="count" stroke={primaryColor} strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#112240] p-8 rounded-[2rem] border border-gray-100 dark:border-[#233554] shadow-sm flex flex-col">
          <h3 className="font-black text-xl tracking-tight mb-8">Network Health</h3>
          <div className="flex-1 space-y-6">
            {[
              { label: 'Socket Engine', status: 'Optimal', val: 100 },
              { label: 'Persistence DB', status: 'Optimal', val: 100 },
              { label: 'Redis Cache', status: 'Syncing', val: 85 },
              { label: 'Push Relay', status: 'Standby', val: 100 },
            ].map((s, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-gray-400">{s.label}</span>
                  <span style={{ color: s.val > 90 ? '#10B981' : primaryColor }}>{s.status}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-50 dark:bg-[#1B2A4E] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.val}%`, backgroundColor: s.val > 90 ? '#10B981' : primaryColor }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black tracking-tighter">User Authority</h2>
          <div className="flex gap-2">
            <button onClick={fetchStats} className="w-10 h-10 flex items-center justify-center rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all text-xl">🔄</button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#112240] rounded-[2.5rem] border border-gray-100 dark:border-[#233554] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/30 dark:bg-[#1B2A4E] text-gray-400 text-[9px] font-black uppercase tracking-[0.25em]">
                  <th className="p-8">Identity Node</th>
                  <th className="p-8">Contact Protocol</th>
                  <th className="p-8">Status</th>
                  <th className="p-8">Role</th>
                  <th className="p-8">Temporal Log</th>
                  <th className="p-8 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-[#233554]">
                {loading ? (
                  <tr><td colSpan={6} className="p-32 text-center"><div className="animate-spin inline-block w-10 h-10 border-[4px] border-current border-t-transparent text-[#00696E] rounded-full" /></td></tr>
                ) : (
                  stats?.users.map((user) => (
                    <tr key={user.id} className="group hover:bg-gray-50/50 dark:hover:bg-[#1B2A4E]/30 transition-all">
                      <td className="p-8">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center font-black text-lg text-white shadow-lg transition-all group-hover:rotate-6" style={{ backgroundColor: primaryColor }}>
                            {user.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-base tracking-tight mb-0.5">{user.username}</p>
                            {user.is_restricted
                              ? <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 rounded-md font-black uppercase">Restricted</span>
                              : <span className="text-[8px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-md font-black uppercase">Standard</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-8 text-sm text-gray-400 font-bold">{user.email}</td>
                      <td className="p-8">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${user.status === 'online' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-gray-200'}`} />
                          <span className={`text-[9px] font-black tracking-widest ${user.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                            {user.status.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="p-8 text-[11px] font-black uppercase text-gray-500">{user.role || 'user'}</td>
                      <td className="p-8 text-[11px] text-gray-400 font-black">
                        {user.last_seen ? new Date(user.last_seen).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'LEGACY'}
                      </td>
                      <td className="p-8 text-right space-x-3">
                        <button
                          onClick={() => toggleRestriction(user.id, !!user.is_restricted)}
                          className={`w-10 h-10 rounded-2xl transition-all border flex items-center justify-center ${user.is_restricted ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}
                          title={user.is_restricted ? 'Unrestrict' : 'Restrict'}
                        >
                          {user.is_restricted ? '🔓' : '🔒'}
                        </button>
                        <button
                          onClick={() => deleteUser(user.id, user.username)}
                          className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center transition-all hover:bg-red-500 hover:text-white"
                          title="Purge User"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
