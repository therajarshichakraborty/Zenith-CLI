Here's exactly what you need to do, step by step:

---

### Step 1 — Rebuild the CLI (fixes the `bold` crash)

Run this in your terminal:
```bash
cd "D:\Rajarshi Chakraborty ( Arghya )\Projects\Zenith-CLI\packages\cli"
npm run build
```

---

### Step 2 — Set your Google API Key (fixes "API key not found")

In PowerShell, set it as a **permanent system environment variable**:
```powershell
[System.Environment]::SetEnvironmentVariable("GOOGLE_GENERATIVE_AI_API_KEY", "YOUR_KEY_HERE", "User")
```
> Get your key from: [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

Then **close and reopen your terminal** for it to take effect.

---

### Step 3 — Test the full flow

```bash
zenith login      # Should say ✅ Authentication Successful
zenith wakeup     # Should launch AI chat with no crash
```

---

### Step 4 — Push fixes to GitHub (optional, for npm publish later)

```bash
git add .
git commit -m "fix: safe marked-terminal renderer to prevent bold crash"
git push origin main
```

---

That's it! Once the API key is set and CLI is rebuilt, `zenith wakeup` → select **Chat** → ask any question → it will respond with rendered markdown. ✅