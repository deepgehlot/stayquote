"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Monitor } from "lucide-react";

const screenshots = [
  {
    tab: "Dashboard",
    src: "/screenshots/WhatsApp Image 2026-05-18 at 15.12.02.jpeg",
    title: "Dashboard Overview",
    desc: "Get a bird's-eye view of your entire property — total rooms, bookings, active quotations, and today's check-in/check-out status, all in one place.",
  },
  {
    tab: "Quotations",
    src: "/screenshots/WhatsApp Image 2026-05-18 at 15.15.27.jpeg",
    title: "Quotation Management",
    desc: "View and manage all your quotes with status tracking. See which are accepted, pending, or lost — and take action directly from the list.",
  },
  {
    tab: "Create Quote",
    src: "/screenshots/WhatsApp Image 2026-05-18 at 15.11.58.jpeg",
    title: "Create Professional Quotations",
    desc: "Generate stunning, branded quotations in seconds. Fill client details, select rooms, add services, and send via email or WhatsApp instantly.",
  },
  {
    tab: "Reservations",
    src: "/screenshots/WhatsApp Image 2026-05-18 at 15.15.38.jpeg",
    title: "Reservations Tracking",
    desc: "See all confirmed reservations with check-in/out dates, guest count, amounts, and status — fully searchable and paginated.",
  },
  {
    tab: "Inventory",
    src: "/screenshots/WhatsApp Image 2026-05-18 at 15.16.06.jpeg",
    title: "Master Inventory",
    desc: "Manage all room categories and extra services like cab, food, or pool access. Control availability units directly from the settings.",
  },
  {
    tab: "Policies",
    src: "/screenshots/WhatsApp Image 2026-05-18 at 15.15.59.jpeg",
    title: "Policies & Legal",
    desc: "Set your payment terms and cancellation policies once. They auto-appear on every quotation and reservation PDF you generate.",
  },
  {
    tab: "Branding",
    src: "/screenshots/WhatsApp Image 2026-05-18 at 15.15.48.jpeg",
    title: "Document Branding",
    desc: "Choose your PDF layout style and accent color. Brand every quotation and invoice with your property's identity.",
  },
  {
    tab: "Email Config",
    src: "/screenshots/WhatsApp Image 2026-05-18 at 15.15.53.jpeg",
    title: "Email Configuration",
    desc: "Connect your own SMTP email to send professional confirmations and quotations directly to your guests from your hotel's email address.",
  },
  {
    tab: "Profile",
    src: "/screenshots/WhatsApp Image 2026-05-18 at 15.17.26.jpeg",
    title: "Property Profile",
    desc: "Set up your property's name, logo, contact details and address. Everything appears on your branded documents automatically.",
  },
];

export default function ScreenshotsSection() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + screenshots.length) % screenshots.length);
  const next = () => setActive((a) => (a + 1) % screenshots.length);

  return (
    <section id="screenshots" className="py-20 bg-gray-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(241,97,27,0.12),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f1611b]/15 border border-[#f1611b]/30 text-[#f1611b] text-xs font-bold uppercase tracking-widest mb-5">
            <Monitor className="w-3.5 h-3.5" /> Real Product Screenshots
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-black text-white mb-4"
          >
            See Your Complete Booking Pipeline in One Place
          </motion.h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Every screen is designed to help your team work faster — no training needed.
          </p>
        </div>

        {/* Tab buttons — scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide justify-start lg:justify-center">
          {screenshots.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border ${
                active === i
                  ? "bg-[#f1611b] text-white border-[#f1611b] shadow-lg shadow-[#f1611b]/30"
                  : "bg-white/5 text-gray-400 border-white/10 hover:border-[#f1611b]/40 hover:text-white"
              }`}
            >
              {s.tab}
            </button>
          ))}
        </div>

        {/* Screenshot display */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-center">
          {/* Image */}
          <div className="relative">
            {/* Browser chrome */}
            <div className="rounded-t-xl bg-gray-800 px-4 py-2.5 flex items-center gap-2 border border-white/10 border-b-0">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 h-5 rounded-full bg-gray-700 text-xs text-gray-500 font-mono flex items-center px-3">
                sb-hospitality.vercel.app/dashboard
              </div>
            </div>
            <div className="relative rounded-b-xl overflow-hidden border border-white/10 border-t-0 bg-gray-900">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={screenshots[active].src}
                    alt={screenshots[active].title}
                    width={900}
                    height={560}
                    className="w-full h-auto object-cover"
                    quality={95}
                    unoptimized
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Prev / Next arrows */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 translate-y-1 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center border border-white/20 hover:bg-[#f1611b] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 translate-y-1 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center border border-white/20 hover:bg-[#f1611b] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Info panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f1611b]/15 text-[#f1611b] text-xs font-bold">
                {active + 1} / {screenshots.length}
              </div>
              <h3 className="text-2xl font-black text-white leading-snug">
                {screenshots[active].title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-base">
                {screenshots[active].desc}
              </p>

              {/* Dots */}
              <div className="flex gap-2 pt-2">
                {screenshots.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === active ? "bg-[#f1611b] w-8" : "bg-white/20 w-3 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#f1611b] text-white font-bold text-sm hover:bg-[#d94e0f] transition-all shadow-lg shadow-[#f1611b]/30"
              >
                Next Screen <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
