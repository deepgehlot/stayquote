"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Search,
  PlusCircle,
  Trash2,
  Edit3,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Download,
  Mail,
  MoreVertical,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import BookingModal from "@/components/dashboard/modals/BookingModal";
import PDFPreviewModal from "@/components/dashboard/modals/PDFPreviewModal";
import { getApiUrl } from "@/lib/api";
import { pdf } from "@react-pdf/renderer";
import PDFWrapper from "@/components/dashboard/pdf/PDFWrapper";

interface ReservationsClientProps {
  initialBookings?: any[];
  initialSettings?: any;
}

export default function ReservationsClient({
  initialBookings = [],
  initialSettings = null,
}: ReservationsClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);
  const [isEdit, setIsEdit] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>(initialBookings);
  const [isLoading, setIsLoading] = useState(!initialBookings || initialBookings.length === 0);
  const [viewingBooking, setViewingBooking] = useState<any>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [settings, setSettings] = useState<any>(initialSettings);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");

      // Fetch Bookings
      const res = await fetch(getApiUrl("bookings"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();

        const allBookings = data.bookings || (Array.isArray(data) ? data : []);
        const filtered = allBookings.filter(
          (b: any) => b.type === "reservation",
        );

        setBookings(filtered);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialBookings || initialBookings.length === 0) {
      fetchBookings();
    }
    if (!initialSettings) {
      fetchSettings();
    }
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(getApiUrl("settings"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();

        const s = data.settings || data.data || (Array.isArray(data) ? data[0] : data);
        setSettings(s);
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  // Filter data
  const filteredData = bookings.filter(
    (r) =>
      (r.clientName || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.bookingId || "").toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination Logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(
    indexOfFirstEntry,
    indexOfLastEntry,
  );
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(currentEntries.map((r) => r._id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        status: newStatus,
        roomBlocked: newStatus === "Confirmed",
      };

      const res = await fetch(getApiUrl(`bookings/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)),
        );
        router.refresh();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Reservation?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ea580c",
      cancelButtonColor: "#0f172a",
      confirmButtonText: "Yes, delete it!",
      background: "#ffffff",
      color: "#0f172a",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(getApiUrl(`/bookings/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });


      const resData = await response.json();


      if (response.ok && resData.success) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
        setSelectedIds((prev) =>
          prev.filter((selectedId) => selectedId !== id),
        );
        router.refresh();

        Swal.fire({
          title: "Deleted!",
          text: "Reservation has been deleted.",
          icon: "success",
          confirmButtonColor: "#ea580c",
        });
      } else {
        Swal.fire("Error!", "Failed to delete reservation.", "error");
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      Swal.fire("Error!", "Error deleting reservation.", "error");
    }
  };

  const handleBulkDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Selected?",
      text: `Are you sure you want to delete ${selectedIds.length} reservations?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ea580c",
      cancelButtonColor: "#0f172a",
      confirmButtonText: "Yes, delete all!",
      background: "#ffffff",
      color: "#0f172a",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("authToken");
      const deletePromises = selectedIds.map((id) =>
        fetch(getApiUrl(`/bookings/${id}`), {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      const responses = await Promise.all(deletePromises);
      const allSuccessful = responses.every((res) => res.ok);

      if (allSuccessful) {
        setBookings((prev) => prev.filter((b) => !selectedIds.includes(b._id)));
        setSelectedIds([]);

        Swal.fire({
          title: "Deleted!",
          text: "Selected reservations have been deleted.",
          icon: "success",
          confirmButtonColor: "#ea580c",
        });
      } else {
        Swal.fire("Error!", "Some reservations could not be deleted.", "error");
      }
    } catch (error) {
      console.error("Error deleting reservations:", error);
      Swal.fire("Error!", "Error deleting reservations.", "error");
    }
  };

  const handleCreate = () => {
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleWhatsAppShare = (r: any) => {
    const phone = r.clientContact ? r.clientContact.replace(/\D/g, "") : "";

    // Priority: Cloudinary Link (with versioning) > Viewer Fallback
    const shareLink = r.pdfData || `${window.location.origin}/view/${r._id}`;

    const checkIn = new Date(r.checkIn).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const checkOut = new Date(r.checkOut).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const propName = settings?.title || "Avan Homes";
    const text = `Hello *${r.clientName}*,\n\nGreetings from *${propName}*!\n\nWe are pleased to share the details of your reservation. Please find the summary below:\n\n*Reference ID:* ${r.bookingId}\n*Stay:* ${checkIn} to ${checkOut}\n*Total Amount:* ₹${(r.payment?.grandTotal || 0).toLocaleString("en-IN")}\n\n*View/Download Detailed PDF:* \n${shareLink}\n\nWe look forward to hosting you. If you have any questions, please feel free to reach out.\n\nWarm Regards,\n*${propName} Team*`;
    
    // Automated redirection to the client's specific chat
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleMailShare = async (r: any) => {
    try {
      const token = localStorage.getItem("authToken");
      
      Swal.fire({
        title: 'Sending Email...',
        text: 'Please wait while we deliver the reservation confirmation.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        background: '#0f172a',
        color: '#fff'
      });

      const res = await fetch(getApiUrl(`bookings/${r._id}/send-email`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });

      if (res.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Email has been sent successfully via your SMTP.',
          icon: 'success',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#ea580c'
        });
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to send email');
      }
    } catch (err: any) {
      console.error("Mail Error:", err);
      Swal.fire({
        title: 'Error',
        text: err.message || 'Could not send email. Check your SMTP settings.',
        icon: 'error',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#ea580c'
      });
    }
  };

  const handleEdit = (booking: any) => {
    setIsEdit(true);
    setEditingBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-gray-500 text-sm mt-1">
            Manage bookings and confirmed stays.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search name or ID..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-forest-900 outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20 transition-all shadow-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Reservation History Table Card */}
      <div className="bg-white border border-gray-100 rounded-xl p-3 md:p-8 shadow-sm">
        <div className="flex justify-between items-center gap-4 mb-8">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 shrink-0">
            <Calendar className="w-5 h-5 text-gray-900" /> History
          </h2>
          <div className="flex items-center gap-2 sm:gap-3 w-auto">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-600 px-4 py-2.5 rounded-xl font-bold transition-all text-sm w-full sm:w-auto border border-orange-100 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
            )}
            <button
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white p-2.5 sm:px-5 sm:py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-gray-900/20 w-10 h-10 sm:w-auto sm:h-auto cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 sm:w-4 sm:h-4 text-white" />
              <span className="hidden sm:inline">Create New</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm border-b border-gray-100">
                <th className="pb-4 font-medium px-4 w-10 hidden sm:table-cell">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={
                      selectedIds.length === currentEntries.length &&
                      currentEntries.length > 0
                    }
                    className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600/20 cursor-pointer accent-orange-600"
                  />
                </th>

                <th className="pb-4 font-semibold text-left px-2">Guest</th>
                <th className="pb-4 font-semibold text-center px-1">
                  <span className="lg:hidden">Stay</span>
                  <span className="hidden lg:inline">Check In/Out</span>
                </th>
                <th className="pb-4 font-semibold text-center px-2 hidden lg:table-cell">Guests</th>
                <th className="pb-4 font-semibold text-center px-2 hidden lg:table-cell">Amount</th>
                <th className="pb-4 font-semibold text-center px-1">Status</th>
                <th className="pb-4 font-semibold text-right pr-2 w-10 lg:w-48">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Loading History...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : currentEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                      No Reservations Found
                    </p>
                  </td>
                </tr>
              ) : (
                currentEntries.map((r, idx) => (
                  <tr
                    key={r._id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-4 px-4 hidden sm:table-cell">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(r._id)}
                        onChange={() => toggleSelect(r._id)}
                        className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600/20 cursor-pointer accent-orange-600"
                      />
                    </td>

                    <td className="py-4 px-1 sm:px-4 text-left">
                      <div className="font-semibold text-forest-900">
                        {r.clientName}
                      </div>
                      <div className="text-[10px] text-gray-500 font-medium">
                        {r.bookingId}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-center px-1 sm:px-4">
                      {/* Mobile & Tablet View */}
                      <div className="lg:hidden font-bold text-slate-900 text-[8px] flex flex-col leading-tight">
                        <span>{new Date(r.checkIn).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}-</span>
                        <span>{new Date(r.checkOut).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}</span>
                      </div>
                      
                      {/* Desktop View */}
                      <div className="hidden lg:block">
                        <div className="font-medium text-forest-900">
                          {new Date(r.checkIn).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          to{" "}
                          {new Date(r.checkOut).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-gray-500 text-sm font-medium text-center hidden lg:table-cell">
                      {typeof r.guests === "object"
                        ? `${r.guests.adults || 0}A, ${r.guests.kids || 0}K`
                        : `${r.guests || 0} Guests`}
                    </td>
                    <td className="py-4 font-bold text-forest-900 text-center px-4 hidden lg:table-cell">
                      ₹
                      {(r.payment?.grandTotal || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-4 text-center px-1 sm:px-4">
                      <select
                        value={r.status}
                        onChange={(e) =>
                          handleStatusChange(r._id, e.target.value)
                        }
                        disabled={r.status === "Cancelled" || r.status === "Checked-Out"}
                        className={`px-1 md:px-3 py-1 md:py-1.5 rounded-full text-[8px] md:text-[11px] font-bold uppercase tracking-wider outline-none transition-all border appearance-none text-center ${r.status === "Cancelled" || r.status === "Checked-Out" ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
                          ${
                            r.status === "Draft"
                              ? "bg-gray-50 text-gray-600 border-gray-200"
                              : r.status === "Confirmed"
                                ? "bg-green-50 text-green-600 border-green-200"
                                : r.status === "Checked-Out"
                                  ? "bg-blue-50 text-blue-600 border-blue-200"
                                  : "bg-red-50 text-red-600 border-red-200"
                          }`}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Checked-Out">Checked Out</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 text-right pr-2 sm:pr-4">
                      <div className="flex items-center justify-end relative">
                        {/* Desktop Actions */}
                        <div className="hidden sm:flex items-center gap-2">
                          <button
                            onClick={() => r.status !== "Confirmed" && handleEdit(r)}
                            disabled={r.status === "Confirmed"}
                            className={`p-2 rounded-lg transition-all ${r.status === "Confirmed" ? "bg-gray-50 text-gray-300 cursor-not-allowed" : "bg-gray-50 hover:bg-gray-100 text-amber-600 cursor-pointer"}`}
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => { 
                              await fetchSettings();
                              setViewingBooking(r); 
                              setIsPreviewModalOpen(true); 
                            }}
                            className="p-2 bg-gray-50 hover:bg-gray-100 text-blue-600 rounded-lg cursor-pointer transition-all"
                            title="Preview PDF"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleWhatsAppShare(r)}
                            className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg cursor-pointer transition-all"
                            title="WhatsApp"
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                          </button>
                          <button
                            onClick={() => handleMailShare(r)}
                            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg cursor-pointer transition-all"
                            title="Share via Email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Mobile Dropdown */}
                        <div className="sm:hidden">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownId(activeDropdownId === r._id ? null : r._id);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                          </button>                        {/* Mobile Action Modal */}
                        {activeDropdownId === r._id && (
                          <div 
                            className="sm:hidden fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                            onClick={(e) => { e.stopPropagation(); setActiveDropdownId(null); }}
                          >
                            <div 
                              className="w-full bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                  <h3 className="font-bold text-gray-900">Manage Reservation</h3>
                                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">{r.bookingId} • {r.clientName}</p>
                                </div>
                                <button 
                                  onClick={() => setActiveDropdownId(null)}
                                  className="p-2 bg-white border border-gray-100 rounded-xl shadow-sm"
                                >
                                  <X className="w-5 h-5 text-gray-400" />
                                </button>
                              </div>
                              <div className="p-3 space-y-1">
                                <button
                                  onClick={() => { setActiveDropdownId(null); r.status !== "Confirmed" && handleEdit(r); }}
                                  disabled={r.status === "Confirmed"}
                                  className="w-full px-5 py-4 text-left text-sm font-semibold flex items-center gap-4 hover:bg-gray-50 rounded-2xl text-amber-600 disabled:opacity-50 transition-all active:scale-[0.98]"
                                >
                                  <div className="p-2 bg-amber-50 rounded-lg"><Edit3 className="w-5 h-5" /></div>
                                  Edit Reservation
                                </button>
                                <button
                                  onClick={() => { setActiveDropdownId(null); setViewingBooking(r); setIsPreviewModalOpen(true); }}
                                  className="w-full px-5 py-4 text-left text-sm font-semibold flex items-center gap-4 hover:bg-gray-50 rounded-2xl text-blue-600 transition-all active:scale-[0.98]"
                                >
                                  <div className="p-2 bg-blue-50 rounded-lg"><FileText className="w-5 h-5" /></div>
                                  View / Download PDF
                                </button>
                                <button
                                  onClick={() => { setActiveDropdownId(null); handleWhatsAppShare(r); }}
                                  className="w-full px-5 py-4 text-left text-sm font-semibold flex items-center gap-4 hover:bg-gray-50 rounded-2xl text-green-600 transition-all active:scale-[0.98]"
                                >
                                  <div className="p-2 bg-green-50 rounded-lg">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                  </div>
                                  WhatsApp Share
                                </button>
                                <button
                                  onClick={() => { setActiveDropdownId(null); handleMailShare(r); }}
                                  className="w-full px-5 py-4 text-left text-sm font-semibold flex items-center gap-4 hover:bg-gray-50 rounded-2xl text-slate-600 transition-all active:scale-[0.98]"
                                >
                                  <div className="p-2 bg-slate-50 rounded-lg"><Mail className="w-5 h-5" /></div>
                                  Share via Email
                                </button>
                                <div className="border-t border-gray-100 my-2 mx-4"></div>
                                <button
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    if (confirm("Are you sure you want to delete this reservation?")) {
                                      handleDelete(r._id);
                                    }
                                  }}
                                  className="w-full px-5 py-4 text-left text-sm font-semibold flex items-center gap-4 hover:bg-red-50 rounded-2xl text-red-600 transition-all active:scale-[0.98]"
                                >
                                  <div className="p-2 bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></div>
                                  Delete Reservation
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-100">
          <div className="text-xs text-gray-500 font-medium">
            Showing{" "}
            <span className="text-forest-900 font-bold">
              {indexOfFirstEntry + 1}
            </span>{" "}
            to{" "}
            <span className="text-forest-900 font-bold">
              {Math.min(indexOfLastEntry, filteredData.length)}
            </span>{" "}
            of{" "}
            <span className="text-forest-900 font-bold">
              {filteredData.length}
            </span>{" "}
            records
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  currentPage === i + 1
                    ? "bg-gray-900 border-gray-900 text-white shadow-lg shadow-gray-900/20"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBooking(null);
          fetchBookings(); // Refresh list after closing
        }}
        isEdit={isEdit}
        initialData={editingBooking}
        type="reservation"
      />

      <PDFPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        bookingData={viewingBooking}
        settings={settings}
      />
    </div>
  );
}
