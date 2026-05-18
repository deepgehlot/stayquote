"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = ["Features", "How It Works", "Screenshots", "Use Cases", "Pricing", "FAQ"];

export default function LandingNav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          {/* <div className="w-8 h-8 rounded-lg bg-[#f1611b] flex items-center justify-center">
            <span className="text-white font-black text-sm">Q</span>
          </div> */}
          <span className="font-black text-lg text-gray-900">
            Stay<span className="text-[#f1611b]">Quote</span>
          </span>
        </div>
        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s/g, "-")}`}
              className="text-sm font-medium text-gray-600 hover:text-[#f1611b] transition-colors">
              {l}
            </a>
          ))}
        </div>
        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-[#f1611b] transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link href="/login"
            className="px-5 py-2.5 rounded-full bg-[#f1611b] text-white text-sm font-bold hover:bg-[#d94e0f] transition-all shadow-lg shadow-[#f1611b]/30 hover:-translate-y-0.5">
            Book Free Demo
          </Link>
        </div>
        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg text-gray-600">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {navLinks.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s/g, "-")}`}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-gray-700 py-2 hover:text-[#f1611b]">{l}</a>
          ))}
          <Link href="/login" onClick={() => setOpen(false)}
            className="block text-center mt-2 px-5 py-3 rounded-full bg-[#f1611b] text-white text-sm font-bold">
            Book Free Demo
          </Link>
        </div>
      )}
    </nav>
  );
}
