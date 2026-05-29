import { Mail, ShieldCheck, Terminal } from "lucide-react";
import Image from "next/image";

export function ProfileCard({ data }: any) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-[380px] flex-col items-center text-center">
        <h2 className="text-[22px] font-medium tracking-tight text-foreground">Profile</h2>
        <p className="mt-1.5 mb-7 text-sm text-muted-foreground">Your authenticated workspace</p>
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
        <p className="text-[17px] font-medium text-foreground">{data.user.name}</p>
        <p className="mt-1 mb-8 text-[13px] text-muted-foreground">Authenticated Developer</p>
        <div className="w-full space-y-2.5 mb-5">
          <button className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-[10px] text-sm font-medium text-foreground transition-colors hover:bg-white dark:bg-white dark:text-black bg-black text-white hover:text-black dark:hover:bg-black dark:hover:text-white ">
            <span>{data.user.email}</span>
          </button>

          <div className="flex items-center gap-2.5 rounded-lg bg-muted px-3.5 py-2.5">
            <ShieldCheck className="h-[15px] w-[15px] shrink-0 text-muted-foreground" />
            <span className="text-[13px] text-foreground">Secure session active</span>
          </div>
        </div>
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
