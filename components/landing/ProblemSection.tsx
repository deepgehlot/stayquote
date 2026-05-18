"use client";
import { motion } from "framer-motion";
import { FileText, UserX, CalendarX2, Users2, BellOff, BarChart3 } from "lucide-react";

const problems = [
  { icon: <FileText className="w-7 h-7" />, title: "Quotations are made manually on WhatsApp, Excel or Word" },
  { icon: <UserX className="w-7 h-7" />, title: "Staff forgets to follow up with guests" },
  { icon: <CalendarX2 className="w-7 h-7" />, title: "Availability is not checked properly" },
  { icon: <Users2 className="w-7 h-7" />, title: "Same enquiry is handled by multiple people" },
  { icon: <BellOff className="w-7 h-7" />, title: "Confirmed and pending bookings are not tracked" },
  { icon: <BarChart3 className="w-7 h-7" />, title: "Management cannot see how many enquiries converted to bookings" },
];

export default function ProblemSection() {
  return (
    <section id="use-cases" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-black text-gray-900 mb-4"
          >
            Hospitality Enquiries Are Easy to Lose
          </motion.h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Most hotels and resorts lose bookings due to missed follow-ups, manual work and unorganized data.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm hover:shadow-md hover:border-[#f1611b]/20 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-[#f1611b]/10 flex items-center justify-center mx-auto mb-4 text-[#f1611b] group-hover:bg-[#f1611b] group-hover:text-white transition-colors duration-300">
                {p.icon}
              </div>
              <p className="text-xs font-semibold text-gray-600 leading-relaxed">{p.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
