"use client";
import { motion } from "framer-motion";
import { PhoneIncoming, FileText, BellRing, CalendarCheck2, CheckCircle, Building2 } from "lucide-react";

const steps = [
  { icon: <PhoneIncoming className="w-6 h-6" />, num: "1", title: "Enquiry Received", desc: "All enquiries from calls, websites, WhatsApp, OTAs and walk-ins." },
  { icon: <FileText className="w-6 h-6" />, num: "2", title: "Create Quotation", desc: "Create a send professional quotations in seconds." },
  { icon: <BellRing className="w-6 h-6" />, num: "3", title: "Follow-up", desc: "Track and follow up automatically." },
  { icon: <CalendarCheck2 className="w-6 h-6" />, num: "4", title: "Check Availability", desc: "Check room, venue or stay date availability." },
  { icon: <CheckCircle className="w-6 h-6" />, num: "5", title: "Confirmation", desc: "Guest approves the quotation." },
  { icon: <Building2 className="w-6 h-6" />, num: "6", title: "Reservation Created", desc: "Convert quotation into a reservation in one click." },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-black text-gray-900 mb-4"
          >
            Manage Every Booking from Enquiry to Reservation
          </motion.h2>
          <p className="text-gray-500 text-lg">A complete workflow designed for hospitality teams</p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#f1611b]/30 to-transparent mx-16" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="relative mb-5">
                  <div className="w-14 h-14 rounded-full bg-[#f1611b] text-white flex items-center justify-center shadow-lg shadow-[#f1611b]/30 z-10 relative">
                    {step.icon}
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-900 text-white text-[9px] font-black flex items-center justify-center">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1.5">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
