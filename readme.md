# 🌌 Zenith CLI

[![Bun](https://img.shields.io/badge/Runtime-Bun%20v1.3%2B-FBB03B?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%20v15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Express](https://img.shields.io/badge/Backend-Express%20v5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Database-Prisma%20%26%20Postgres-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white)](https://deepmind.google/technologies/gemini/)

> **The developer toolkit that gets out of your way.**

Zenith CLI is a next-generation, terminal-first developer workspace powered by Gemini. Seamlessly manage secure authentication, invoke smart developer tools, and autonomously scaffold full applications directly from your terminal or visualize your sessions in a modern developer dashboard.

---

## 📸 Developer Dashboard

![ZenithCLI Dashboard](client/public/landing.png)
_Zenith CLI includes a clean, glassmorphic React dashboard for session and user profile management._

---

## ✨ Features

- 🔐 **Secure Device-Code Login**: OAuth-based authentication directly from the terminal via Github, utilizing `better-auth` for session handling.
- 💬 **AI Assistant Integration**: Wake up the AI assistant with `zenith wakeup` for interactive, natural language conversation.
- 🛠️ **Smart Tool Calling**: The AI has access to a collection of robust developer tools:
  - **Google Search**: For real-time updates and checking current documentation.
  - **Code Execution**: Generate and execute Python code on the fly to perform complex math or data processing.
  - **URL Context**: Feed any URL context to the AI directly for precise codebase or documentation analysis.
  - **Google Maps**: Search Google Maps directly.
- 🤖 **Autonomous Agentic Mode**: Describe the application you want to build, and Zenith's autonomous generator will:
  - Create complete files and folder structures.
  - Set up configurations (`package.json`, `.gitignore`, etc.).
  - Output run and install scripts.
  - Deliver production-ready code with absolutely zero placeholders.
- 🖥️ **Developer Dashboard**: A beautiful, modern web dashboard built with Next.js, TailwindCSS, and Shadcn UI.

---

## 🏗️ Architecture

```mermaid
graph TD
    User([Developer]) <-->|CLI Commands| CLI[Zenith CLI - Bun]
    CLI <-->|OAuth / Device Flow| Server[Express Server - Port 4000]
    Server <-->|Prisma Client| DB[(PostgreSQL Database)]
    Client[Next.js App - Port 3000] <-->|APIs / Auth Status| Server
    CLI <-->|Gemini AI SDK| Gemini[Google Gemini AI]
    Gemini -.->|Tool Callbacks| CLI
```

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have the following installed on your system:

- **[Bun](https://bun.sh)** (recommended runtime) or Node.js (v18+)
- **[PostgreSQL](https://www.postgresql.org/)** Database
- **Google Gemini API Key** (Get one at [Google AI Studio](https://aistudio.google.com/))
- **GitHub OAuth Client ID & Secret** (for Better Auth)

---

### 🔧 Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/therajarshichakraborty/Zenith-CLI.git
   cd Zenith-CLI
   ```

2. **Install Root and Workspace Dependencies**:
   ```bash
   # Install global devDependencies
   bun install
   ```

---

### ⚙️ Environment Configuration

Set up environment variables in both `server/` and `client/` directories.

#### 1. Server Environment (`server/.env`)

Create a file named `.env` in the `server` directory:

```env
PORT=4000
DATABASE_URL="postgresql://username:password@localhost:5432/zenith_db"

# Better Auth Configuration
BETTER_AUTH_SECRET="your_better_auth_secret_any_random_string"
BETTER_AUTH_URL="http://localhost:4000"

# GitHub OAuth App credentials
GITHUB_CLIENT_ID="your_github_oauth_client_id"
GITHUB_CLIENT_SECRET="your_github_oauth_client_secret"

# Google Gemini API
GOOGLE_GENERATIVE_AI_API_KEY="your_google_gemini_api_key"

# AI Options (Optional)
ZENITH_MODEL="gemini-2.5-flash"
ZENITH_TEMPERATURE="0.7"
ZENITH_MAX_TOKENS="2048"
```

#### 2. Client Environment (`client/.env`)

Create a file named `.env` in the `client` directory:

```env
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_SERVER_URL="http://localhost:4000"
```

---

### 🗄️ Database Initialization

Initialize the PostgreSQL database using Prisma migrations:

```bash
cd server
bun run prisma:migrate
bun run prisma:generate
```

---

### ⚡ Running Locally

Start both the server and client in development mode.

```bash
# In the server directory (starts on http://localhost:4000)
cd server
bun run dev

# In a new terminal, in the client directory (starts on http://localhost:3000)
cd client
bun run dev
```

---

## 📟 CLI Commands

Zenith CLI is built with `commander.js` and provides an intuitive, interactive CLI layout.

| Command         | Description                                                         | Options                                                                         |
| :-------------- | :------------------------------------------------------------------ | :------------------------------------------------------------------------------ |
| `zenith login`  | Authenticate the CLI with GitHub using the OAuth Device flow.       | `--server-url <url>` (default: `http://localhost:4000`) <br> `--client-id <id>` |
| `zenith logout` | Log out and clear stored session credentials locally.               | None                                                                            |
| `zenith whoami` | Show information about the currently authenticated user.            | `--server-url <url>`                                                            |
| `zenith wakeup` | Wake up the AI engine. Opens interactive prompt to select AI Modes. | None                                                                            |

### 🤖 AI Modes in `zenith wakeup`

When you wake up the AI, you can choose from three main modes:

1. **Chat Mode**:
   A simple, direct conversation loop with the Gemini assistant right inside your terminal. Great for quick questions or syntax checks.

2. **Tool Calling Mode**:
   Allows you to select specific tools you want to make available to the model (Google Search, Code Execution, URL Context, etc.). The model will automatically trigger these tools depending on your request.

3. **Agentic Mode (Autonomous App Generator)**:
   Provide a prompt describing what you want to build (e.g., _“Create an Express API with PostgreSQL connections and simple authentication”_). Zenith CLI will autonomously scaffold directories, write implementation files, compile dependencies into a `package.json`, and output the next steps.

---

## 🧪 Development Commands

- **Format Code**:
  Format both client and server files using Prettier:

  ```bash
  bun run format
  ```

- **Open Database Studio**:
  View and edit database rows directly through Prisma Studio:
  ```bash
  cd server
  bun run prisma:studio
  ```

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
