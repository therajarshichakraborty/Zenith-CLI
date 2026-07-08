# Zenith CLI - Current Code Status & Publishing Guide

This document summarizes the current status of the decoupled **Zenith CLI** codebase and outlines how to test and publish it.

---

## 🔍 Core Improvements Made

1.  **🔌 Decoupled Architecture**:
    *   Direct database (Prisma) and server-side service (`ChatService`) imports have been completely removed from the CLI.
    *   The CLI now queries standard Express server endpoints (`/api/user/whoami`, `/api/chats`, `/api/chats/message`, etc.) using a reusable `apiRequest` client inside `packages/cli/src/lib/api.ts`.
2.  **📦 Standalone NPM Sub-Package (`packages/cli`)**:
    *   Set up a clean NPM structure containing dedicated configurations (`package.json`, `tsconfig.json`, `tsup.config.ts`).
    *   Bundling is managed via `tsup`, compiling `src/bin/zenith.ts` directly into a single ESM executable `dist/zenith.js`.
    *   Package assets `README.md` and `LICENSE` have been created inside the sub-package directory.
3.  **⚡ Resolved Eager Module-Load Crash**:
    *   Top-level instantiations of `GoogleAiService` have been wrapped in a lazy `getAiService()` getter function in `chatWithAI.ts`, `chatWithTools.ts`, and `chatWithAgent.ts`.
    *   This ensures that non-AI commands (like `zenith --version` or `zenith login`) run smoothly without checking for a Gemini API key.
4.  **🚨 Better-Auth Configuration**:
    *   Auth flow stores the authentication server URL (`serverUrl`) in the token file at login so the CLI can connect dynamically from anywhere.

---

## 🛠️ Verification & Testing Steps

To test the local modifications in your workspace, follow these steps:

### 1. Rebuild the Bundle
Compile your TypeScript files to a flat ESM bundle in `dist/`:
```bash
cd packages/cli
bun run build
```

### 2. Verify Lazy Loading
Test that the version command runs successfully under Node without crashing on missing env keys:
```bash
node dist/zenith.js --version
```
*(Expected Output: `version : 1.0.1`)*

### 3. Update the Global Executable Path
If you want to run `zenith` globally in your shell instead of typing `node dist/zenith.js`, force-link the global reference:
```bash
npm link --force
```
Then run it anywhere:
```bash
zenith --version
```

### 4. Publish to NPM
Publish version `1.0.1` to the NPM registry:
```bash
npm publish --access public
```
