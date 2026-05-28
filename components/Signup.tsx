"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User, Gift, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";

import { getApiUrl } from "@/lib/api";

export default function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refParam = searchParams.get("ref") || "";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [referBy, setReferBy] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Set the referral code from the query parameters if present
  useEffect(() => {
    if (refParam) {
      setReferBy(refParam);
    }
  }, [refParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(getApiUrl("signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          referBy: referBy.trim() || undefined, // Send undefined or empty string, backend standard
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      // Show beautiful success popup
      await Swal.fire({
        title: "Account Created!",
        text: "Your stayquote account has been created successfully. Please sign in to start your trial.",
        icon: "success",
        confirmButtonColor: "#ea580c",
        confirmButtonText: "Sign In Now",
      });

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9fa] p-4 sm:p-8 relative overflow-hidden">
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft floating glow orbs */}
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[800px] h-[800px] bg-champagne/20 rounded-full blur-[150px]" />

        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='rgba(0,0,0,0.08)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Aesthetic Bubbles */}
        <div className="hidden lg:block">
          {/* Right Top Massive Bubble */}
          <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] rounded-full border border-orange-200/20 bg-gradient-to-bl from-orange-100/30 to-transparent backdrop-blur-3xl shadow-inner" />

          {/* Left Bottom Large Bubble */}
          <div className="absolute -bottom-[15%] -left-[10%] w-[450px] h-[450px] rounded-full border border-champagne/20 bg-gradient-to-tr from-champagne/20 to-transparent backdrop-blur-2xl shadow-inner" />

          {/* Small Accent Bubbles */}
          <div className="absolute top-[25%] left-[10%] w-32 h-32 rounded-full border border-orange-300/10 bg-white/40 backdrop-blur-md shadow-sm" />
          <div className="absolute bottom-[20%] right-[12%] w-16 h-16 rounded-full border border-champagne/30 bg-white/20 backdrop-blur-sm" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl min-h-[580px] lg:h-[580px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col lg:flex-row border border-gray-100"
      >
        {/* Diagonal Background Split */}
        <div
          className="hidden lg:block absolute inset-0 bg-orange-600 z-0 pointer-events-none"
          style={{ clipPath: "polygon(47% 0, 100% 0, 100% 100%, 38% 100%)" }}
        />

        {/* --- Left Side: Logo & Branding --- */}
        <div className="relative z-10 w-full lg:w-[40%] h-auto lg:h-full flex flex-col items-center justify-center p-12 lg:px-12 text-orange-600">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
            className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mb-6 border-4 border-orange-100 shadow-lg"
          >
            <ShieldCheck className="w-10 h-10 text-white" strokeWidth={2} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-wide mb-3 text-slate-900">
              System Admin
            </h1>
            <p className="text-orange-600/70 text-sm font-bold tracking-widest uppercase">
              Join stayquote Today
            </p>
          </motion.div>
        </div>

        {/* --- Right Side: Register Form --- */}
        <div className="relative z-10 w-full lg:w-[60%] flex-1 h-auto lg:h-full flex flex-col justify-center bg-orange-600 lg:bg-transparent px-8 sm:px-12 py-12 lg:py-0 lg:pl-12 lg:pr-16 xl:pl-16 xl:pr-24 rounded-t-[2.5rem] lg:rounded-none">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-semibold text-white mb-1">
                Create Account
              </h2>
              <p className="text-white/80 text-sm">
                Get started with your free 14-day premium trial
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Username Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-white uppercase tracking-widest ml-1">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-orange-200 group-focus-within:text-orange-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white text-slate-900 border border-orange-400/30 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-white focus:ring-4 focus:ring-white/10 transition-all shadow-sm text-sm"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-white uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-orange-200 group-focus-within:text-orange-600 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white text-slate-900 border border-orange-400/30 rounded-xl py-3 pl-11 pr-12 focus:outline-none focus:border-white focus:ring-4 focus:ring-white/10 transition-all shadow-sm text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-orange-200 lg:text-gray-400 hover:text-orange-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Referral Code Field (Optional) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-white uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  Referral Code <span className="text-white/50 lowercase italic">(optional)</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Gift className="h-4 w-4 text-orange-200 group-focus-within:text-orange-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={referBy}
                    onChange={(e) => setReferBy(e.target.value)}
                    className="w-full bg-white text-slate-900 border border-orange-400/30 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-white focus:ring-4 focus:ring-white/10 transition-all shadow-sm text-sm"
                    placeholder="Enter referral code"
                  />
                </div>
              </div>

              {/* Submit Button & Sign In Link */}
              <div className="pt-2 flex flex-col items-center justify-center gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-48 bg-gray-900 hover:bg-black text-white font-black uppercase tracking-widest rounded-xl py-3.5 px-4 flex items-center justify-center transition-all duration-300 shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 text-sm cursor-pointer"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Sign Up</span>
                  )}
                </button>

                <p className="text-white/60 text-xs mt-2">
                  Already have an account?{" "}
                  <Link href="/login" className="text-white hover:text-orange-200 underline font-bold transition-colors">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
