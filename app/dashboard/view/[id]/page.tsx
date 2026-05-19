"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Bed,
  Sparkles,
  CreditCard,
  FileText,
  MessageSquare,
  Send,
  Loader2,
  AlertCircle,
  Building,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { getApiUrl } from "@/lib/api";
import Swal from "sweetalert2";
import PDFPreviewModal from "@/components/dashboard/modals/PDFPreviewModal";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      // 1. Fetch Booking Details
      const bookingRes = await fetch(getApiUrl(`bookings/${id}`), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!bookingRes.ok) {
        throw new Error("Could not fetch the document details.");
      }
      const bookingData = await bookingRes.json();
      const actualBooking = bookingData.booking || bookingData;
      setBooking(actualBooking);

      // 2. Fetch Branding & Settings
      const settingsRes = await fetch(getApiUrl("settings"), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        const s = settingsData.settings || (Array.isArray(settingsData) ? settingsData[0] : settingsData);
        setSettings(s);
      }
    } catch (err: any) {
      console.error("Fetch details error:", err);
      setError(err.message || "Failed to load booking details.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppShare = () => {
    if (!booking) return;
    const phoneNum = booking.clientContact ? booking.clientContact.replace(/\D/g, "") : "";
    const shareLink = `${window.location.origin}/view/${booking._id}`;

    const checkIn = new Date(booking.checkIn).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const checkOut = new Date(booking.checkOut).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const propName = settings?.title || "StayQuote";
    const text = `Hello *${booking.clientName}*,\n\nGreetings from *${propName}*!\n\nWe are pleased to share the details of your booking. Please find the summary below:\n\n*Reference ID:* ${booking.bookingId}\n*Stay:* ${checkIn} to ${checkOut}\n*Total Amount:* ₹${(booking.payment?.grandTotal || 0).toLocaleString("en-IN")}\n\n*View/Download Detailed PDF:* \n${shareLink}\n\nWe look forward to hosting you. If you have any questions, please feel free to reach out.\n\nWarm Regards,\n*${propName} Team*`;

    window.open(`https://wa.me/${phoneNum}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleMailShare = async () => {
    if (!booking) return;
    try {
      const token = localStorage.getItem("authToken");

      Swal.fire({
        title: "Sending Email...",
        text: "Delivering booking confirmation to the guest.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        background: "#ffffff",
        color: "#0f172a",
      });

      const res = await fetch(getApiUrl(`bookings/${booking._id}/send-email`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        Swal.fire({
          title: "Success!",
          text: "Email sent successfully to the guest via SMTP.",
          icon: "success",
          confirmButtonColor: "#ea580c",
        });
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to send email");
      }
    } catch (err: any) {
      console.error("Mail Share Error:", err);
      Swal.fire({
        title: "Email Error",
        text: err.message || "Could not send email. Check SMTP settings.",
        icon: "error",
        confirmButtonColor: "#ea580c",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "confirmed" || s === "paid") return "bg-green-50 text-green-700 border-green-200";
    if (s === "checked-out" || s === "completed") return "bg-blue-50 text-blue-700 border-blue-200";
    if (s === "cancelled" || s === "declined") return "bg-red-50 text-red-700 border-red-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  const getStatusIcon = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "confirmed" || s === "paid") return <CheckCircle className="w-4 h-4 text-green-700" />;
    if (s === "checked-out" || s === "completed") return <CheckCircle className="w-4 h-4 text-blue-700" />;
    if (s === "cancelled" || s === "declined") return <XCircle className="w-4 h-4 text-red-700" />;
    return <HelpCircle className="w-4 h-4 text-amber-700" />;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-4 border border-slate-100">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
        </div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] animate-pulse">
          Loading Booking Details...
        </p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mb-4 border border-red-100 text-red-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
        <p className="text-gray-400 max-w-xs mx-auto mb-6 text-sm">
          {error || "The booking details could not be loaded or do not exist."}
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    );
  }

  const items = (booking.rooms || []).concat(booking.services || []);
  const guestCountStr = typeof booking.guests === "object"
    ? `${booking.guests.adults || 0} Adults${Number(booking.guests.kids || 0) > 0 ? `, ${booking.guests.kids} Kids` : ""}`
    : `${booking.guests || 0} Guests`;

  const brandColor = settings?.pdf?.color || "#ea580c";

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-12 h-12 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl shadow-sm flex items-center justify-center transition-all cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusColor(booking.status)} flex items-center gap-1`}>
                {getStatusIcon(booking.status)}
                {booking.status}
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {booking.type}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {booking.bookingId}
            </h1>
          </div>
        </div>

        {/* Quick Share Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex-1 sm:flex-initial py-2.5 px-3 sm:px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
            title="Open PDF Preview"
          >
            <FileText className="w-4 h-4 text-orange-600" />
            <span className="hidden sm:inline">Open PDF Preview</span>
          </button>
          <button
            onClick={handleWhatsAppShare}
            className="flex-1 sm:flex-initial py-2.5 px-3 sm:px-4 text-white bg-green-600 hover:bg-green-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-lg shadow-green-500/10"
            title="WhatsApp Guest"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp Guest</span>
          </button>
          <button
            onClick={handleMailShare}
            className="flex-1 sm:flex-initial py-2.5 px-3 sm:px-4 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-lg shadow-slate-900/10"
            title="Email Guest"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Email Guest</span>
          </button>
        </div>
      </div>      <div className="space-y-5">
        {/* Card: Guest Info */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 blur-[80px] -mr-16 -mt-16" />
          <h2 className="text-base font-black text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
            <User className="w-4 h-4 text-orange-600" /> Guest Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Guest Name</p>
                <p className="text-sm font-bold text-slate-900 capitalize">{booking.clientName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:col-span-2 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                <Mail className="w-5 h-5 text-slate-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Email Address</p>
                <p className="text-sm font-bold text-slate-900 truncate" title={booking.clientEmail || undefined}>{booking.clientEmail || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                <Phone className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Contact Number</p>
                <p className="text-sm font-bold text-slate-900">{booking.clientContact || booking.clientPhone || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                <Calendar className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Guests Count</p>
                <p className="text-sm font-bold text-slate-900">{guestCountStr}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card: Stay Metrics */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-base font-black text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" /> Stay Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50/50 flex items-center justify-center border border-orange-100 shrink-0">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Check In Date</p>
                <p className="text-sm font-black text-slate-900">
                  {new Date(booking.checkIn).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50/50 flex items-center justify-center border border-orange-100 shrink-0">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Check Out Date</p>
                <p className="text-sm font-black text-slate-900">
                  {new Date(booking.checkOut).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50/50 flex items-center justify-center border border-orange-100 shrink-0">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Duration</p>
                <p className="text-sm font-black text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-lg inline-block mt-0.5">
                  {booking.nights || 0} Nights
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card: Rooms and Services Table */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-base font-black text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2 whitespace-nowrap">
            <Bed className="w-4 h-4 text-orange-600 shrink-0" /> Accommodation & Services
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-gray-100 whitespace-nowrap">
                  <th className="pb-4 w-12 text-center">#</th>
                  <th className="pb-4 px-4">Description</th>
                  <th className="pb-4 px-2 text-center">Qty / Nights</th>
                  <th className="pb-4 px-4 text-right">Rate</th>
                  {booking.payment?.totalGST > 0 && <th className="pb-4 px-2 text-center">GST (%)</th>}
                  <th className="pb-4 pr-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-center font-bold text-gray-400 text-xs">{i + 1}</td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-800 text-sm">
                        {item.roomName || item.serviceName}
                      </p>
                      {item.description && (
                        <p className="text-[10px] text-gray-400 mt-0.5 leading-normal max-w-sm">
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-2 text-center font-semibold text-slate-955 text-sm">
                      {item.qty || booking.nights || 1}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-slate-700 text-sm">
                      ₹{(item.rate || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    {booking.payment?.totalGST > 0 && (
                      <td className="py-4 px-2 text-center font-semibold text-slate-700 text-sm">
                        {item.gst || 0}%
                      </td>
                    )}
                    <td className="py-4 pr-2 text-right font-black text-slate-900 text-sm">
                      ₹{(item.total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card: Payment & Pricing Details */}
        <div className="bg-slate-900 border border-slate-900 text-white rounded-xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-[80px] -mr-16 -mt-16 animate-pulse" />
          <h2 className="text-base font-black uppercase tracking-wider mb-6 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-orange-500" /> Financial Summary
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Subtotal</span>
              <span className="text-sm font-semibold text-white">
                ₹{(booking.payment?.subtotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {booking.payment?.totalGST > 0 ? (
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">GST/Tax</span>
                <span className="text-sm font-semibold text-white">
                  ₹{(booking.payment?.totalGST || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ) : (
              <div className="hidden md:block" />
            )}

            {booking.type === "reservation" ? (
              <>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Advance Paid</span>
                  <span className="text-sm font-semibold text-green-400">
                    ₹{(booking.payment?.advancePaid || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Remaining Balance</span>
                  <span className="text-sm font-semibold text-amber-400">
                    ₹{(booking.payment?.pendingAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="hidden md:block" />
                <div className="hidden md:block" />
              </>
            )}

            <div className="col-span-2 md:col-span-1 md:text-right border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Grand Total</span>
              <span className="text-xl font-black tracking-tight" style={{ color: brandColor }}>
                ₹{(booking.payment?.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <PDFPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        bookingData={booking}
        settings={settings}
      />
    </div>
  );
}
