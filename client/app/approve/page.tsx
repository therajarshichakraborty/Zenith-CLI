"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { CheckCircle, XCircle, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";

function DeviceApprovalContent() {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userCode = searchParams.get("user_code");
  const [isProcessing, setIsProcessing] = useState({
    approve: false,
    deny: false,
  });

  useEffect(() => {
    if (!isPending && !data?.session && !data?.user) {
      const redirectUrl = userCode
        ? `/sign-in?callbackUrl=${encodeURIComponent(`/approve?user_code=${userCode}`)}`
        : "/sign-in";
      router.replace(redirectUrl);
    }
  }, [data, isPending, router, userCode]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p className="animate-pulse text-sm text-muted-foreground">Loading authorization...</p>
        </div>
      </div>
    );
  }

  const handleApprove = async () => {
    setIsProcessing({ approve: true, deny: false });
    try {
      toast.loading("Approving device...", { id: "loading" });
      const { error } = await authClient.device.approve({ userCode: userCode! });
      toast.dismiss("loading");
      if (error) {
        const msg = (error as any)?.error_description || (error as any)?.message || "Failed to approve device";
        toast.error(msg);
        setIsProcessing({ approve: false, deny: false });
        return;
      }
      toast.success("Device approved successfully!");
      router.push("/");
    } catch (err: any) {
      toast.dismiss("loading");
      toast.error(err?.message || "Failed to approve device");
    }
    setIsProcessing({ approve: false, deny: false });
  };

  const handleDeny = async () => {
    setIsProcessing({ approve: false, deny: true });
    try {
      toast.loading("Denying device...", { id: "deny" });
      const { error } = await authClient.device.deny({ userCode: userCode! });
      toast.dismiss("deny");
      if (error) {
        const msg = (error as any)?.error_description || (error as any)?.message || "Failed to deny device";
        toast.error(msg);
        setIsProcessing({ approve: false, deny: false });
        return;
      }
      toast.success("Device denied.");
      router.push("/");
    } catch (err: any) {
      toast.dismiss("deny");
      toast.error(err?.message || "Failed to deny device");
    }
    setIsProcessing({ approve: false, deny: false });
  };

  const codeChars = (userCode || "------").split("");
  const initials = data?.user?.email ? data.user.email.slice(0, 2).toUpperCase() : "??";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 font-sans text-foreground">
      <div className="relative z-10 flex w-full max-w-[390px] flex-col items-center text-center">
        <br />
        <span className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-indigo-400 bg-clip-text text-[11px] font-medium tracking-[0.12em] text-transparent">
          <br />
          ZenithCLI Authorization
        </span>
        <br />
        <h1 className="text-[26px] font-semibold tracking-tight text-foreground">Authorize device</h1>

        {/* Gradient accent bar */}
        <div className="mt-3 h-[3px] w-12 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-500 to-indigo-400" />

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          A new CLI session is requesting access to your authenticated developer workspace.
        </p>

        {/* Code block */}
        <div className="relative w-full overflow-hidden rounded-[14px] bg-background px-4 py-5">
          {/* Subtle inner shimmer */}
          <div className="pointer-events-none absolute inset-0 rounded-[14px]" />

          <p className="mb-3 text-[11px] tracking-[0.1em] text-foreground text-bold">Verification code</p>

          <div className="flex items-center justify-center gap-1.5">
            {codeChars.map((char, index) => {
              if (char === "-") {
                return (
                  <span key={index} className="mx-1 text-base text-muted-foreground/50">
                    &mdash;
                  </span>
                );
              }
              return (
                <div
                  key={index}
                  className="flex h-[46px] w-[38px] items-center justify-center rounded-[10px] border border-border bg-background"
                >
                  <span className="bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-400 bg-clip-text font-mono text-[19px] font-medium text-transparent">
                    {char}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-[11px] text-muted-foreground">Verify this matches the code in your terminal</p>
        </div>

        <div className="mt-3 flex w-full items-center gap-2.5 rounded-[10px] bg-background px-3.5 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-400 text-xs font-medium text-white">
            {initials}
          </div>
          <span className="text-left text-[16px] text-muted-foreground">{data?.user?.email}</span>
        </div>

        {/* Secure session row */}
        <div className="mt-2 flex w-full items-center gap-2 px-5 py-1.5">
          <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500">
            <ShieldCheck className="h-2.5 w-2.5 text-white" />
          </div>
          <span className="text-[12px] text-muted-foreground">Secure developer session active</span>
        </div>

        <div className="mt-6 w-full space-y-2.5">
          <button
            onClick={handleApprove}
            disabled={isProcessing.approve || isProcessing.deny}
            className="group relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-[10px] bg-gradient-to-r from-emerald-400 via-cyan-500 to-indigo-400 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:opacity-90 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {/* Shine sweep */}
            <div className="pointer-events-none absolute left-[-60%] top-0 h-full w-[40%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 group-hover:left-[120%]" />
            {isProcessing.approve ? (
              <>
                <Spinner className="h-4 w-4" />
                <span>Approving access...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Approve device</span>
              </>
            )}
          </button>

          {/* Deny */}
          <Button
            onClick={handleDeny}
            variant="outline"
            disabled={isProcessing.approve || isProcessing.deny}
            className="h-11 w-full rounded-[10px] border border-border bg-transparent text-sm font-medium text-muted-foreground transition-all duration-200 hover:-translate-y-px hover:border-red-500/40 hover:text-red-500 disabled:opacity-50 disabled:hover:translate-y-0 dark:hover:text-red-400"
          >
            {isProcessing.deny ? (
              <>
                <Spinner className="h-4 w-4" />
                <span>Denying request...</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                <span>Deny request</span>
              </>
            )}
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 max-w-[290px] text-[11px] leading-relaxed text-muted-foreground">
          Only approve if you initiated this request. Zenith will never ask you to verify a session code via outside
          communication.
        </p>

        {/* Footer */}
        <div className="mt-4 flex items-center gap-1.5">
          <Lock className="h-3 w-3 text-cyan-500" />
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-indigo-400 bg-clip-text text-[11px] font-medium text-transparent">
            ZenithCLI secure authorization
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DeviceApprovalPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <Spinner />
            <p className="animate-pulse text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <DeviceApprovalContent />
    </Suspense>
  );
}
