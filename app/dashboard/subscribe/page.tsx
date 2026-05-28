"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { motion } from "framer-motion";
import { CheckCircle2, CreditCard, Sparkles, Calendar, Info, Clock, CheckCircle, ChevronLeft, ChevronRight, IndianRupee } from "lucide-react";
import Swal from "sweetalert2";

import { getApiUrl } from "@/lib/api";

const premiumFeatures = [
  "Unlimited professional PDF quotations",
  "Unlimited guest enquiries and reservations",
  "Complete guest follow-up & pipeline tracker",
  "Full property profile & custom brand config",
  "Advanced custom SMTP credentials for emails",
  "Dynamic document layout & theme customization",
  "Multiple rooms, packages, & master inventories",
  "Comprehensive reports & analytics dashboard",
];

interface RechargeRecord {
  _id?: string;
  id?: string;
  createdAt?: string;
  chargedAt?: string;
  date?: string;
  amount?: number;
  paymentId?: string;
  razorpay_payment_id?: string;
  razorpayPaymentId?: string;
  status?: string;
  planName?: string;
}

export default function SubscriptionBillingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [billingHistory, setBillingHistory] = useState<RechargeRecord[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [billingHistory]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const isSub = localStorage.getItem("isSubscribed") === "true";
    setIsPremium(isSub);

    if (!token) {
      router.push("/login");
    } else {
      setAuthToken(token);
      fetchBillingHistory(token);
    }
  }, [router]);

  const fetchBillingHistory = async (token: string) => {
    setIsHistoryLoading(true);
    try {
      const res = await fetch(getApiUrl("recharge-history"), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("StayQuote Recharge History API response:", data);
        let history = [];
        if (Array.isArray(data)) {
          history = data;
        } else if (data && typeof data === "object") {
          // 1. Check if nested under data.data.records (e.g. data: { records: [...] })
          if (data.data && typeof data.data === "object" && Array.isArray(data.data.records)) {
            history = data.data.records;
          }
          // 2. Check other common formats
          else {
            const possibleArray = data.records || data.history || data.rechargeHistory || data.recharges || data.transactions || data.data;
            if (Array.isArray(possibleArray)) {
              history = possibleArray;
            } else if (data.success && Array.isArray(data.records)) {
              history = data.records;
            } else if (data.success && Array.isArray(data.history)) {
              history = data.history;
            } else if (data.success && Array.isArray(data.rechargeHistory)) {
              history = data.rechargeHistory;
            } else if (data.data && typeof data.data === "object") {
              const nestedArray = data.data.history || data.data.rechargeHistory || data.data.recharges || data.data.data;
              if (Array.isArray(nestedArray)) {
                history = nestedArray;
              }
            }
          }
        }
        setBillingHistory(history);
      } else {
        setBillingHistory([]);
      }
    } catch (err) {
      console.error("Failed to fetch billing history:", err);
      setBillingHistory([]);
    } finally {
      setIsHistoryLoading(false);
    }
  };

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

      const subscriptionId = data.subscription?.id || data.subscriptionId || data.id;
      if (!subscriptionId) {
        throw new Error("Unable to read subscription reference ID from server.");
      }

      if (typeof window === "undefined" || !(window as any).Razorpay) {
        throw new Error("Razorpay SDK failed to load. Please refresh the page and try again.");
      }

      // 2. Configure Razorpay Options
      const options = {
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY",
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

            // Update token in Local Storage and Cookie
            const freshToken = verifyData.token;
            if (freshToken) {
              localStorage.setItem("authToken", freshToken);
              document.cookie = `authToken=${freshToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
            }

            // Store premium subscription status
            localStorage.setItem("isSubscribed", "true");
            setIsPremium(true);

            await Swal.fire({
              title: "🎉 Active Premium Status!",
              text: "Payment verified successfully. Welcome to StayQuote Premium!",
              icon: "success",
              confirmButtonColor: "#ea580c",
              confirmButtonText: "Done",
            });

            // Re-fetch billing history
            fetchBillingHistory(authToken);
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
          color: "#ea580c",
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      Swal.fire("Subscription Failed", err.message || "Could not process payment request.", "error");
      setIsLoading(false);
    }
  };

  const displayAmount = (amt: any) => {
    if (amt === undefined || amt === null) return "₹999";
    
    if (typeof amt === "number") {
      // Convert from paise to INR (e.g. 99900 paise = 999 INR)
      const value = amt >= 1000 ? amt / 100 : amt;
      return "₹" + value.toLocaleString("en-IN");
    }

    const amtStr = String(amt);
    if (amtStr.includes("$")) {
      return "₹" + amtStr.replace("$", "").trim();
    }
    if (amtStr.includes("₹")) {
      return amtStr;
    }
    
    const numericValue = parseFloat(amtStr);
    if (!isNaN(numericValue)) {
      const value = numericValue >= 1000 ? numericValue / 100 : numericValue;
      return "₹" + value.toLocaleString("en-IN");
    }
    return "₹" + amtStr;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const totalPages = Math.ceil(billingHistory.length / itemsPerPage);
  
  const currentRecords = Array.isArray(billingHistory)
    ? billingHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="space-y-8 pb-12">
        {/* Premium All-in-One Plan Card */}
        <div className="relative overflow-hidden rounded-xl bg-white border border-gray-100 p-8 sm:p-10 shadow-lg shadow-slate-100">
          {/* Beautiful glowing light circles at top-left and bottom-right inside the card */}
          <div className="absolute top-0 left-0 -translate-x-12 -translate-y-12 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 translate-x-12 translate-y-12 w-[300px] h-[300px] bg-amber-500/8 rounded-full blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            {/* Left Section: Welcome, Description & Included Features (8 cols) */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                  Premium Membership
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {isPremium ? "Your Premium Plan is Active" : "Unlock Full Premium Access"}
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-2xl">
                  Get full unlimited access to the entire StayQuote platform, enabling a seamless workflow for your hotel, resort, or vacation rental business.
                </p>
              </div>

              {/* Included Features Grid */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                  What is included in Premium:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
                  {premiumFeatures.map((feat, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-1 rounded-lg bg-orange-50 border border-orange-100 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                      </div>
                      <span className="text-slate-600 text-xs font-medium leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vertical Divider for large screens */}
            <div className="hidden lg:block lg:col-span-1 w-px bg-slate-100 h-full justify-self-center" />

            {/* Right Section: Pricing Details & Action CTA (3 cols) */}
            <div className="lg:col-span-3 w-full lg:w-auto flex flex-col justify-center items-center text-center p-6 sm:p-8 bg-orange-500 border border-orange-500 rounded-xl lg:min-w-[240px] shrink-0 lg:self-center shadow-xl shadow-orange-700/15 text-white">
              <span className="text-[10px] font-black uppercase tracking-widest text-white mb-2">
                Unlimited Monthly Plan
              </span>
              <div className="flex items-baseline justify-center gap-1.5 mb-2">
                <span className="text-4xl font-extrabold text-white">₹999</span>
                <span className="text-sm font-semibold text-orange-100">/month</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-orange-50 text-[9px] font-bold uppercase tracking-wider mb-6">
                All premium tools included
              </div>

              <div className="w-full space-y-4">
                {isPremium ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-3 bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 w-full justify-center shadow-inner">
                    <CheckCircle className="w-4 h-4 text-white animate-pulse" /> Plan Active
                  </span>
                ) : (
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full bg-white hover:bg-orange-50 disabled:bg-orange-300 disabled:text-white text-orange-600 font-extrabold uppercase tracking-wider rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 text-xs cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Subscribe Now</span>
                      </>
                    )}
                  </button>
                )}
                
                <p className="text-[9px] text-orange-100/70 font-medium leading-normal max-w-[200px] mx-auto">
                  Secure transaction via Razorpay. Cancel or renew anytime.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recharge History / Billing History Table */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-950 flex items-center gap-2.5">
              <IndianRupee className="w-4 h-4 text-orange-600" /> Billing & Recharge History
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-full uppercase">
              Plan rate: ₹999/mo
            </span>
          </div>

          <div className="overflow-x-auto">
            {isHistoryLoading ? (
              <div className="p-12 space-y-4">
                <div className="h-8 bg-slate-50 animate-pulse rounded-lg w-full" />
                <div className="h-8 bg-slate-50 animate-pulse rounded-lg w-full" />
                <div className="h-8 bg-slate-50 animate-pulse rounded-lg w-full" />
              </div>
            ) : (!Array.isArray(billingHistory) || billingHistory.length === 0) ? (
              <div className="p-12 text-center max-w-sm mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <IndianRupee className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">No Billing Transactions Found</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                    Once you make a premium subscription payment, your transaction statements will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100">
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Date</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Transaction ID</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Plan Description</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Amount</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Array.isArray(currentRecords) && currentRecords.map((record, index) => {
                    const txId = record.razorpayPaymentId || record.paymentId || record.razorpay_payment_id || record._id || record.id || "-";
                    const isSuccess = record.status?.toLowerCase() === "success" || record.status?.toLowerCase() === "paid" || record.status?.toLowerCase() === "active";
                    
                    return (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-4 text-xs font-semibold text-slate-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {formatDate(record.chargedAt || record.createdAt || record.date)}
                        </td>
                        <td className="px-8 py-4 text-xs font-mono text-slate-500">{txId}</td>
                        <td className="px-8 py-4 text-xs font-medium text-slate-700">
                          {record.planName || "StayQuote Premium Monthly"}
                        </td>
                        <td className="px-8 py-4 text-xs font-bold text-slate-900">
                          {displayAmount(record.amount)}
                        </td>
                        <td className="px-8 py-4 text-xs text-right">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isSuccess 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {record.status || "Paid"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {Array.isArray(billingHistory) && billingHistory.length > itemsPerPage && (
            <div className="px-8 py-4 bg-slate-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative">
              <div className="text-xs text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-800">{Math.min((currentPage - 1) * itemsPerPage + 1, billingHistory.length)}</span> to{" "}
                <span className="font-bold text-slate-800">{Math.min(currentPage * itemsPerPage, billingHistory.length)}</span> of{" "}
                <span className="font-bold text-slate-800">{billingHistory.length}</span> transactions
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-600/10"
                        : "border-gray-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
