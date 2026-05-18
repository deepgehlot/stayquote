"use client";

import React from "react";
import { Settings, EyeOff, Eye, Save, Loader2, Server, Hash, Mail, Lock } from "lucide-react";

interface EmailConfigProps {
  smtpHost: string;
  setSmtpHost: (val: string) => void;
  smtpPort: number;
  setSmtpPort: (val: number) => void;
  smtpUser: string;
  setSmtpUser: (val: string) => void;
  smtpPass: string;
  setSmtpPass: (val: string) => void;
  showSmtpPass: boolean;
  setShowSmtpPass: (val: boolean) => void;
  isSaving: boolean;
  onSave: (section: any) => void;
}

export default function EmailConfig({
  smtpHost,
  setSmtpHost,
  smtpPort,
  setSmtpPort,
  smtpUser,
  setSmtpUser,
  smtpPass,
  setSmtpPass,
  showSmtpPass,
  setShowSmtpPass,
  isSaving,
  onSave,
}: EmailConfigProps) {
  return (
    <section id="smtp">
      <div className="bg-white border border-slate-100 rounded-[2rem] p-5 md:p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        <div className="space-y-6 md:space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 border-b border-slate-50 text-center md:text-left">
            <Settings className="w-10 h-10 text-orange-600 shrink-0" />
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Email Configuration (SMTP)
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Configure your hotel's SMTP settings to send professional emails directly to your clients.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            {/* SMTP Host */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                SMTP Host
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Server className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  placeholder="e.g. smtp.gmail.com"
                  className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-500 rounded-xl pl-5 pr-11 py-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-900 font-semibold placeholder:text-slate-300 shadow-sm hover:border-slate-300"
                />
              </div>
            </div>

            {/* SMTP Port */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                SMTP Port
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(parseInt(e.target.value))}
                  placeholder="e.g. 587"
                  className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-500 rounded-xl pl-5 pr-11 py-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-900 font-semibold placeholder:text-slate-300 shadow-sm hover:border-slate-300"
                />
              </div>
            </div>

            {/* SMTP User */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                SMTP User / Email
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="your-email@domain.com"
                  className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-500 rounded-xl pl-5 pr-11 py-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-900 font-semibold placeholder:text-slate-300 shadow-sm hover:border-slate-300"
                />
              </div>
            </div>

            {/* SMTP Password */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                SMTP Password
              </label>
              <div className="relative group">
                <div className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showSmtpPass ? "text" : "password"}
                  value={smtpPass}
                  onChange={(e) => setSmtpPass(e.target.value)}
                  placeholder={smtpHost ? "•••••••• (Password Saved)" : "Your SMTP App Password"}
                  className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-500 rounded-xl pl-5 pr-20 py-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-900 font-semibold placeholder:text-slate-300 shadow-sm hover:border-slate-300"
                />
                <button
                  onClick={() => setShowSmtpPass(!showSmtpPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors p-1"
                >
                  {showSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 md:pt-5 border-t border-slate-50 flex justify-center md:justify-end">
            <button
              onClick={() => onSave("smtp")}
              disabled={isSaving}
              className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-8 py-3.5 md:px-12 md:py-5 rounded-2xl font-bold cursor-pointer transition-all shadow-xl active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <Save className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
              )}
              <span className="text-sm md:text-base tracking-wide">
                {isSaving ? "Saving..." : "Save Email Settings"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
