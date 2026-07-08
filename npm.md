# 🚀 Publishing Zenith CLI to NPM: Production Guide

This guide walks you through compiling, testing, and publishing the newly decoupled **Zenith CLI** package to the live NPM registry.

We have successfully **decoupled the CLI from direct database access**, moved all DB/service operations to backend Express API endpoints, created a dedicated sub-package at `packages/cli`, and updated paths accordingly.

---

## 🗺️ Completed Architecture
The CLI is now completely decoupled and communicates with the backend server via HTTP:

```mermaid
graph LR
    subgraph Local User Machine
        User([Developer]) --> CLI[zenith Command]
        CLI --> Config["~/.zenith/config.json <br> (Stores OAuth Tokens)"]
    end
    subgraph Cloud / Production Server
        CLI -->|HTTPS Requests| API["Zenith API Server <br> (Express / Better-Auth)"]
        API --> DB[(Production PostgreSQL)]
    end
```

---

## 🛠️ Step-by-Step Publishing & Testing Instructions

Follow these steps to build, link, test, and publish your package.

### Step 1: Start the Backend Server
The CLI communicates with the Express backend server to authenticate sessions, load conversations, and persist chat logs. Start the server from the root of the project:

```bash
# In the project root or server/ directory
bun run dev
# OR
npm run dev
```

### Step 2: Install CLI Dependencies
Navigate to the new `packages/cli` directory and install the dedicated dependencies:

```bash
cd packages/cli
npm install
```

### Step 3: Compile the CLI
Build the production bundle of the CLI. This uses **tsup** (powered by `esbuild`) to compile and bundle the TypeScript code into a single executable ESM file inside the `dist` directory:

```bash
npm run build
```

Verify that the `dist/` directory has been created and contains:
- `dist/bin/zenith.js` (executable CLI bundle)
- `dist/bin/zenith.d.ts` (type definitions)

---

### Step 4: Test Your CLI Package Locally

To ensure the CLI executes and contacts the server properly, use one of the following local verification methods:

#### Method A: NPM Link (Recommended for Development)
Creating a global symlink lets you run `zenith` anywhere on your machine, with changes automatically reflected upon rebuilds:

1. Link the package globally:
   ```bash
   npm link
   ```
2. Test the authenticated user commands:
   ```bash
   zenith whoami
   ```
3. Wake up the AI and start a chat session:
   ```bash
   zenith wakeup
   ```
4. Verify logout functionality:
   ```bash
   zenith logout
   ```
5. Once testing is finished, clean up by unlinking:
   ```bash
   npm unlink -g zenith-cli
   ```

#### Method B: Tarball Packaging (Safest for Production Verification)
This method replicates the exact package state that will be uploaded to the NPM registry:

1. Generate the package tarball:
   ```bash
   npm pack
   ```
   This creates a file named `zenith-cli-1.0.0.tgz` in your `packages/cli` folder.
2. Install this tarball globally:
   ```bash
   npm install -g ./zenith-cli-1.0.0.tgz
   ```
3. Run the commands to verify:
   ```bash
   zenith wakeup
   ```
4. Once verified, clean up:
   ```bash
   npm uninstall -g zenith-cli
   ```

---

### Step 5: Publish to NPM Registry

#### 1. Create an NPM Account
If you don't have one, sign up at [npmjs.com/signup](https://www.npmjs.com/signup).

#### 2. Authenticate Terminal
Log into your NPM account from your terminal:
```bash
npm login
```

#### 3. Verify Package Name Availability
NPM packages must have a unique name. Check if `zenith-cli` is available:
```bash
npm info zenith-cli
```
- If it returns **404 Not Found**, it is **available**!
- If it returns details/version numbers, it is **already taken**. You should change the `"name"` in `packages/cli/package.json` (e.g. to `@your-username/zenith-cli` or `zenith-workspace-cli`).

#### 4. Publish to NPM
Publish the package to the public registry:
```bash
npm publish --access public
```

---

### Step 6: Continuous Integration & Updates

To push updates:
1. Increment the version number according to Semantic Versioning (SemVer):
   ```bash
   # Patch update (bugfixes): 1.0.0 -> 1.0.1
   npm version patch

   # Minor update (new backward-compatible features): 1.0.0 -> 1.1.0
   npm version minor

   # Major update (breaking changes): 1.0.0 -> 2.0.0
   npm version major
   ```
2. Run `npm publish` again.

#### Auto-Publish via GitHub Actions
Add a GitHub action to automatically publish releases. Create `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
      - name: Install dependencies
        run: npm ci
        working-directory: ./packages/cli
      - name: Build package
        run: npm run build
        working-directory: ./packages/cli
      - name: Publish to NPM
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
        working-directory: ./packages/cli
```
*Generate an automation token on [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens) and add it as a secret named `NPM_TOKEN` in your repository.*

---

## 🧹 Housekeeping
To prevent obsolete source code from causing confusion, we recommend deleting the old, tightly coupled CLI directory:
```bash
git rm -rf server/src/cli
```
*(The server's local `npm run zenith` command has been updated to automatically target `packages/cli/src/bin/zenith.ts` so developers can still run it locally).*
