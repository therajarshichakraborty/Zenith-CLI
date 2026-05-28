"use client";

import Image from "next/image";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const onLogin = async () => {
    try {
      setIsLoading(true);
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "http://localhost:3000",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 text-foreground">
      <div className="absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-background blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] h-[300px] w-[300px] rounded-full bg-background blur-3xl" />

      <div className="relative z-10 flex max-w-5xl flex-col items-center text-center">
        <div className="mb-6 flex items-center gap-5">
          <div className="h-[1px] w-14 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500" />

          <h2 className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 bg-clip-text font-serif text-4xl italic tracking-wide text-transparent md:text-5xl">
            Welcome to
          </h2>

          <div className="h-[1px] w-14 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500" />
        </div>
        <h1 className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 bg-clip-text text-7xl font-black tracking-tight text-transparent md:text-9xl">
          ZenithCLI
        </h1>

        <div className="mt-8 h-[3px] w-52 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500" />

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-muted-foreground">
          <span>Build</span>
          <span className="text-red-500">•</span>
          <span>Automate</span>
          <span className="text-pink-500">•</span>
          <span>Authenticate</span>
          <span className="text-purple-500">•</span>

          <span>Elevate</span>
        </div>

        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          ZenithCLI is an advanced AI-powered CLI platform for developers, enabling intelligent code assistance,
          automation, authentication management, workflow optimization, and productivity enhancement through a fast and
          scalable terminal-first experience.
        </p>

        <div className="mt-12 w-full max-w-sm">
          <Button
            variant="outline"
            className="h-14 w-full border-border bg-card text-base font-medium shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-accent"
            type="button"
            disabled={isLoading}
            onClick={onLogin}
          >
            {isLoading ? (
              <Loader2 className="mr-2 size-5 animate-spin" />
            ) : (
              <Image src="/image.png" alt="Github" height={20} width={20} className="mr-2 size-5 dark:invert" />
            )}

            {isLoading ? "Connecting..." : "Continue with GitHub"}
          </Button>
        </div>
      </div>
    </div>
  );
}
