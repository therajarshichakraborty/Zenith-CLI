// "use client";

// import { Suspense, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Spinner } from "@/components/ui/spinner";
// import { authClient } from "@/lib/auth-client";
// import { CheckCircle, XCircle, ShieldCheck, Lock } from "lucide-react";
// import { toast } from "sonner";

// function DeviceApprovalContent() {
//   const { data, isPending } = authClient.useSession();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const userCode = searchParams.get("user_code");
//   const [isProcessing, setIsProcessing] = useState({
//     approve: false,
//     deny: false,
//   });

//   if (isPending) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-background">
//         <div className="flex flex-col items-center gap-4">
//           <Spinner />
//           <p className="animate-pulse text-sm text-muted-foreground">Loading authorization...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!data?.session && !data?.user) {
//     router.push("/sign-in");
//     return null;
//   }

//   const handleApprove = async () => {
//     setIsProcessing({ approve: true, deny: false });
//     try {
//       toast.loading("Approving device...", { id: "loading" });
//       await authClient.device.approve({ userCode: userCode! });
//       toast.dismiss("loading");
//       toast.success("Device approved successfully!");
//       router.push("/");
//     } catch (error) {
//       toast.error("Failed to approve device");
//     }
//     setIsProcessing({ approve: false, deny: false });
//   };

//   const handleDeny = async () => {
//     setIsProcessing({ approve: false, deny: true });
//     try {
//       toast.loading("Denying device...", { id: "deny" });
//       await authClient.device.deny({ userCode: userCode! });
//       toast.dismiss("deny");
//       toast.success("Oops! Device denied to approve!");
//       router.push("/");
//     } catch (error) {
//       toast.error("Failed to deny device");
//     }
//     setIsProcessing({ approve: false, deny: false });
//   };

//   return (
//     <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 text-foreground font-sans">
//       {/* Background gradients */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.08),transparent_30%)]" />
//       <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-background blur-3xl" />
//       <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-background blur-3xl" />

//       {/* Main card/box centered layout */}
//       <div className="relative z-10 flex w-full max-w-[380px] flex-col items-center text-center">
//         {/* Subtitle / Header Badge */}
//         <div className="mb-3">
//           <p className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 bg-clip-text text-xs font-semibold tracking-[0.25em] text-transparent">
//             ZenithCLI Authorization
//           </p>
//         </div>

//         {/* Heading */}
//         <h2 className="text-[28px] font-bold tracking-tight text-foreground md:text-[32px]">
//           Authorize Device
//         </h2>

//         {/* Gradient underline matching the dashboard name style */}
//         <div className="mt-3.5 h-[4px] w-40 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500" />

//         <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
//           A new CLI session is requesting permission to access your authenticated developer workspace.
//         </p>

//         <div className="mt-8 w-full space-y-2">
//           <div className="relative overflow-hidden rounded-xl bg-black dark:bg-background px-5 py-6 text-center shadow-md dark:border-white/[0.08] ">
//             <div className="absolute top-3 left-3 flex gap-1">
//               <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-800" />
//               <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-800" />
//               <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-800" />
//             </div>

//             <div className="flex flex-col gap-4 pt-2 items-right justify-start">
//               <span className="text-xs font-semibold tracking-wider text-white">
//                 Verification Code
//               </span>
//               <div className="flex items-center justify-center gap-1.5 select-all">
//                 {(userCode || "------").split("").map((char, index) => {
//                   if (char === "-") {
//                     return (
//                       <span key={index} className="text-xl font-bold text-muted-foreground/60 mx-1">
//                         &mdash;
//                       </span>
//                     );
//                   }
//                   return (
//                     <span
//                       key={index}
//                       className="flex h-12 w-10 items-center justify-center rounded-lg border border-border bg-background font-mono text-xl font-extrabold text-cyan-500 shadow-sm dark:bg-zinc-900/60"
//                     >
//                       {char}
//                     </span>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//           <p className="text-[11px] text-muted-foreground">
//             Verify this code matches the code displayed in your terminal.
//           </p>
//         </div>

//         <div className="mt-6 w-full space-y-2.5">
//           <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-[10px] text-sm font-medium text-foreground transition-colors hover:bg-white dark:bg-white dark:text-black bg-black text-white hover:text-black dark:hover:bg-black dark:hover:text-white">
//             <span>{data?.user?.email}</span>
//           </button>

//           <div className="flex items-center gap-2.5 rounded-lg bg-muted px-3.5 py-2.5">
//             <ShieldCheck className="h-[15px] w-[15px] shrink-0 text-muted-foreground" />
//             <span className="text-[13px] text-foreground text-left font-medium">Secure developer session active</span>
//           </div>
//         </div>

//         {/* Action Buttons styled like dashboard */}
//         <div className="mt-8 w-full space-y-3">
//           <Button
//             onClick={handleApprove}
//             disabled={isProcessing.approve || isProcessing.deny}
//             className="h-11 w-full rounded-lg bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02] hover:opacity-90 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
//           >
//             {isProcessing.approve ? (
//               <>
//                 <Spinner className="h-4 w-4" />
//                 <span>Approving Access...</span>
//               </>
//             ) : (
//               <>
//                 <CheckCircle className="h-4 w-4" />
//                 <span>Approve Device</span>
//               </>
//             )}
//           </Button>

//           <Button
//             onClick={handleDeny}
//             variant="outline"
//             disabled={isProcessing.approve || isProcessing.deny}
//             className="h-11 w-full rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 hover:text-destructive hover:border-destructive/30"
//           >
//             {isProcessing.deny ? (
//               <>
//                 <Spinner className="h-4 w-4" />
//                 <span>Denying Request...</span>
//               </>
//             ) : (
//               <>
//                 <XCircle className="h-4 w-4" />
//                 <span>Deny Request</span>
//               </>
//             )}
//           </Button>
//         </div>

//         {/* Security Warning Disclaimer */}
//         <p className="mt-8 text-[11px] text-muted-foreground leading-relaxed">
//           For security, only approve this request if you initiated it yourself. Zenith will never ask you to verify a session code via outside communication.
//         </p>

//         {/* Footer brand info */}
//         <div className="mt-6 flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
//           <Lock className="h-3 w-3" />
//           <span>ZenithCLI Secure Authorization</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function DeviceApprovalPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="flex min-h-screen items-center justify-center bg-background">
//           <div className="flex flex-col items-center gap-4">
//             <Spinner />
//             <p className="animate-pulse text-sm text-muted-foreground">Loading...</p>
//           </div>
//         </div>
//       }
//     >
//       <DeviceApprovalContent />
//     </Suspense>
//   );
// }

"use client";

import { Suspense, useState } from "react";
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

  if (!data?.session && !data?.user) {
    router.push("/sign-in");
    return null;
  }

  const handleApprove = async () => {
    setIsProcessing({ approve: true, deny: false });
    try {
      toast.loading("Approving device...", { id: "loading" });
      await authClient.device.approve({ userCode: userCode! });
      toast.dismiss("loading");
      toast.success("Device approved successfully!");
      router.push("/");
    } catch {
      toast.error("Failed to approve device");
    }
    setIsProcessing({ approve: false, deny: false });
  };

  const handleDeny = async () => {
    setIsProcessing({ approve: false, deny: true });
    try {
      toast.loading("Denying device...", { id: "deny" });
      await authClient.device.deny({ userCode: userCode! });
      toast.dismiss("deny");
      toast.success("Device denied.");
      router.push("/");
    } catch {
      toast.error("Failed to deny device");
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
