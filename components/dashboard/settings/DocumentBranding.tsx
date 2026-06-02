"use client";

import React from "react";
import { Sparkles, Layout, Eye, Check, Save, Loader2, FileText, Hash, Palette } from "lucide-react";

interface DocumentBrandingProps {
  quotationPrefix: string;
  setQuotationPrefix: (val: string) => void;
  reservationPrefix: string;
  setReservationPrefix: (val: string) => void;
  pdfLayout: string;
  setPdfLayout: (val: string) => void;
  pdfColor: string;
  setPdfColor: (val: string) => void;
  setPreviewData: (data: any) => void;
  setPreviewLayout: (layout: string) => void;
  setIsPreviewModalOpen: (val: boolean) => void;
  isSaving: boolean;
  onSave: (section: any) => void;
}

export default function DocumentBranding({
  quotationPrefix,
  setQuotationPrefix,
  reservationPrefix,
  setReservationPrefix,
  pdfLayout,
  setPdfLayout,
  pdfColor,
  setPdfColor,
  setPreviewData,
  setPreviewLayout,
  setIsPreviewModalOpen,
  isSaving,
  onSave,
}: DocumentBrandingProps) {
  const [isCasaUser, setIsCasaUser] = React.useState(false);

  React.useEffect(() => {
    const user = localStorage.getItem("username");
    const propertyTitle = localStorage.getItem("propertyTitle");
    if (user === "CasaConcreto" || propertyTitle?.replace(/\s+/g, '').toLowerCase() === "casaconcreto") {
      setIsCasaUser(true);
      if (pdfLayout !== "CasaConcreto") {
        setPdfLayout("CasaConcreto");
      }
    }
  }, [pdfLayout, setPdfLayout]);

  return (
    <section id="system">
      <div className="bg-white border border-slate-100 rounded-[2rem] p-5 md:p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        <div className="space-y-6 md:space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 border-b border-slate-50 text-center md:text-left">
            <Sparkles className="w-10 h-10 text-orange-600 shrink-0" />
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Document & PDF Branding
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Manage your document prefixes, layouts, and visual identity for all generated PDFs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            {/* Quotation Prefix */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Quotation Prefix
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={quotationPrefix}
                  onChange={(e) => setQuotationPrefix(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-500 rounded-xl pl-5 pr-11 py-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-900 font-bold uppercase tracking-widest shadow-sm hover:border-slate-300"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium px-1">
                Example: <span className="text-orange-600 font-bold">{quotationPrefix}-123456</span>
              </p>
            </div>

            {/* Reservation Prefix */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Reservation Prefix
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={reservationPrefix}
                  onChange={(e) => setReservationPrefix(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-slate-200 border-r-4 border-r-orange-500 rounded-xl pl-5 pr-11 py-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-900 font-bold uppercase tracking-widest shadow-sm hover:border-slate-300"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium px-1">
                Example: <span className="text-orange-600 font-bold">{reservationPrefix}-123456</span>
              </p>
            </div>

            <div className="md:col-span-2 space-y-8">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">PDF Layout Style</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Choose the aesthetic framework for your generated documents.</p>
              </div>
              <div className={isCasaUser ? "flex gap-6" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"}>
                {[
                  { id: "Modern", name: "Modern Minimal", desc: "Clean & Simple" },
                  { id: "Classic", name: "Classic Corporate", desc: "Professional & Sharp" },
                  { id: "Signature", name: "Signature Luxury", desc: "Elegant & Premium" },
                  { id: "Elite", name: "Elite Royal", desc: "High-End & Asymmetric" },
                  { id: "CasaConcreto", name: "Casa Concreto", desc: "Premium 2-Page Layout" },
                ].filter(layout => isCasaUser ? layout.id === "CasaConcreto" : layout.id !== "CasaConcreto").map((layout) => (
                  <div
                    key={layout.id}
                    onClick={() => setPdfLayout(layout.id)}
                    className={`group relative p-6 sm:p-5 lg:p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 ${isCasaUser ? "w-full sm:w-72" : ""} ${
                      pdfLayout === layout.id
                        ? "bg-orange-50/30 border-orange-600 border-r-4 border-r-orange-600 shadow-2xl shadow-orange-600/10 scale-[1.02]"
                        : "bg-white border-slate-100 border-r-4 border-r-slate-100 hover:border-slate-200 hover:border-r-orange-500/50"
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:gap-4">
                      <div className="flex justify-between items-start gap-2">
                        <div
                          className={`w-12 h-12 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                            pdfLayout === layout.id
                              ? "bg-orange-600 text-white shadow-xl shadow-orange-600/30"
                              : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                          }`}
                        >
                          <Layout className="w-6 h-6 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                        </div>
                        <div className="flex items-center gap-1.5 lg:gap-2">
                          <button
                            className="w-9 h-9 sm:w-8 sm:h-8 lg:w-9 lg:h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-orange-600 hover:border-orange-500 shadow-sm cursor-pointer transition-all active:scale-90"
                            title="Live Preview"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewData({
                                type: "quotation",
                                bookingId: "SAMPLE-123",
                                clientName: "John Doe (Sample)",
                                clientPhone: "+91 9876543210",
                                clientEmail: "sample@example.com",
                                checkIn: new Date().toISOString(),
                                checkOut: new Date(Date.now() + 86400000 * 2).toISOString(),
                                nights: 2,
                                guests: 2,
                                rooms: [{ roomName: "Deluxe Suite", qty: 1, rate: 5000, total: 10000, description: "King size bed, Garden view" }],
                                services: [{ serviceName: "Airport Pickup", qty: 1, rate: 1500, total: 1500, description: "Luxury Sedan" }],
                                subtotal: 11500,
                                total: 11500,
                                totalInWords: "Eleven Thousand Five Hundred",
                                createdAt: new Date().toISOString(),
                              });
                              setPreviewLayout(layout.id);
                              setIsPreviewModalOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-4.5 lg:h-4.5" />
                          </button>
                          {pdfLayout === layout.id && (
                            <div className="w-9 h-9 sm:w-8 sm:h-8 lg:w-9 lg:h-9 flex items-center justify-center bg-orange-600 rounded-xl text-white shadow-lg shadow-orange-600/20 animate-in zoom-in-50">
                              <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-4.5 lg:h-4.5" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h4 className={`text-lg sm:text-base lg:text-lg font-black transition-colors duration-500 ${pdfLayout === layout.id ? "text-orange-600" : "text-slate-900"}`}>{layout.name}</h4>
                        <p className="text-[10px] sm:text-[9px] lg:text-[10px] text-slate-400 font-bold uppercase tracking-widest">{layout.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!isCasaUser && (
              <div className="md:col-span-2 space-y-8">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">PDF Accent Color</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">Select the primary color used for accents and highlights in your documents.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                  {["#ea580c", "#0369a1", "#1e3a8a", "#15803d", "#7f1d1d", "#4c1d95", "#0f172a"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setPdfColor(color)}
                      className={`w-10 h-10 rounded-full border-2 cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-md flex items-center justify-center ${pdfColor?.toLowerCase() === color.toLowerCase() ? "border-white ring-2 ring-orange-500/30 scale-110 shadow-lg shadow-black/20" : "border-transparent hover:border-white/50"}`}
                      style={{ backgroundColor: color }}
                    >
                      {pdfColor?.toLowerCase() === color.toLowerCase() && (
                        <Check className="w-5 h-5 text-white drop-shadow-md animate-in zoom-in-50 duration-300" />
                      )}
                    </button>
                  ))}

                  {/* Custom Color Picker */}
                  <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div 
                      className="relative group/picker w-10 h-10 rounded-full border border-slate-200 shadow-md overflow-hidden transition-all hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
                      style={{ 
                        background: !["#ea580c", "#0369a1", "#1e3a8a", "#15803d", "#7f1d1d", "#4c1d95", "#0f172a"].includes(pdfColor?.toLowerCase()) 
                          ? pdfColor 
                          : "linear-gradient(135deg, #ff0055, #00ffcc, #9900ff)" 
                      }}
                      title="Choose Custom Color"
                    >
                      <input
                        type="color"
                        value={pdfColor || "#ea580c"}
                        onChange={(e) => setPdfColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      />
                      {!["#ea580c", "#0369a1", "#1e3a8a", "#15803d", "#7f1d1d", "#4c1d95", "#0f172a"].includes(pdfColor?.toLowerCase()) ? (
                        <Check className="w-5 h-5 text-white drop-shadow-md z-10 pointer-events-none animate-in zoom-in-50 duration-300" />
                      ) : (
                        <Palette className="w-5 h-5 text-white drop-shadow-md z-10 pointer-events-none animate-pulse duration-1000" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Custom Color</span>
                      <span className="text-xs font-black text-slate-700 tracking-wider uppercase">{pdfColor || "#ea580c"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 md:pt-5 border-t border-slate-50 flex justify-center md:justify-end">
            <button
              onClick={() => onSave("system")}
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
                    <span className="hidden md:inline">Save Branding Configuration</span>
                    <span className="md:hidden">Save Branding</span>
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
