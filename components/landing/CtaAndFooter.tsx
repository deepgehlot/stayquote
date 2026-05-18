"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SparklesCore } from "@/components/ui/aceternity";

const SocialIcon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d={d} />
  </svg>
);
const SOCIAL = [
  { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" }, // Facebook
  { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" }, // LinkedIn
  { d: "M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" }, // Twitter
  { d: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20.06 12 20.06 12 20.06s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" }, // YouTube
  { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" }, // Instagram
];

export default function CtaAndFooter() {
  return (
    <>
      {/* CTA Banner */}
      <section className="relative py-20 bg-[#f1611b] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <SparklesCore particleCount={60} className="opacity-30" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6"
          >
            {/* <span className="text-white font-black text-2xl">Q</span> */}
          {/* </motion.div> */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight"
          >
            Start Managing Quotations, Follow-ups and Reservations the Smart Way
          </motion.h2>
          <p className="text-white/80 text-lg mb-10">One simple tool. Affordable price. More bookings for your business.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[#f1611b] font-black hover:bg-gray-50 transition-all shadow-2xl hover:-translate-y-0.5">
              Book Free Demo <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white text-white font-bold hover:bg-white/10 transition-all">
              Start at ₹999/month
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                {/* <div className="w-8 h-8 rounded-lg bg-[#f1611b] flex items-center justify-center">
                  <span className="text-white font-black text-sm">Q</span>
                </div> */}
                <span className="font-black text-white text-lg">
                  Stay<span className="text-[#f1611b]">Quote</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-500 mb-4">
                Software that Shapes Business
              </p>
              {/* <div className="flex gap-3">
                {SOCIAL.map((s, i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#f1611b] hover:text-white transition-colors">
                    <SocialIcon d={s.d} />
                  </a>
                ))}
              </div> */}
            </div>

            {/* Product - Part 1 */}
            <div>
              <div className="font-bold text-white mb-4 text-sm">Product</div>
              <div className="space-y-2.5">
                {[
                  { label: "Features", href: "/#features" },
                  { label: "How It Works", href: "/#how-it-works" },
                  { label: "Screenshots", href: "/#screenshots" },
                ].map((l) => (
                  <a key={l.label} href={l.href} className="block text-sm hover:text-[#f1611b] transition-colors">{l.label}</a>
                ))}
              </div>
            </div>

            {/* Product - Part 2 */}
            <div>
              <div className="font-bold text-white mb-4 text-sm opacity-0 hidden md:block">Product</div>
              <div className="font-bold text-white mb-4 text-sm md:hidden">Resources</div>
              <div className="space-y-2.5">
                {[
                  { label: "Use Cases", href: "/#use-cases" },
                  { label: "Pricing", href: "/#pricing" },
                  { label: "FAQ", href: "/#faq" },
                ].map((l) => (
                  <a key={l.label} href={l.href} className="block text-sm hover:text-[#f1611b] transition-colors">{l.label}</a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="font-bold text-white mb-4 text-sm">Contact with us</div>
              <div className="space-y-2.5 text-sm">
                {/* <a href="tel:+919999949999" className="block hover:text-[#f1611b] transition-colors">+91 99999 4999</a> */}
                <a href="mailto:growth@shapebytes.com" className="block hover:text-[#f1611b] transition-colors">growth@shapebytes.com</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs">© {new Date().getFullYear()} ShapeBytes. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs">
              <Link href="/privacy-policy" className="hover:text-[#f1611b] transition-colors">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="hover:text-[#f1611b] transition-colors">Terms &amp; Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
