"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { motion } from "framer-motion";
import { CheckCircle2, CreditCard, Sparkles, LogOut, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

import { getApiUrl } from "@/lib/api";

const premiumFeatures = [
  "Unlimited professional PDF quotations",
  "Unlimited guest enquiries and reservations",
  "Complete guest follow-up & pipe pipeline tracker",
  "Full property profile & custom brand config",
  "Advanced custom SMTP credentials for emails",
  "Dynamic document layout & theme customization",
  "Multiple rooms, packages, & master inventories",
  "Comprehensive reports & analytics dashboard",
];

export default function SubscribePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      setAuthToken(token);
    }
  }, [router]);

  const handleCheckout = async () => {
    if (!authToken) {
      Swal.fire("Authentication Error", "You are not logged in. Please sign in.", "error");
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Fetch Subscription ID from Backend
      const res = await fetch(getApiUrl("create-subscription"), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to initiate subscription creation.");
      }

      // Handle subscription structure safely
      const subscriptionId = data.subscription?.id || data.subscriptionId || data.id;
      if (!subscriptionId) {
        throw new Error("Unable to read subscription reference ID from server.");
      }

      // Check if Razorpay SDK is loaded
      if (typeof window === "undefined" || !(window as any).Razorpay) {
        throw new Error("Razorpay SDK failed to load. Please refresh the page and try again.");
      }

      // 2. Configure Razorpay Options
      const options = {
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY", // Will pull from .env.local if set
        subscription_id: subscriptionId,
        name: "StayQuote Premium",
        description: "Monthly Unlimited Subscription Plan",
        image: "https://stayquote.shapebytes.com/onlyshapebyte_logo.png",
        handler: async function (response: any) {
          setIsLoading(true);

          try {
            // 3. Send payment details to Backend to Verify
            const verifyRes = await fetch(getApiUrl("verify-subscription"), {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySubscriptionId: response.razorpay_subscription_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.message || "Payment signature verification failed.");
            }

            // 4. ⭐ CRITICAL: Update token in Local Storage and Cookie
            const freshToken = verifyData.token;
            if (freshToken) {
              localStorage.setItem("authToken", freshToken);
              // Set cookie for middleware access (valid for 7 days)
              document.cookie = `authToken=${freshToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
            }

            await Swal.fire({
              title: "🎉 Active Premium Status!",
              text: "Payment verified successfully. Welcome to StayQuote Premium!",
              icon: "success",
              confirmButtonColor: "#ea580c",
              confirmButtonText: "Go to Dashboard",
            });

            // Redirect to dashboard
            window.location.href = "/dashboard";
          } catch (err: any) {
            Swal.fire("Verification Failed", err.message || "Verification of payment failed.", "error");
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: "Hotel Administrator",
        },
        theme: {
          color: "#ea580c", // Premium orange accent
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      // 4. Open Razorpay Popup
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      Swal.fire("Subscription Failed", err.message || "Could not process payment request.", "error");
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("propertyTitle");
    localStorage.removeItem("propertyLogo");
    localStorage.removeItem("profilePicture");
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/");
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="min-h-screen w-full flex flex-col bg-[#f8f9fa] relative overflow-hidden font-sans">
        {/* Dynamic Glow Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-[10%] left-[20%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px]" />
          <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[150px]" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='rgba(0,0,0,0.06)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Top Navbar */}
        <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white/70 backdrop-blur-md">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/dashboard")}>
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 tracking-tight leading-none">StayQuote</h1>
              <p className="text-[10px] font-black uppercase text-orange-600 tracking-widest mt-0.5">Premium</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 rounded-xl text-sm font-bold transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12 lg:py-20 relative z-10 flex flex-col items-center justify-center">
          {/* Header */}
          <div className="text-center max-w-2xl mb-12 lg:mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-wider mb-4"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Get full unlimited access
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
              Trial Expired. Upgrade to Premium.
            </h2>
            <p className="text-slate-500 text-base sm:text-lg">
              Unlock professional quotation builders, client follow-up tracking, master inventories, custom branding, and much more to supercharge your hospitality business!
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="w-full max-w-4xl bg-white border border-gray-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row relative">
            
            {/* Left Side: Premium Feature Checklist */}
            <div className="flex-1 p-8 sm:p-12 bg-white">
              <h3 className="text-lg font-bold text-slate-900 mb-6">What is included in the Premium Plan:</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {premiumFeatures.map((feat, index) => (
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-sm font-medium leading-relaxed">{feat}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Right Side: Price Details & Call-To-Action */}
            <div className="w-full md:w-80 p-8 sm:p-12 bg-slate-50 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-center items-center text-center">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Premium Unlimited</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹999</span>
                  <span className="text-sm font-semibold text-slate-500">/month</span>
                </div>
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-2">Billed Monthly</p>
              </div>

              <div className="w-full space-y-4">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-slate-400 text-white font-extrabold uppercase tracking-wider rounded-2xl py-4 flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-orange-600/20 active:scale-98 cursor-pointer text-sm"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Subscribe Now</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-400 font-medium leading-snug">
                  Secure checkout processed by Razorpay Payments. Cancel anytime from your billing settings.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 w-full py-6 mt-auto flex items-center justify-center border-t border-gray-100 bg-white/50 text-slate-400 text-xs">
          <p>Powered by ShapesBytes Systems &copy; 2026. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
