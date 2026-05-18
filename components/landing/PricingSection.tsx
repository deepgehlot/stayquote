"use client";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const manual = [
  "Quotations made manually", "No follow-up system", "Availability checked separately",
  "No clear enquiry history", "Bookings lost due to delays",
];
const ours = [
  "Quick professional quotation creation", "Auto follow-up reminders and status tracking",
  "Availability calendar in the system", "Complete guest and enquiry record", "Complete booking pipeline",
];

const pricing = [
  "Quotation management", "Follow-up tracking", "Availability checking", "Static reports",
  "Dashboard access", "Team collaboration", "Guest enquiry records", "Support included",
];

export default function PricingSection() {
  return (
    <>
    <section id="comparison" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Comparison */}
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-black text-gray-900 mb-4"
          >
            Better Than Managing Bookings on Excel and WhatsApp
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-20 max-w-4xl mx-auto">
          {/* Manual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="rounded-2xl border-2 border-red-100 bg-red-50 p-7"
          >
            <div className="font-black text-gray-900 mb-1 text-lg">Manual Method (Excel / WhatsApp)</div>
            <div className="text-xs text-gray-500 mb-5">What you&apos;re doing right now</div>
            <div className="space-y-3">
              {manual.map((m) => (
                <div key={m} className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{m}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Ours */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="rounded-2xl border-2 border-[#f1611b]/30 bg-[#f1611b]/5 p-7 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 text-[10px] font-bold bg-[#f1611b] text-white px-2.5 py-1 rounded-full uppercase tracking-widest">
              Recommended
            </div>
            <div className="font-black text-gray-900 mb-1 text-lg">StayQuote Hospitality Tool</div>
            <div className="text-xs text-gray-500 mb-5">The smart way to manage bookings</div>
            <div className="space-y-3">
              {ours.map((o) => (
                <div key={o} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#f1611b] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 font-medium">{o}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        </div>
      </section>

      {/* Pricing section */}
      <section id="pricing" className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Simple Pricing. No Confusion.</h2>
            <p className="text-gray-500">One simple plan for everything you need.</p>
          </div>

          <div className="max-w-sm mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="rounded-3xl border-2 border-[#f1611b] bg-white shadow-2xl shadow-[#f1611b]/10 p-8 text-center"
            >
              <div className="text-5xl font-black text-[#f1611b] mb-1">₹999</div>
              <div className="text-sm text-gray-500 mb-6">/month per property</div>
              <div className="grid grid-cols-2 gap-2 mb-8 text-left">
                {pricing.map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#f1611b] shrink-0" />
                    <span className="text-xs text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 rounded-full bg-[#f1611b] text-white font-black hover:bg-[#d94e0f] transition-all shadow-lg shadow-[#f1611b]/30 hover:-translate-y-0.5 text-sm tracking-wide">
                Start at ₹999/month
              </button>
              <p className="text-xs text-gray-400 mt-3">No hidden charges. Cancel anytime.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
