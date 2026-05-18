"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "What is StayQuote?",
    a: "StayQuote is a hospitality quotation and reservation management tool by ShapeBytes. It helps hotels, resorts, villas, banquets and hospitality teams create quotations, track follow-ups, check availability and convert enquiries into confirmed reservations.",
  },
  {
    q: "Who is this tool built for?",
    a: "StayQuote is built for hotels, resorts, villas, homestays, banquet halls, camps, destination wedding venues and hospitality sales or reservation teams.",
  },
  {
    q: "Can I create and send quotations from the tool?",
    a: "Yes. You can create professional quotations for rooms, packages, banquets, events, group bookings and custom guest requirements.",
  },
  {
    q: "Does it track follow-ups automatically?",
    a: "Yes. StayQuote helps your team track pending enquiries, upcoming follow-ups and quotation status so fewer booking opportunities are missed.",
  },
  {
    q: "Can I check room availability before creating a quotation?",
    a: "Yes. You can check room, venue or date availability before sending a quotation or confirming a reservation.",
  },
  {
    q: "Can I convert a quotation to a reservation in one click?",
    a: "Yes. Once a guest approves a quotation, you can convert it into a confirmed reservation without duplicate manual work.",
  },
  {
    q: "Does it support multiple team members?",
    a: "Yes. Your sales, reservation and front-office team can manage enquiries, quotations, follow-ups and reservations from one dashboard.",
  },
  {
    q: "Can I send quotations from my hotel’s email address?",
    a: "Yes. You can configure your property email so quotations look professional and come from your business identity.",
  },
  {
    q: "Can I brand the PDFs with my property’s logo and name?",
    a: "Yes. You can add your property logo, name and quotation details to create branded quotation PDFs.",
  },
  {
    q: "What is the pricing? Are there hidden charges?",
    a: "StayQuote is available at ₹999 per month. The plan includes quotation management, follow-up tracking, availability checking, reservation conversion and dashboard access.",
  },
  {
    q: "Is there a free trial or demo available?",
    a: "Yes. You can book a free demo to see how StayQuote works for your hotel, resort, villa or banquet business.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        open ? "border-[#f1611b]/40 bg-[#f1611b]/5 shadow-md shadow-[#f1611b]/10" : "border-gray-100 bg-white hover:border-[#f1611b]/20"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className={`font-semibold text-sm leading-snug ${open ? "text-[#f1611b]" : "text-gray-800"}`}>
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
            open ? "bg-[#f1611b] text-white" : "bg-gray-100 text-gray-500"
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const half = Math.ceil(faqs.length / 2);
  const left = faqs.slice(0, half);
  const right = faqs.slice(half);

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f1611b]/10 border border-[#f1611b]/20 text-[#f1611b] text-xs font-bold uppercase tracking-widest mb-5">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-black text-gray-900 mb-4"
          >
            Got Questions? We&apos;ve Got Answers.
          </motion.h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Everything you need to know before getting started with StayQuote.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            {left.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
          <div className="space-y-4">
            {right.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i + half} />
            ))}
          </div>
        </div>

        {/* Still have questions */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-14 text-center p-10 rounded-3xl bg-white border border-gray-100 shadow-sm"
        >
          <div className="text-2xl font-black text-gray-900 mb-3">Still have questions?</div>
          <p className="text-gray-500 mb-6">Our team is happy to walk you through the product and answer any questions.</p>
          <a
            href="mailto:growth@shapebytes.com"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#f1611b] text-white font-bold hover:bg-[#d94e0f] transition-all shadow-lg shadow-[#f1611b]/25"
          >
            Contact Us
          </a>
        </motion.div> */}
      </div>
    </section>
  );
}
