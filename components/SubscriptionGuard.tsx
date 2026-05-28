"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Sparkles, ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export default function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isBlocked, setIsBlocked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkSubscriptionStatus();
  }, [pathname, searchParams]);

  const checkSubscriptionStatus = () => {
    // 1. If we are on the subscription checkout page itself, NEVER block it
    if (pathname === "/dashboard/subscribe") {
      setIsBlocked(false);
      return;
    }

    // 2. Check for manual demo simulation via query parameters (e.g. ?demo_expired=true)
    const isDemoExpired = searchParams.get("demo_expired") === "true";
    if (isDemoExpired) {
      setIsBlocked(true);
      return;
    }

    // 3. Check subscription status in localStorage
    const isSubscribed = localStorage.getItem("isSubscribed") === "true";
    if (isSubscribed) {
      setIsBlocked(false);
      return;
    }

    // 4. Trial expiration calculation (24 hours after login)
    const loginTimestampStr = localStorage.getItem("loginTimestamp");
    if (loginTimestampStr) {
      const loginTimestamp = parseInt(loginTimestampStr, 10);
      const oneDayInMs = 24 * 60 * 60 * 1000;
      const elapsedTime = Date.now() - loginTimestamp;

      if (elapsedTime > oneDayInMs) {
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
      }
    } else {
      // If timestamp doesn't exist, initialize it to start the trial
      localStorage.setItem("loginTimestamp", Date.now().toString());
      setIsBlocked(false);
    }
  };

  const handleUpgradeClick = () => {
    // Clean redirect to subscription dashboard page
    router.push("/dashboard/subscribe");
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* Behind dashboard page layout */}
      <div className={isBlocked ? "pointer-events-none select-none blur-sm" : ""}>
        {children}
      </div>

      {/* Stunning Lockout Glassmorphic Popup Block */}
      <AnimatePresence>
        {isBlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xl"
            style={{ position: "fixed" }}
          >
            {/* Ambient background glowing patterns */}
            <div className="absolute top-[30%] left-[30%] w-[350px] h-[350px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[30%] right-[30%] w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", duration: 0.7 }}
              className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.25)] relative overflow-hidden flex flex-col items-center text-center"
            >
              {/* Premium Top Bar accent */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600" />

              {/* Padlock glowing circle */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center border-4 border-orange-100/50 shadow-md mb-6"
              >
                <LockKeyhole className="w-10 h-10 text-orange-600" strokeWidth={2} />
              </motion.div>

              <h2 className="text-2xl font-black text-slate-900 leading-snug tracking-tight mb-3">
                Premium Access Required
              </h2>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-bold uppercase tracking-wider mb-5">
                <Sparkles className="w-3 h-3" />
                Extended to Purchase Plan
              </div>

              <p className="text-slate-500 text-xs leading-relaxed mb-6">
                Your 24-hour stayquote trial period has completed. Please purchase a monthly premium plan to continue enjoying unlimited features.
              </p>

              {/* Bullet highlights inside card */}
              <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-2.5 mb-8">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 text-center">
                  Unlock everything instantly
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>PDF Quotations</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Master Inventory</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>SMTP configs</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Analytics Dashboard</span>
                  </div>
                </div>
              </div>

              {/* Direct CTA button to subscribe page */}
              <button
                onClick={handleUpgradeClick}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold uppercase tracking-wider rounded-2xl py-4 flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-600/20 active:scale-98 text-xs cursor-pointer"
              >
                <span>Extend to Purchase Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[9px] text-slate-400 font-medium mt-4 leading-normal">
                Monthly plan available at ₹999/month. Cancel anytime.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
