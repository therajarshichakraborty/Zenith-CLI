Here is the comprehensive overview of the architecture and current state of your project, covering the Backend Server, CLI, and Frontend Client.

🗺️ System Architecture
Your project is built as a decoupled, multi-tier developer workspace following the OAuth 2.0 Device Authorization Flow (RFC 8628):

mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer
    participant CLI as Zenith CLI (Node.js)
    participant Client as Next.js Frontend (Port 3000)
    participant Server as Express Server (Port 4000)
    participant DB as Neon PostgreSQL DB
    Dev->>CLI: zenith login
    CLI->>Server: Request Device Code (device.code)
    Server-->>CLI: Return user_code & verification URI
    CLI->>Dev: Print code & open browser
    Note over Dev, Client: Browser opens Client at http://localhost:3000/device
    Dev->>Client: Log in via GitHub OAuth & approve code
    Client->>Server: Authenticate & link user session
    Server->>DB: Save Session & link Device Code
    
    loop Polling
        CLI->>Server: Poll for access token (device.token)
    end
    Server-->>CLI: Return access_token & refresh_token
    CLI->>CLI: Save token to ~/.better-auth/token.json
    Dev->>CLI: zenith wakeup
    CLI->>Server: GET /api/user/whoami (Bearer Token)
    Server->>DB: Validate Session Token
    DB-->>Server: Return User Details
    Server-->>CLI: User Authenticated
    CLI->>Dev: Starts Chat, Tools, or Agent loops
1. 🤖 The Zenith CLI (packages/cli)
A standalone CLI tool compiled for production and publishing on the NPM registry.

Runtime/Module Setup: ESM ("type": "module"), bundled into a single flat file dist/zenith.js using tsup and esbuild.
Entry Point: packages/cli/src/bin/zenith.ts.
Core Commands:
zenith login: Device authentication flow via better-auth/client. Captures and saves the backend serverUrl inside ~/.better-auth/token.json so CLI requests connect to the correct server.
zenith whoami: Queries /api/user/whoami to verify the active session.
zenith wakeup: Prompts user to select:
Chat Mode: Simple conversational interface.
Tool Calling Mode: Provides the model with access to Google Search, Code Execution (local Python sandbox), URL Context, and Google Maps.
Agentic Mode: Generates complete directory structures and files for new applications based on prompts.
zenith logout: Deletes ~/.better-auth/token.json.
Current Decoupling Fixes:
Removed all Prisma/database dependencies.
Google AI service creation is lazy (via getAiService()), preventing startup crashes when no GOOGLE_GENERATIVE_AI_API_KEY is present.
GITHUB_CLIENT_ID is baked directly into the JS bundle during tsup build, eliminating client-side env variables.
2. ⚡ The Backend Server (server)
An Express server running on port 4000 that handles the core business logic, database queries, and OAuth flows.

Database Integration: Connects to a PostgreSQL database hosted on Neon using Prisma.
Auth System: Integrated with Better Auth using the prismaAdapter and the deviceAuthorization plugin.
API Routes (server/src/app.ts):
all /api/auth/{*any}: Better Auth API routes (social login, device authentication, code confirmation).
GET /device: Redirects code confirmation prompts to the client frontend (http://localhost:3000/device?user_code=xxxx).
GET /api/user/whoami: Middleware-secured route validating Bearer tokens.
POST /api/chats: Retrieves or creates conversation logs (Conversation model).
POST /api/chats/message: Logs user and assistant turns (Message model).
GET /api/chats/:conversationId/messages: Fetches past conversations.
PUT /api/chats/:conversationId/title: Updates session titles.
3. 🎨 The Frontend Client (client)
A Next.js application running on port 3000 that handles user-facing web actions and logins.

UI Stack: React 19, Next.js App Router, styled using Tailwind CSS, with Shadcn UI and Radix UI components.
Authentication: Uses @base-ui/react and better-auth client libraries to authenticate developers (via GitHub OAuth) and authorize the device codes sent from the CLI.
Core Route:
/device?user_code=xxxx: The interactive authorization view where developers verify the code printed by their terminal to log in.