<div align="center">

# 🌐 Pulse Chat Platform
### **Enterprise-Grade Real-Time Secure Messaging Infrastructure**

[![Platform: Android & iOS](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-00696E?style=for-the-badge&logo=flutter)](https://flutter.dev)
[![Backend: NestJS](https://img.shields.io/badge/Backend-NestJS-EA2845?style=for-the-badge&logo=nestjs)](https://nestjs.com)
[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Realtime: Socket.io](https://img.shields.io/badge/Realtime-Socket.io-black?style=for-the-badge&logo=socket.io)](https://socket.io)

*A state-of-the-art secure chat ecosystem featuring end-to-end encrypted message pipelines, an elegant Glassmorphism mobile interface, persistent offline-first synchronization, and a robust administrative telemetry hub.*

---

<img src="screenshots/login_page.png" width="260" alt="Login Screen" /> &nbsp;&nbsp;&nbsp; <img src="screenshots/chat_list.png" width="260" alt="Chat List" /> &nbsp;&nbsp;&nbsp; <img src="screenshots/admin_dashboard.png" width="260" alt="Admin Dashboard" />

</div>

---

## ✨ Executive Summary

**Pulse Chat** represents a masterfully engineered communication suite tailored for uncompromised security, cross-device session synchronization, and instantaneous presence tracking. Utilizing an advanced, decoupled micro-architecture, the platform ensures that strict multitenant identity borders isolate user conversations natively at the persistence layer.

> [!IMPORTANT]
> **Live Showcase Included:** This public showcase repository provides the official executable **Android package (`.apk`)** alongside high-fidelity UI screen captures and curated interface implementation samples.

---

## 🚀 Try the Live Build (Android)

Experience the premium aesthetics and blazingly fast Socket engine directly on your mobile device:

1. **Download the Package:** Get the official Android APK directly from this repository:
   👉 **[`pulse_chat_release.apk`](./pulse_chat_release.apk)**
2. **Install:** Authorize installation from external sources if prompted by Android Security.
3. **Register/Login:** Create a free standard identity node using a unique handle and connect instantly to the global real-time cloud server.

---

## 🎨 System Architecture & Telemetry Pipeline

```mermaid
graph LR
    subgraph Frontend Clients
        M[📱 Flutter Mobile App<br>Glassmorphism UI]
        W[💻 React Admin Web<br>Telemetry Dashboard]
    end

    subgraph Transport Engine
        S[⚡ WebSocket Hub<br>Socket.io v4]
        H[🔒 REST Access Gateway<br>NestJS Core]
    end

    subgraph Data & Identity Layer
        DB[(🍃 MongoDB Persistent DB<br>Strict ObjectId Borders)]
        R[(🔴 Redis Edge Cache<br>Presence / State)]
    end

    M <-->|E2E Encrypted Payload| S
    W <-->|Temporal Metric Streams| S
    M -->|JWT Handshakes| H
    W -->|Access Tokens| H
    H --> DB
    S <--> R
    H <--> R
```

---

## 💎 Premium Design System & UI Architecture

The application design leverages bespoke curated color standards tailored to evoke trust, technical prestige, and visual relaxation.

### **Core Aesthetic Pillars:**
* **Frosted Glassmorphism:** Ambient visual blurring (`BackdropFilter`) layered over deep space surfaces with multi-stop micro-gradients.
* **Curated Premium Palette:** Tailored primary variants centered around deep corporate Teal (`#00696E`), neon pulse accents (`#75F5FD`), and pristine dark environments (`#0A192F`).
* **Visual Engine Preferences:** Instantly reactive UI mode bindings switching seamlessly between ambient high-contrast Light themes and optimized AMOLED Dark backdrops.
* **Micro-Animations:** Fluid state scaling, spatial route slides, context action springs, and reactive input targets.

---

## 🛡️ Enterprise Hardening & Security Features

> [!TIP]
> **Robust Data Isolation:** The application enforces structural type validation (`Types.ObjectId`) directly within Mongoose pipeline arrays to prevent cross-account payload contamination.

1. **End-to-End Cryptography (Privacy Guard):** Client-side key negotiation encrypting plaintext before packet leaving host radios.
2. **Offline-First Synchronization Engine:** Background SQLite caching storing messages idempotently. Phantom/stale cache synchronization cleans obsolete records instantly upon peer list updates.
3. **Session Authority Constraints:** Single-device concurrent active node sessions protecting users from hijacked secondary socket links.
4. **Active User Telemetry & Governance:** The **Pulse Control Center** dashboard delivers live metric tracking with instantaneous node restriction bounds and user cleanup access authority.

---

## 📂 Repository Showcase Structure

```text
pulse-chat-public-release/
├── README.md                       # Comprehensive Platform Overview
├── pulse_chat_release.apk          # Installable Debug/Release Build for Android
├── screenshots/                    # High-Fidelity Capture Imagery
│   ├── login_page.png              # Glassmorphism Authentication UI
│   ├── chat_list.png               # Multitenant Message Thread Route
│   └── admin_dashboard.png         # Administrative Telemetry Dashboard
└── showcase-code-samples/          # Curated Excerpts Demonstrating Premium Code Quality
    ├── login_screen.dart           # Flutter Frontend UI Showcase
    ├── Dashboard.tsx               # React Admin Telemetry Control UI
    └── chats.service.ts            # NestJS Backend Data Deduplication Engine
```

---

## 💻 Curated Source Samples

To preserve intellectual property and secure production authentication configurations, this directory showcases selected non-sensitive frontend UI blueprints and optimized database transaction snippets demonstrating robust software patterns:

* **Frontend UI Clean Code:** View the exquisite Flutter UI structure implementing backdrop blur layers and custom text formatting inside **`showcase-code-samples/login_screen.dart`**.
* **React Dashboard Hooks:** Explore optimized socket connections mapping presence graphs via Recharts inside **`showcase-code-samples/Dashboard.tsx`**.
* **Thread Normalization:** See the intelligent array deduplication and active timestamp sorting algorithm powering multitenant access inside **`showcase-code-samples/chats.service.ts`**.

---

## 📜 Legal & Licensing

Created as an advanced production portfolio piece demonstrating clean enterprise development standards. All displayed logo graphics, interface palettes, and internal code assets are fully protected intellectual property.

<div align="center">
  <br>
  <b>Built with passion for flawless visual aesthetics and uncompromised architectural security.</b>
</div>
