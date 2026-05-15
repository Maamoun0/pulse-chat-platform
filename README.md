# 💬 Pulse Chat
### Secure, Real-Time Messaging Reimagined.

**By Ahmed Maamoun**

---

## 🧭 Project Philosophy
We live in an age where privacy is often an afterthought. **Pulse Chat** was built to prove that you don't have to sacrifice a beautiful user experience for military-grade security. I wanted to create a messaging platform that feels as smooth as iMessage but respects your data like Signal.

---

## 📸 The Interface

### Mobile Experience (Flutter)
<div align="center">
  <img src="screenshots/app_login.jpg" width="200" />
  <img src="screenshots/app_chats_list.jpg" width="200" />
  <img src="screenshots/app_security.jpg" width="200" />
  <img src="screenshots/app_preferences_dark.jpg" width="200" />
</div>

### Admin & Control (Web)
<div align="center">
  <img src="screenshots/admin_dashboard.png" width="800" />
</div>

---

## ✨ Core Features
*   **End-to-End Encryption:** Your messages are encrypted before they even leave your device.
*   **Offline-First:** Read and draft messages without an active connection; we sync once you're back.
*   **Glassmorphism Design:** A stunning, translucent UI that adapts to your preferences.
*   **Real-time Analytics:** A full admin dashboard to monitor system health and traffic.

---

## 🧠 Dev Log: The Real-time Challenge
Handling high-concurrency real-time traffic (Socket.io) while maintaining an **Offline-First** state is a classic distributed systems problem. 

**The Solution:** I implemented a **Local-First SQLite Cache** in the Flutter app. When a message is sent, it's immediately written to the local DB and marked as `pending`. The Socket.io emitter handles the background transmission. If the server acks, we update to `sent`. If the connection drops, a background retry-service takes over. This ensures the user never sees a "failed to send" spinner unless it's absolutely necessary.

---

## 🛠 Tech Stack
*   **Mobile:** Flutter & Bloc (for rock-solid state management)
*   **Backend:** NestJS & Socket.io (Scalable WebSocket architecture)
*   **Caching:** Redis (to handle real-time session scaling)
*   **Databases:** MongoDB & PostgreSQL

---

### 👋 Connectivity
Built by **Ahmed Maamoun**. 
[GitHub](https://github.com/Maamoun0) | [LinkedIn](https://linkedin.com/in/your-linkedin-profile)

*Privacy is not a luxury. It's a right.*
