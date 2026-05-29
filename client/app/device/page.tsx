"use client";

import { authClient } from "@/lib/auth-client";
import type React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldAlert, Terminal, Loader2, ShieldCheck } from "lucide-react";

export default function DeviceAuthorizationPage() {
  const [userCode, setUserCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formattedCode = userCode.trim().replace(/-/g, "").toUpperCase();
      const response = await authClient.device({
        query: { user_code: formattedCode },
      });

      if (response.data) {
        router.push(`/approve?user_code=${formattedCode}`);
      }
    } catch (err) {
      setError("Invalid or expired code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length > 4) {
      value = value.slice(0, 4) + "-" + value.slice(4, 8);
    }
    setUserCode(value);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.08),transparent_30%)]" />
      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-background blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-background blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-lg shadow-cyan-500/5">
            <Terminal className="h-7 w-7 animate-pulse" />
          </div>
          <p className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 bg-clip-text text-sm font-semibold tracking-[0.35em] text-transparent ">
            Zenith CLI
          </p>
          <h1 className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 bg-clip-text text-4xl font-black tracking-tight text-transparent">
            Device Authorization
          </h1>
          <div className="mt-2 h-[3px] w-32 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-border bg-card/50 backdrop-blur-xl shadow-2xl rounded-2xl p-8 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="code" className="text-sm font-semibold text-muted-foreground">
              Device Code
            </label>
            <input
              id="code"
              type="text"
              value={userCode}
              onChange={handleCodeChange}
              placeholder="XXXX-XXXX"
              maxLength={9}
              className="h-14 w-full rounded-xl border border-border bg-background/50 px-4 text-center text-2xl font-bold tracking-widest font-mono uppercase text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter the verification code displayed in your terminal.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || userCode.length < 9}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
            {isLoading ? "Verifying..." : "Authorize Device"}
          </button>

          <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20 text-xs leading-relaxed text-muted-foreground">
            This authorization code is unique to your terminal session. Approving this request will grant the CLI access
            to your Zenith profile.
          </div>
        </form>
      </div>
    </div>
  );
}
