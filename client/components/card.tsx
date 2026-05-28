import { Mail, ShieldCheck, Terminal } from "lucide-react";
import Image from "next/image";

export function ProfileCard({ data }: any) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-[380px] flex-col items-center text-center">
        {/* Heading */}
        <h2 className="text-[22px] font-medium tracking-tight text-foreground">Profile</h2>
        <p className="mt-1.5 mb-7 text-sm text-muted-foreground">Your authenticated workspace</p>

        {/* Avatar */}
        <div className="relative mb-4">
          <Image
            src={data.user.image || "/vercel.svg"}
            alt={data.user.name || "User"}
            width={80}
            height={80}
            className="rounded-full border border-border bg-muted object-cover"
          />
          <div className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
        </div>

        {/* Name */}
        <p className="text-[17px] font-medium text-foreground">{data.user.name}</p>
        <p className="mt-1 mb-8 text-[13px] text-muted-foreground">Authenticated Developer</p>

        {/* Info fields */}
        <div className="w-full space-y-2.5 mb-5">
          <button className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-[10px] text-sm font-medium text-foreground transition-colors hover:bg-white dark:bg-white dark:text-black bg-black text-white hover:text-black dark:hover:bg-black dark:hover:text-white ">
            <span>{data.user.email}</span>
          </button>

          <div className="flex items-center gap-2.5 rounded-lg bg-muted px-3.5 py-2.5">
            <ShieldCheck className="h-[15px] w-[15px] shrink-0 text-muted-foreground" />
            <span className="text-[13px] text-foreground">Secure session active</span>
          </div>
        </div>

        {/* Primary CTA */}
        {/* <button className="w-full rounded-lg bg-foreground py-[11px] text-sm font-medium text-background transition-opacity hover:opacity-90 mb-3">
          Open Workspace
        </button> */}

        {/* Divider */}
        {/* <div className="relative w-full mb-3">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-[11px] uppercase tracking-widest text-muted-foreground">
              or continue with
            </span>
          </div>
        </div> */}

        {/* GitHub */}
        {/* <button className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-[10px] text-sm font-medium text-foreground transition-colors hover:bg-muted">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          GitHub
        </button> */}

        {/* Legal */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          By continuing, you agree to our{" "}
          <a href="#" className="underline underline-offset-2">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
