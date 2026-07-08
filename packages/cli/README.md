# @zenith-labs/cli 🚀

The next-generation, terminal-first developer workspace powered by Gemini. Take your terminal experience to the next level with interactive chats, tool execution, and autonomous codebase generation.

---

## ⚡ Features

*   **🔒 Secure Authentication**: Integrated OAuth login (GitHub-backed) with device authorization flow via Better Auth.
*   **💬 Interactive AI Chat**: Rich terminal-rendered markdown chats powered by Google's Gemini models.
*   **🛠️ AI Tool Calling**: Grants the AI model tools to execute Python code, run Google searches, analyze URL content, and search Google Maps.
*   **🤖 Autonomous Agentic Mode**: Build full-stack or frontend applications from a simple descriptive prompt. The agent creates all folders, generates files, and provides clear setup and start instructions.
*   **💡 Decoupled Production Architecture**: Client-server design querying Express API endpoints to securely authorize and sync sessions/conversations.

---

## 🛠️ Installation

You can run the CLI immediately without local installation using `npx`, or install it globally:

```bash
# Run on-demand (npx)
npx @zenith-labs/cli wakeup

# Or install globally
npm install -g @zenith-labs/cli
```

---

## ⚙️ Environment Variables

Before starting Zenith AI, ensure your Gemini API key is configured. The CLI reads the following environment variables:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `GOOGLE_GENERATIVE_AI_API_KEY` | **[Required]** Your Gemini API Key. | None |
| `ZENITH_MODEL` | The Gemini model used for generation. | `gemini-2.5-flash` |
| `ZENITH_TEMPERATURE` | Controls the creativity/randomness of the responses. | `0.7` |
| `ZENITH_MAX_TOKENS` | Max tokens generated in a single response. | `2048` |

Set the variables in your shell profile (`.bashrc`, `.zshrc`, or Windows Env Vars), or load them via a local `.env` file where the CLI command is executed:

```bash
export GOOGLE_GENERATIVE_AI_API_KEY="AIzaSy..."
```

---

## 📖 Command Reference

### `zenith login`

Authenticates your terminal with the Zenith API server. It uses a secure browser-based OAuth device flow.

```bash
zenith login [options]
```

**Options:**
*   `--server-url <url>`: The Zenith authentication server URL (default: `http://localhost:4000`).
*   `--client-id <id>`: Custom GitHub OAuth client ID.

**Example Flow:**
```
◇  Zenith CLI Login
◇  Requesting device authorization...
Please visit: http://localhost:4000/device?user_code=ABCD-1234
Enter code:   ABCD-1234
◇  Open browser automatically? (Yes)
Browser opened. Please sign in and approve the device.
Waiting for authorization...
✅ Authentication Successful!
User Login Successfully
Token saved to ~/.better-auth/token.json
```

---

### `zenith whoami`

Displays the information of the currently authenticated developer.

```bash
zenith whoami
```

**Output:**
```
Logged in to Zenith CLI as:
👤 Name:  John Doe
✉️ Email: john.doe@example.com
```

---

### `zenith wakeup`

Starts the main interactive developer workspace prompt. You will be prompted to select one of the core AI modes.

```bash
zenith wakeup
```

#### 1. Chat Mode
Simple interactive markdown-rendered chat with Gemini.

*   Type `exit` or press `Ctrl + C` to end the session.

#### 2. Tool Calling Mode
Enables the AI to call tools based on your questions. You will get a multi-select prompt to choose which tools to enable:
*   `Google Search` - Search real-time web results.
*   `Code Execution` - Run a secure local Python runtime sandbox to solve complex math or algorithms.
*   `URL Context` - Send URLs for the AI to fetch and analyze content.
*   `Google Maps` - Location-based search.

#### 3. Agentic Mode (Autonomous Codebase Generation)
Instructs Zenith AI to build applications from scratch. The agent will prompt for confirmation and generate all necessary directory structures and code files inside your current working directory.

**Example Request:**
> *"Build a weather app using HTML, Tailwind CSS, and standard JavaScript"*

**Output:**
```
📁 Created directory: weather-app/
  ✓ index.html
  ✓ app.js
  ✓ README.md

✨ Application created successfully!
Location: /home/workspace/weather-app/
📋 Next Steps:
  cd weather-app
  # Open index.html in your browser
```

---

### `zenith logout`

Invalidates and clears your saved credentials on your machine.

```bash
zenith logout
```

---

## 📄 License

MIT License. Copyright (c) 2026 Rajarshi Chakraborty. See the [LICENSE](LICENSE) file for details.
