"use client";
import { motion } from "framer-motion";

const businessTypes = ["Hotels", "Resorts", "Banquet Halls", "Villas", "Homestays", "Destination Wedding Venues", "Camps", "Restaurants with Event Spaces", "Travel & Accommodation Teams"];

export default function SocialProofSection() {
  return (
    <>
      {/* Business Types */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl font-black text-gray-900 mb-10"
          >
            Built for Every Hospitality Business
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-3">
            {businessTypes.map((b, i) => (
              <motion.div
                key={b}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[#f1611b] hover:text-[#f1611b] transition-all cursor-default shadow-sm"
              >
                {b}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
