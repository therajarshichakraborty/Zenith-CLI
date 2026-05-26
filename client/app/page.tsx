"use client"

import Image from "next/image"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ShieldCheck,
  Mail,
  Sparkles,
  LogOut,
  Terminal,
} from "lucide-react"
import { ProfileCard } from "@/components/card";
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"

export default function HomePage() {
  const router = useRouter()

  const { data, isPending } = authClient.useSession()
{
  console.log(data)
}
  useEffect(() => {
    if (!isPending && (!data?.session || !data?.user)) {
      router.push("/sign-in")
    }
  }, [data, isPending, router])

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner />

          <p className="animate-pulse text-sm text-muted-foreground">
            Loading your workspace...
          </p>
        </div>
      </div>
    )
  }

  if (!data?.session || !data?.user) {
    return null
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-6 text-foreground">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-background,radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.08),transparent_30%)]" />

      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-background blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-background blur-3xl" />

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-7xl">
          <div className="grid items-center gap-20 lg:grid-cols-2">
            {/* LEFT SIDE */}
            <div>
              <div className="mb-8 flex items-center gap-4">
                

                <p className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 bg-clip-text text-sm font-semibold tracking-[0.35em] text-transparent">
                  ZenithCLI Dashboard
                </p>
              </div>

              <h1 className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 bg-clip-text text-7xl font-black tracking-tight text-transparent md:text-8xl">
                Welcome
              </h1>

              <h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight md:text-6xl">
                {data.user.name}
              </h2>

              <div className="mt-8 h-[4px] w-56 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500" />

              <p className="mt-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Your intelligent terminal-first workspace is ready. Manage
                authentication, automate workflows, and enhance developer
                productivity with a modern AI-powered experience.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                <span>Build</span>
                <span className="text-emerald-500">•</span>
                <span>Automate</span>
                <span className="text-cyan-500">•</span>
                <span>Deploy</span>
                <span className="text-blue-500">•</span>
                <span>Scale</span>
              </div>

              {/* BUTTONS */}
              <div className="mt-12 flex flex-wrap gap-4">

                <Button
                  variant="outline"
                  className="h-12 rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 px-8 text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02]"
                  onClick={() =>
                    authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => router.push("/sign-in"),
                      },
                    })
                  }
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>

           <ProfileCard data={data}/>
          </div>
        </div>
      </div>
    </div>
  )
}