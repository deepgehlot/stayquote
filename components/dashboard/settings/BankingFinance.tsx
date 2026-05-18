"use client";

import React from "react";
import { Landmark, Save, Loader2, CreditCard, User, Hash, Code, MapPin, FileText, Code2 } from "lucide-react";

interface BankingFinanceProps {
  bankName: string;
  setBankName: (val: string) => void;
  branchName: string;
  setBranchName: (val: string) => void;
  accountHolder: string;
  setAccountHolder: (val: string) => void;
  accountType: string;
  setAccountType: (val: string) => void;
  accountNumber: string;
  setAccountNumber: (val: string) => void;
  ifscCode: string;
  setIfscCode: (val: string) => void;
  upiId: string;
  setUpiId: (val: string) => void;
  gstNumber: string;
  setGstNumber: (val: string) => void;
  qrCode: string | null;
  setQrCode: (val: string | null) => void;
  isSaving: boolean;
  onSave: (section: any) => void;
}

export default function BankingFinance({
  bankName,
  setBankName,
  branchName,
  setBranchName,
  accountHolder,
  setAccountHolder,
  accountType,
  setAccountType,
  accountNumber,
  setAccountNumber,
  ifscCode,
  setIfscCode,
  upiId,
  setUpiId,
  gstNumber,
  setGstNumber,
  qrCode,
  setQrCode,
  isSaving,
  onSave,
}: BankingFinanceProps) {
  return (
    <section id="banking">
      <div className="bg-white border border-slate-100 rounded-[2rem] p-5 md:p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        <div className="space-y-6 md:space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 border-b border-slate-50 text-center md:text-left">
            <Landmark className="w-10 h-10 text-orange-600 shrink-0" />
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Banking & Finance
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Add your bank details to appear on invoices for direct bank transfers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            {/* Bank Name */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Bank Name
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Landmark className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. HDFC Bank"
                  className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-600 rounded-xl pl-5 pr-11 py-3 text-sm outline-none focus:border-orange-500 transition-all text-slate-900 font-semibold placeholder:text-slate-300 shadow-sm"
                />
              </div>
            </div>

            {/* Branch Name */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Branch Name
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="e.g. Mumbai Main Branch"
                  className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-600 rounded-xl pl-5 pr-11 py-3 text-sm outline-none focus:border-orange-500 transition-all text-slate-900 font-semibold placeholder:text-slate-300 shadow-sm"
                />
              </div>
            </div>

            {/* Account Holder Name */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Account Holder Name
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Full Name as per bank"
                  className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-600 rounded-xl pl-5 pr-11 py-3 text-sm outline-none focus:border-orange-500 transition-all text-slate-900 font-semibold placeholder:text-slate-300 shadow-sm"
                />
              </div>
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Account Type
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-600 rounded-xl pl-5 pr-11 py-3 text-sm outline-none focus:border-orange-500 transition-all text-slate-900 font-semibold appearance-none cursor-pointer shadow-sm"
                >
                  <option value="Savings Account">Savings Account</option>
                  <option value="Current Account">Current Account</option>
                  <option value="Business Account">Business Account</option>
                </select>
              </div>
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Account Number
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Bank Account Number"
                  className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-600 rounded-xl pl-5 pr-11 py-3 text-sm outline-none focus:border-orange-500 transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-sm"
                />
              </div>
            </div>

            {/* IFSC Code */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                IFSC Code
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Code className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="IFSC Code"
                  className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-600 rounded-xl pl-5 pr-11 py-3 text-sm outline-none focus:border-orange-500 transition-all text-slate-900 uppercase font-bold placeholder:text-slate-300 shadow-sm"
                />
              </div>
            </div>

            {/* UPI ID */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                UPI ID
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Code2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. upi@id"
                  className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-600 rounded-xl pl-5 pr-11 py-3 text-sm outline-none focus:border-orange-500 transition-all text-slate-900 font-semibold placeholder:text-slate-300 shadow-sm"
                />
              </div>
            </div>

            {/* GST Number */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                GST Number (Optional)
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  placeholder="GSTIN"
                  className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-600 rounded-xl pl-5 pr-11 py-3 text-sm outline-none focus:border-orange-500 transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-sm"
                />
              </div>
            </div>
          </div>


          <div className="pt-4 md:pt-5 border-t border-slate-50 flex justify-center md:justify-end">
            <button
              onClick={() => onSave("banking")}
              disabled={isSaving}
              className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-8 py-3.5 md:px-12 md:py-5 rounded-2xl font-bold cursor-pointer transition-all shadow-xl active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <Save className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
              )}
              <span className="text-sm md:text-base tracking-wide">
                {isSaving ? "Saving..." : "Save Bank Details"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
