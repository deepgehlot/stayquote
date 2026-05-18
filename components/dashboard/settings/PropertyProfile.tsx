"use client";

import React from "react";
import { User, Save, Loader2, Camera, Mail, Phone, Globe, MapPin } from "lucide-react";

interface PropertyProfileProps {
  adminUsername: string;
  setAdminUsername: (val: string) => void;
  propertyTitle: string;
  setPropertyTitle: (val: string) => void;
  officialEmail: string;
  setOfficialEmail: (val: string) => void;
  contactPhone: string;
  setContactPhone: (val: string) => void;
  websiteUrl: string;
  setWebsiteUrl: (val: string) => void;
  propertyAddress: string;
  setPropertyAddress: (val: string) => void;
  profilePic: string | null;
  setProfilePic: (val: string | null) => void;
  phoneError: string;
  setPhoneError: (val: string) => void;
  emailError: string;
  setEmailError: (val: string) => void;
  isSaving: boolean;
  onSave: (section: any) => void;
}

export default function PropertyProfile({
  adminUsername,
  setAdminUsername,
  propertyTitle,
  setPropertyTitle,
  officialEmail,
  setOfficialEmail,
  contactPhone,
  setContactPhone,
  websiteUrl,
  setWebsiteUrl,
  propertyAddress,
  setPropertyAddress,
  profilePic,
  setProfilePic,
  phoneError,
  setPhoneError,
  emailError,
  setEmailError,
  isSaving,
  onSave,
}: PropertyProfileProps) {
  return (
    <section
      id="profile"
      className="animate-in fade-in slide-in-from-bottom-8 duration-700"
    >
      <div className="bg-white border border-gray-100 rounded-[2rem] p-5 md:p-10 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full -mr-16 -mt-16 blur-3xl cursor-pointer transition-all group-hover:bg-orange-600/10" />

        <div className="relative z-10 space-y-4 md:space-y-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 pb-8 border-b border-gray-50 text-center md:text-left">
            <User className="w-10 h-10 text-orange-600 shrink-0" />
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Property Profile
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Update your property's public identity and contact information.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 pb-4 border-b border-gray-50">
            <div className="relative group cursor-pointer">
              <input
                type="file"
                id="logo-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setProfilePic(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label
                htmlFor="logo-upload"
                className="w-32 h-32 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:border-orange-500 hover:bg-orange-50/30 overflow-hidden relative"
              >
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <Camera className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Upload Logo
                    </span>
                  </>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                    Change Logo
                  </span>
                </div>
              </label>
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Administrator Username
                </p>
                <h3 className="text-xl font-bold text-slate-900">
                  {adminUsername || "System Admin"}
                </h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                This logo and name will appear on all your quotations,
                reservations, and invoices. Recommended size: 512x512px.
              </p>
              {profilePic && (
                <button
                  onClick={() => setProfilePic(null)}
                  className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors"
                >
                  Remove Logo
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            {/* Property Name */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Property Name
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={propertyTitle}
                  onChange={(e) => setPropertyTitle(e.target.value)}
                  placeholder="e.g. Grand Vista Resort"
                  className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-500 rounded-xl pl-5 pr-11 py-3.5 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-900 font-semibold placeholder:text-slate-300 shadow-sm hover:border-slate-300"
                />
              </div>
            </div>

            {/* Official Email */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Official Email
                </label>
                {emailError && (
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                    {emailError}
                  </span>
                )}
              </div>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={officialEmail}
                  onChange={(e) => {
                    setOfficialEmail(e.target.value);
                    if (e.target.value && !e.target.value.includes("@")) {
                      setEmailError("Invalid email format");
                    } else {
                      setEmailError("");
                    }
                  }}
                  placeholder="e.g. contact@hotel.com"
                  className={`w-full bg-white border ${emailError ? "border-red-300" : "border-slate-200"} border-r-4 border-r-orange-500 rounded-xl pl-5 pr-11 py-3.5 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-900 font-semibold placeholder:text-slate-300 shadow-sm hover:border-slate-300`}
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Contact Phone
                </label>
                {phoneError && (
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                    {phoneError}
                  </span>
                )}
              </div>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setContactPhone(val);
                    if (val && val.length !== 10) {
                      setPhoneError("Must be 10 digits");
                    } else {
                      setPhoneError("");
                    }
                  }}
                  placeholder="e.g. 9876543210"
                  className={`w-full bg-white border ${phoneError ? "border-red-300" : "border-slate-200"} border-r-4 border-r-orange-500 rounded-xl pl-5 pr-11 py-3.5 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-900 font-semibold placeholder:text-slate-300 shadow-sm hover:border-slate-300`}
                />
              </div>
            </div>

            {/* Website URL */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Website URL
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="e.g. https://www.hotel.com"
                  className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-500 rounded-xl pl-5 pr-11 py-3.5 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-900 font-semibold placeholder:text-slate-300 shadow-sm hover:border-slate-300"
                />
              </div>
            </div>

            {/* Property Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Property Address
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-6 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <textarea
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  rows={2}
                  placeholder="e.g. 123 Luxury Avenue, Coastal Highway"
                  className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-500 rounded-xl pl-5 pr-11 py-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-900 font-semibold placeholder:text-slate-300 shadow-sm hover:border-slate-300 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 md:mt-5 md:pt-5 border-t border-slate-50 flex justify-center md:justify-end">
          <button
            onClick={() => onSave("profile")}
            disabled={isSaving}
            className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-8 py-3.5 md:px-12 md:py-5 rounded-2xl font-bold cursor-pointer transition-all shadow-xl active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <Save className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
            )}
            <span className="text-sm md:text-base tracking-wide">{isSaving ? "Saving..." : "Save Profile Changes"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
