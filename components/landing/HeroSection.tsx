"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { SparklesCore, Badge } from "@/components/ui/aceternity";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";

const trust = ["Simple to use", "Smart Follow-ups", "Secure & Reliable", "Built for Hospitality"];

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 bg-white overflow-hidden min-h-[90vh] flex items-center">
      {/* Sparkles background */}
      <div className="absolute inset-0 pointer-events-none">
        <SparklesCore particleCount={80} />
        {/* Gradient blob */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#f1611b]/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#f1611b]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left */}
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge>QUOTATION & RESERVATION SOFTWARE FOR HOSPITALITY</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.08] tracking-tight"
          >
            Smart Quotation &amp; Reservation Software{" "}
            <span className="text-[#f1611b]">for Hotels &amp; Resorts</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-5 text-lg text-gray-500 leading-relaxed max-w-xl"
          >
            Create professional quotations, track guest follow-ups, check availability, and convert enquiries into
            confirmed reservations — all from one simple dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link href="/login"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#f1611b] text-white font-bold text-base hover:bg-[#d94e0f] transition-all shadow-xl shadow-[#f1611b]/30 hover:-translate-y-0.5">
              Start at ₹999/month <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full border-2 border-[#f1611b] text-[#f1611b] font-bold text-base hover:bg-[#f1611b]/5 transition-all">
              <Play className="w-4 h-4 fill-[#f1611b]" /> Book Free Demo
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            {trust.map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-sm text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-[#f1611b]" />
                <span>{t}</span>
              </div>
            ))}
          </motion.div>
          <p className="mt-4 text-xs text-gray-400">Trusted for hotels, resorts, banquet halls, villas and hospitality teams</p>
        </div>

        {/* Right – Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          className="relative"
        >
          <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/60 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <div className="ml-3 flex-1 h-5 bg-gray-200 rounded-full text-xs flex items-center px-3 text-gray-400 font-mono">
                app.stayquote.com/dashboard
              </div>
            </div>
            {/* Dashboard body */}
            <div className="flex h-64 lg:h-80">
              {/* Sidebar */}
              <div className="w-32 bg-gray-900 p-3 space-y-2 shrink-0">
                <div className="h-6 w-20 rounded bg-[#f1611b] mb-4" />
                {["Dashboard","Quotations","Follow-ups","Reservations","Enquiries","Guests","Reports"].map((item, i) => (
                  <div key={item} className={`h-5 rounded text-xs flex items-center px-2 ${i === 0 ? "bg-[#f1611b]/20 text-[#f1611b]" : "text-gray-500"}`}>
                    <div className={`w-full h-2 rounded ${i === 0 ? "bg-[#f1611b]/40" : "bg-gray-700"}`} />
                  </div>
                ))}
              </div>
              {/* Main area */}
              <div className="flex-1 p-4 bg-gray-50">
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { label: "Enquiries", val: "128", color: "bg-blue-500" },
                    { label: "Quotations", val: "96", color: "bg-[#f1611b]" },
                    { label: "Follow-ups Due", val: "34", color: "bg-amber-500" },
                    { label: "Confirmed", val: "22", color: "bg-green-500" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                      <div className={`w-6 h-6 rounded ${s.color} mb-1.5 opacity-80`} />
                      <div className="text-xs font-black text-gray-800">{s.val}</div>
                      <div className="text-[9px] text-gray-400 leading-tight">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                    <div className="text-[10px] font-bold text-gray-700 mb-2">Enquiry Pipeline</div>
                    {[["New Enquiry","#3b82f6",128],["Quotation Sent","#f1611b",96],["Follow-up","#f59e0b",84],["Negotiation","#8b5cf6",42],["Confirmed","#10b981",22]].map(([l,c,v]) => (
                      <div key={l as string} className="flex items-center gap-1.5 mb-1">
                        <div className="text-[8px] text-gray-500 w-16 shrink-0 truncate">{l}</div>
                        <div className="flex-1 h-2 rounded-full bg-gray-100">
                          <div className="h-2 rounded-full" style={{ width: `${(+v/128)*100}%`, backgroundColor: c as string }} />
                        </div>
                        <div className="text-[8px] font-bold text-gray-700 w-4">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                    <div className="text-[10px] font-bold text-gray-700 mb-2">Upcoming Reservations</div>
                    {["Grand Palace Hotel","Hill View Resort","Ocean Bay Villa"].map((name) => (
                      <div key={name} className="flex items-center gap-1.5 py-1 border-b border-gray-50 last:border-0">
                        <div className="w-4 h-4 rounded-full bg-[#f1611b]/20 shrink-0" />
                        <div>
                          <div className="text-[8px] font-semibold text-gray-700 leading-none">{name}</div>
                          <div className="text-[7px] text-gray-400">Check-in: May 24</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-4 -left-4 bg-white rounded-xl px-4 py-2.5 shadow-xl border border-gray-100 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <div className="text-xs font-black text-gray-800">Reservation Confirmed</div>
              <div className="text-[10px] text-gray-400">Grand Palace Hotel • 3 min ago</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
