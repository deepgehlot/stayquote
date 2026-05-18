"use client";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/aceternity";
import { FileText, CalendarCheck2, BellRing, Building2, Users, BarChart3, CheckSquare, TrendingUp } from "lucide-react";

const features = [
  { icon: <FileText className="w-6 h-6 text-[#f1611b]" />, title: "Professional Quotation Builder", desc: "Create beautiful quotations for rooms, packages, events, banquets and group bookings." },
  { icon: <CalendarCheck2 className="w-6 h-6 text-[#f1611b]" />, title: "Availability Tracking", desc: "Real-time availability of rooms, venues and dates to avoid double-booking." },
  { icon: <BellRing className="w-6 h-6 text-[#f1611b]" />, title: "Follow-up Management", desc: "Never miss a follow-up with smart reminders and a follow-up list." },
  { icon: <Building2 className="w-6 h-6 text-[#f1611b]" />, title: "Reservation Based on Quotation", desc: "Convert quotations directly into a reservation without duplicate work." },
  { icon: <Users className="w-6 h-6 text-[#f1611b]" />, title: "Guest & Enquiry Records", desc: "Complete guest history, quotation status, follow-up, confirmed and notes in one place." },
  { icon: <CheckSquare className="w-6 h-6 text-[#f1611b]" />, title: "Status Tracking", desc: "Track every enquiry through follow-up, quotation, confirmed, lost and cancelled." },
  { icon: <TrendingUp className="w-6 h-6 text-[#f1611b]" />, title: "Team-friendly Dashboard", desc: "Sales, reservation, and front office teams can work from the same data." },
  { icon: <BarChart3 className="w-6 h-6 text-[#f1611b]" />, title: "Conversion & Revenue Insights", desc: "Track enquiries, revenue and team performance with beautiful reports." },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-black text-gray-900 mb-4"
          >
            Powerful Features to Simplify Your Hospitality Sales
          </motion.h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Everything you need in one place — no more switching between spreadsheets and WhatsApp.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            >
              <GlowCard className="h-full">
                <div className="w-12 h-12 rounded-xl bg-[#f1611b]/10 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm leading-snug">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
