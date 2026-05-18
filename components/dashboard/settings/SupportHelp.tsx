"use client";

import React from "react";
import { Headset, HeadsetIcon, MessageSquare, Mail } from "lucide-react";

const SupportHelp = () => {
  return (
    <section id="support" className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-slate-900 rounded-[2rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-600/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 text-center md:text-left">
            <HeadsetIcon className="w-12 h-12 text-orange-500 shrink-0" />
            <div className="space-y-1">
              <h2 className="text-4xl font-black tracking-tight">
                Support & Help
              </h2>
            </div>
          </div>
          <p className="text-slate-400 text-lg mb-12 leading-relaxed font-medium">
            Need help with your property management system? Our technical
            team is here to assist you 24/7 with any queries or configurations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <button className="flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-500 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-orange-600/20 cursor-pointer active:scale-95 group">
              <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Live Chat Support</span>
            </button>
            <a
              href="mailto:growth@shapebytes.com"
              className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-bold transition-all border border-white/10 text-center cursor-pointer active:scale-95 group"
            >
              <Mail className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              <span>Email Support</span>
            </a>
          </div>
        </div>

        {/* Decorative Large Icon */}
        <Headset className="absolute -bottom-16 -right-16 w-80 h-80 text-white/5 rotate-12" />
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Documentation", desc: "Step-by-step guides for everything.", icon: FileText },
          { title: "Video Tutorials", desc: "Watch how to manage your hotel.", icon: PlayCircle },
          { title: "API Reference", desc: "For developers and integrations.", icon: Code },
        ].map((item, i) => (
          <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
              <item.icon className="w-6 h-6 text-slate-400 group-hover:text-orange-600 transition-colors" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
            <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Import missing icons for the grid
import { FileText, PlayCircle, Code } from "lucide-react";

export default SupportHelp;
