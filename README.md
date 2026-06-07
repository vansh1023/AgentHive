# AgentHive

**AgentHive** is an AI-powered cloud IDE that dynamically provisions isolated Kubernetes-based development environments for users. It combines a browser-based IDE, live preview, terminal access, and an AI coding assistant capable of reading and modifying project files in real time.

## ✨ Features

* 🔐 Google OAuth & JWT-based authentication
* ☁️ On-demand Kubernetes sandbox provisioning
* 🤖 AI-powered code generation and file modification
* 📂 File Explorer & Workspace Management
* 💻 Browser-based Terminal
* ⚡ Live Preview with Vite HMR
* 🔄 Dynamic Subdomain Routing
* 📬 Event-driven Notifications with RabbitMQ
* 🧹 Automatic Sandbox Cleanup using Redis TTL

---

## 🏗️ Architecture

AgentHive follows a microservices architecture:

```text
Frontend
   │
Ingress
   │
 ┌───────────────┬───────────────┬───────────────┐
 │ Auth Service │ Sandbox Svc   │ AI Service    │
 │              │               │               │
 └───────────────┴───────────────┴───────────────┘
         │               │               │
         └──── Router Service ───────────┘
                        │
                Kubernetes Cluster
                        │
               Sandbox Pods (1/User)
```

Each user receives an isolated Kubernetes sandbox containing:

* React + Vite development environment
* Agent sidecar container
* Shared workspace volume
* Live preview endpoint
* Interactive terminal

---

## 🚀 How It Works

1. User authenticates via Google OAuth.
2. Sandbox Service provisions a dedicated Kubernetes pod.
3. Frontend loads the cloud IDE.
4. User interacts with the AI assistant.
5. AI Service uses LangChain tools to:

   * List files
   * Read files
   * Create files
   * Update files
6. Agent sidecar performs file operations inside the sandbox.
7. Vite detects file changes and triggers Hot Module Reloading.
8. Updated application appears instantly in the preview.

---

## 🧠 AI Workflow

Unlike traditional AI assistants that only generate code snippets, AgentHive's AI can directly operate on project files.

```text
User Prompt
      │
      ▼
 AI Service
      │
 LangChain Agent
      │
 Tool Calls
      │
 Sandbox Agent
      │
 File Operations
      │
 Shared Workspace
      │
 Vite HMR
      │
 Live Preview Update
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* xterm.js

### Backend

* Node.js
* Express

### AI

* LangChain
* LangGraph
* Mistral AI

### Infrastructure

* Docker
* Kubernetes
* NGINX Ingress

### Data & Messaging

* MongoDB
* Redis
* RabbitMQ

### Authentication

* Google OAuth
* JWT

---

## 🔧 Core Services

| Service              | Responsibility                    |
| -------------------- | --------------------------------- |
| Auth Service         | Authentication, OAuth, JWT        |
| Sandbox Service      | Sandbox lifecycle management      |
| AI Service           | AI orchestration & tool execution |
| Router Service       | Dynamic preview and agent routing |
| Notification Service | Email notifications via RabbitMQ  |

---

## 🔥 Key Engineering Concepts

* Kubernetes-based sandbox isolation
* Sidecar container architecture
* Dynamic reverse proxy routing
* AI tool-calling workflows
* Event-driven microservices
* Redis TTL lifecycle management
* Real-time streaming with Server-Sent Events (SSE)

---

## 📈 Future Improvements

* Persistent project storage
* Multi-framework support (Next.js, Vue, Angular)
* Collaborative editing
* Sandbox snapshots
* Usage quotas and billing
* Production-grade observability

---

## 📜 License

This project was built as a cloud-native systems and AI engineering learning project to explore the architecture behind platforms such as Replit, GitHub Codespaces, and Lovable.
