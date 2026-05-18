"use client";

import React from "react";
import { ShieldCheck, Plus, Trash2, Save, Loader2, FileText, X } from "lucide-react";

interface PoliciesLegalProps {
  paymentTerms: string[];
  setPaymentTerms: (val: string[]) => void;
  cancellationPolicies: string[];
  setCancellationPolicies: (val: string[]) => void;
  isSaving: boolean;
  onSave: (section: any) => void;
}

export default function PoliciesLegal({
  paymentTerms,
  setPaymentTerms,
  cancellationPolicies,
  setCancellationPolicies,
  isSaving,
  onSave,
}: PoliciesLegalProps) {
  return (
    <section id="policies">
      <div className="bg-white border border-slate-100 rounded-[2rem] p-5 md:p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        <div className="space-y-6 md:space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5
           border-b border-slate-50 text-center md:text-left">
            <ShieldCheck className="w-10 h-10 text-orange-600 shrink-0" />
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Policies & Legal
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Define your booking terms and cancellation policies for legal compliance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
            {/* Payment Terms */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Payment Terms
                </h3>
                <button
                  onClick={() => setPaymentTerms([...paymentTerms, "New payment term..."])}
                  className="p-2 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-xl transition-all border border-orange-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                 {paymentTerms.map((term, idx) => (
                  <div key={idx} className="relative group">
                    <input
                      type="text"
                      value={term}
                      onChange={(e) => {
                        const newTerms = [...paymentTerms];
                        newTerms[idx] = e.target.value;
                        setPaymentTerms(newTerms);
                      }}
                      className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-600 rounded-xl pl-4 pr-12 py-2.5 text-xs font-semibold outline-none focus:border-orange-500 transition-all text-slate-700 shadow-sm"
                    />
                    <button
                      onClick={() => setPaymentTerms(paymentTerms.filter((_, i) => i !== idx))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {paymentTerms.length === 0 && (
                  <div className="py-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">No payment terms added yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cancellation Policies */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Cancellation Policies
                </h3>
                <button
                  onClick={() => setCancellationPolicies([...cancellationPolicies, "New cancellation policy..."])}
                  className="p-2 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-xl transition-all border border-orange-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {cancellationPolicies.map((policy, idx) => (
                  <div key={idx} className="relative group">
                    <input
                      type="text"
                      value={policy}
                      onChange={(e) => {
                        const newPolicies = [...cancellationPolicies];
                        newPolicies[idx] = e.target.value;
                        setCancellationPolicies(newPolicies);
                      }}
                      className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-600 rounded-xl pl-4 pr-12 py-2.5 text-xs font-semibold outline-none focus:border-orange-500 transition-all text-slate-700 shadow-sm"
                    />
                    <button
                      onClick={() => setCancellationPolicies(cancellationPolicies.filter((_, i) => i !== idx))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {cancellationPolicies.length === 0 && (
                  <div className="py-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">No cancellation policies added yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 md:pt-5 border-t border-slate-50 flex justify-center md:justify-end">
            <button
              onClick={() => onSave("policies")}
              disabled={isSaving}
              className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-6 py-3.5 md:px-12 md:py-5 rounded-2xl font-bold cursor-pointer transition-all shadow-xl active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <Save className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
              )}
              <span className="text-xs md:text-base tracking-wide whitespace-nowrap">
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <span className="hidden md:inline">Save Policy Changes</span>
                    <span className="md:hidden">Save Policies</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
