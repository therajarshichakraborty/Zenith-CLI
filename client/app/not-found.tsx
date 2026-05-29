"use client";

import Link from "next/link";
import { MoveLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.08),transparent_30%)]" />
      <div className="absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-background blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] h-[300px] w-[300px] rounded-full bg-background blur-3xl" />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-500 animate-pulse">
          <HelpCircle className="h-12 w-12 animate-bounce" />
        </div>
        <h1 className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 bg-clip-text text-8xl font-black tracking-tight text-transparent md:text-9xl">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Lost in Space?</h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          The page you are looking for doesn't exist, has been moved, or you might have entered an incorrect URL.
        </p>

        <div className="mt-10 w-full">
          <Button
            asChild
            variant="outline"
            className="h-12 w-full rounded-xl border-border bg-card/50 backdrop-blur-xl text-base font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-accent"
          >
            <Link href="/" className="flex items-center justify-center gap-2">
              <MoveLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
