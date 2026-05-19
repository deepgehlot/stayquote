"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  User,
  Calendar as CalendarIcon,
  DoorOpen,
  X,
  Sparkles,
  Bed,
  Settings,
  Clock,
} from "lucide-react";
import { getApiUrl } from "@/lib/api";
import { useRouter } from "next/navigation";
import BookingModal from "./modals/BookingModal";

interface BookingCalendarProps {
  initialRooms?: any[];
  initialBookings?: any[];
}

export default function BookingCalendar({ initialRooms = [], initialBookings = [] }: BookingCalendarProps) {
  const router = useRouter();
  const [viewDate, setViewDate] = useState(new Date());
  const [totalRooms, setTotalRooms] = useState(() => {
    return initialRooms.reduce((sum: number, r: any) => {
      const n = typeof r?.totalRooms === "number" ? r.totalRooms : parseInt(r?.totalRooms || "0", 10) || 0;
      return sum + n;
    }, 0);
  });
  const [roomList, setRoomList] = useState<any[]>(() => {
    return initialRooms.map((r: any) => ({
      _id: r._id,
      name: r.roomName || r.roomType,
      totalRooms: typeof r.totalRooms === "number" ? r.totalRooms : parseInt(r.totalRooms || "0", 10) || 0,
    }));
  });
  const [bookings, setBookings] = useState<any[]>(initialBookings);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [lockedDay, setLockedDay] = useState<number | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"reservation" | "quotation">(
    "reservation",
  );
  const [currentTime, setCurrentTime] = useState(new Date());

  // Sync with props when they change (prefetch updates)
  useEffect(() => {
    setBookings(initialBookings);
    setRoomList(initialRooms.map((r: any) => ({
      _id: r._id,
      name: r.roomName || r.roomType,
      totalRooms: typeof r.totalRooms === "number" ? r.totalRooms : parseInt(r.totalRooms || "0", 10) || 0,
    })));
    setTotalRooms(initialRooms.reduce((sum: number, r: any) => {
      const n = typeof r?.totalRooms === "number" ? r.totalRooms : parseInt(r?.totalRooms || "0", 10) || 0;
      return sum + n;
    }, 0));
  }, [initialRooms, initialBookings]);

  // Update clock every 30 seconds to refresh occupancy status (11 AM transitions)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (i: number) => {
    if (lockedDay !== null) return;
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    setHoveredDay(i);
  };

  const handleMouseLeave = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredDay(null);
    }, 800);
  };

  const handleDayClick = (i: number) => {
    // Right side selection is independent of tooltip locking
    setSelectedDayIndex(selectedDayIndex === i ? null : i);
    
    if (lockedDay === i) {
      setLockedDay(null);
    } else {
      setLockedDay(i);
      setHoveredDay(i);
    }
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".calendar-day-cell")) {
        setLockedDay(null);
        setHoveredDay(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    setSelectedDayIndex(null);
    setLockedDay(null);
    setHoveredDay(null);
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    setSelectedDayIndex(null);
    setLockedDay(null);
    setHoveredDay(null);
  };

  const handleGoToToday = () => {
    setViewDate(new Date());
    setSelectedDayIndex(null);
    setLockedDay(null);
    setHoveredDay(null);
  };

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) =>
    aStart < bEnd && bStart < aEnd; // [start, end)

  const fetchCalendarData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const [roomsRes, bookingsRes] = await Promise.all([
        fetch(getApiUrl("rooms"), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetch(getApiUrl("bookings"), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
      ]);

      const roomsJson = roomsRes.ok ? await roomsRes.json().catch(() => ({})) : {};
      const bookingsJson = bookingsRes.ok ? await bookingsRes.json().catch(() => ({})) : {};

      const rooms = roomsJson.rooms || (Array.isArray(roomsJson) ? roomsJson : []);
      const allBookings = bookingsJson.bookings || (Array.isArray(bookingsJson) ? bookingsJson : []);

      const total = rooms.reduce((sum: number, r: any) => {
        const n = typeof r?.totalRooms === "number" ? r.totalRooms : parseInt(r?.totalRooms || "0", 10) || 0;
        return sum + n;
      }, 0);

      setTotalRooms(total);
      setRoomList(
        rooms.map((r: any) => ({
          _id: r._id,
          name: r.roomName || r.roomType,
          totalRooms: typeof r.totalRooms === "number" ? r.totalRooms : parseInt(r.totalRooms || "0", 10) || 0,
        })),
      );
      setBookings(allBookings);
    } catch (e) {
      console.error("Failed to fetch calendar data:", e);
    }
  };

  useEffect(() => {
    // Skip initial fetch if we already have data from the server
    if (initialRooms.length > 0 || initialBookings.length > 0) {
      return;
    }
    fetchCalendarData();
  }, [initialRooms, initialBookings]);

  const days = useMemo(() => {
    const grid: Array<{ day: number | null; status: string; bookings: any[] }> =
      [];

    // Padding for start of month
    for (let i = 0; i < firstDay; i++) {
      grid.push({ day: null, status: "empty", bookings: [] });
    }

    // Helper to normalize dates to local midnight for accurate comparison
    const normalize = (d: any) => {
      const date = new Date(d);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayStart = new Date(year, month, i);
      const dayEnd = new Date(year, month, i + 1);

      // Collect all bookings overlapping this day
      const dayBookings = bookings.filter((b: any) => {
        const bStart = normalize(b.checkIn);
        const bEnd = normalize(b.checkOut);
        if (isNaN(bStart.getTime()) || isNaN(bEnd.getTime())) return false;
        return overlaps(dayStart, dayEnd, bStart, bEnd);
      });

      const activeReservations = dayBookings.filter((b: any) => {
        if (b?.type !== "reservation") return false;
        const status = b?.status?.toLowerCase();
        return [
          "confirmed",
          "checked-in",
          "arrived",
          "paid",
          "partially paid",
          "completed",
        ].includes(status);
      });

      const bookedRoomsCount = activeReservations.reduce((sum: number, b: any) => {
        const bookedRooms = (b.rooms || []).reduce((s: number, r: any) => {
          const qty = Number(r.qty || r.quantity || r.roomNumber || 1) || 0;
          return s + qty;
        }, 0);
        return sum + (bookedRooms || 1);
      }, 0);

      const hasQuotation = dayBookings.some(
        (b: any) =>
          b?.type === "quotation" &&
          !["Declined", "Confirmed", "confirmed", "declined"].includes(
            b?.status?.toLowerCase(),
          ),
      );

      const hasUnconfirmedRes = dayBookings.some((b: any) => {
        if (b?.type !== "reservation") return false;
        const status = b?.status?.toLowerCase();
        return !["confirmed", "checked-in", "arrived", "paid", "completed", "checked-out"].includes(status);
      });

      let status = "empty";
      if (bookedRoomsCount >= totalRooms && totalRooms > 0) {
        status = "full";
      } else if (bookedRoomsCount > 0) {
        status = "partial";
      } else if (hasQuotation || hasUnconfirmedRes) {
        status = "quotation";
      }

      grid.push({ day: i, status, bookings: dayBookings });
    }

    // Padding for end of month (to maintain 7x5 or 7x6 grid)
    while (grid.length < 35 || (grid.length > 35 && grid.length < 42)) {
      grid.push({ day: null, status: "empty", bookings: [] });
    }
    return grid;
  }, [bookings, daysInMonth, firstDay, month, totalRooms, year]);

  // Calculate Selected Day's Detailed Summary
  const selectedDayDetails = useMemo(() => {
    const selectedDayValue = selectedDayIndex !== null ? days[selectedDayIndex]?.day : null;

    const referenceDate = selectedDayValue !== null 
      ? new Date(year, month, selectedDayValue, 12, 0, 0) // Noon of selected day to avoid boundary issues
      : currentTime;

    const todayBookings = bookings.filter((b: any) => {
      // Clean date string to avoid double time components or timezone issues
      const cleanDate = (dateStr: string) => {
        if (!dateStr) return "";
        return dateStr.split("T")[0];
      };

      const checkInStr = `${cleanDate(b.checkIn)}T11:00:00`;
      const checkOutStr = `${cleanDate(b.checkOut)}T11:00:00`;

      const bStart = new Date(checkInStr);
      const bEnd = new Date(checkOutStr);

      // Guest is "Occupied" if the reference date falls within their stay
      const status = b.status?.toLowerCase();
      const isActiveStatus = [
        "confirmed",
        "checked-in",
        "arrived",
        "paid",
        "partially paid",
      ].includes(status);

      return (
        bStart <= referenceDate &&
        referenceDate < bEnd &&
        b.type === "reservation" &&
        isActiveStatus &&
        status !== "checked-out" // Exclude if already marked as checked-out
      );
    });

    const checkedOutBookings = bookings.filter((b: any) => {
      if (b.type !== "reservation") return false;
      const status = b.status?.toLowerCase();
      
      // If manually marked as checked-out
      if (status === "checked-out") {
        // Only show on their checkout day
        const bEnd = new Date(b.checkOut).toDateString();
        const refDate = referenceDate.toDateString();
        return bEnd === refDate;
      }

      // If it's their checkout day and it's past 11 AM (or we just want to show them as check-outs for the day)
      const bEndStr = b.checkOut.split("T")[0];
      const refStr = referenceDate.toISOString().split("T")[0];
      return bEndStr === refStr && status === "confirmed";
    });

    const bookedRoomsList = todayBookings.flatMap((b) =>
      (b.rooms || []).map((r: any) => ({
        roomName: r.roomName || r.roomType,
        clientName: b.clientName,
        qty: Number(r.qty || r.quantity || 1) || 1,
        booking: b,
      })),
    );

    const checkedOutRoomsList = checkedOutBookings.flatMap((b) =>
      (b.rooms || []).map((r: any) => ({
        roomName: r.roomName || r.roomType,
        clientName: b.clientName,
        qty: Number(r.qty || r.quantity || 1) || 1,
        booking: b,
      })),
    );

    const availableRoomsList = roomList
      .map((r) => {
        const bookedCount = bookedRoomsList
          .filter((br) => br.roomName === r.name)
          .reduce((sum, br) => sum + br.qty, 0);
        const available = Math.max(0, r.totalRooms - bookedCount);
        return { name: r.name, available };
      })
      .filter((r) => r.available > 0);

    return {
      referenceDate,
      booked: bookedRoomsList,
      checkedOut: checkedOutRoomsList,
      available: availableRoomsList,
    };
  }, [bookings, totalRooms, roomList, currentTime, selectedDayIndex, year, month, days]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "full":
        return "bg-red-500 text-white shadow-sm";
      case "partial":
        return "bg-orange-500 text-white shadow-sm";
      case "quotation":
        return "bg-yellow-400 text-slate-900 shadow-sm";
      default:
        return "bg-green-500 text-white shadow-sm";
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm transition-colors duration-300 max-w-[1600px] mx-auto w-full overflow-hidden">
      <div className="flex flex-col md:flex-row gap-0 items-start">
        {/* Calendar Area (Flexible Row View on MD+) */}
        <div className="w-full md:w-[45%] lg:w-[40%] xl:w-[35%] p-4 sm:p-5 md:p-6 lg:p-8 border-b md:border-b-0 md:border-r border-gray-100 shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-lg lg:text-2xl font-black text-slate-900 tracking-tight shrink-0">
              Availability
            </h2>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                {monthNames[month]} {year}
              </span>
              <div className="flex gap-1 bg-gray-50 p-0.5 rounded-lg border border-gray-100 items-center">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-md hover:bg-white hover:shadow-sm cursor-pointer transition-all text-gray-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleGoToToday}
                  className="px-2 py-1 text-[9px] font-bold text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all cursor-pointer"
                >
                  Today
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-md hover:bg-white hover:shadow-sm cursor-pointer transition-all text-gray-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1.5 mb-2 w-full">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider py-1.5"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1.5 w-full relative">
            {(days as any[]).map((d, i) => (
              <div
                key={i}
                onClick={() => d.day && handleDayClick(i)}
                onMouseEnter={() => d.day && handleMouseEnter(i)}
                onMouseLeave={handleMouseLeave}
                className={`calendar-day-cell aspect-square flex items-center justify-center rounded-lg sm:rounded-[10px] text-xs sm:text-sm md:text-base font-medium relative ${
                  d.day ? getStatusColor(d.status) : "bg-transparent"
                } ${d.day ? "hover:scale-105 transition-transform cursor-pointer" : ""} ${
                  hoveredDay === i || lockedDay === i ? "z-50" : "z-0"
                }`}
              >
                {d.day}

                {/* Hover/Locked Tooltip (Right Positioned) */}
                {(hoveredDay === i || lockedDay === i) &&
                  d.day &&
                  d.bookings &&
                  d.bookings.length > 0 && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      onMouseEnter={() => handleMouseEnter(i)}
                      onMouseLeave={handleMouseLeave}
                      className="fixed inset-0 lg:absolute lg:inset-auto lg:left-full lg:top-1/2 lg:-translate-y-1/2 lg:pl-3 w-full lg:w-72 h-full lg:h-auto z-[100] flex items-center justify-center lg:block"
                    >
                      {/* Mobile Backdrop */}
                      <div
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => {
                          setLockedDay(null);
                          setHoveredDay(null);
                        }}
                      />

                      <div className="relative bg-gray-900 border border-white/10 rounded-xl p-4 shadow-2xl w-[90%] max-w-[320px] lg:w-full lg:max-w-none animate-in fade-in zoom-in-95 lg:slide-in-from-left-2 duration-200">
                        {/* Close Button - More prominent on mobile */}
                        {(lockedDay === i || hoveredDay === i) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLockedDay(null);
                              setHoveredDay(null);
                            }}
                            className="absolute top-3 right-3 p-2 bg-white/5 lg:bg-transparent hover:bg-white/10 rounded-full transition-colors z-[110]"
                          >
                            <X className="w-4 h-4 text-white/70 hover:text-white" />
                          </button>
                        )}

                        <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2 pr-8">
                          <CalendarIcon className="w-3.5 h-3.5 text-orange-500" />
                          <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                            Bookings for {d.day} {monthNames[month]}
                          </span>
                        </div>

                        <div className="space-y-3 max-h-64 lg:max-h-48 overflow-y-auto scrollbar-hide">
                          {d.bookings
                            .filter((b: any) => {
                              if (d.status === "full" || d.status === "partial")
                                return b.type === "reservation";
                              if (d.status === "quotation")
                                return b.type === "quotation";
                              return true;
                            })
                            .map((b: any, idx: number) => (
                              <div
                                key={b._id || idx}
                                className="bg-white/5 rounded-xl p-3 border border-white/5 group/item hover:border-orange-500/30 cursor-pointer transition-all"
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-[10px] font-black text-orange-500">
                                    {b.bookingId}
                                  </span>
                                  <span
                                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${b.type === "reservation" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-500"}`}
                                  >
                                    {b.type}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                  <User className="w-3 h-3 text-gray-500" />
                                  <span className="text-[11px] text-white font-medium truncate">
                                    {b.clientName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <DoorOpen className="w-3 h-3 text-orange-500/70" />
                                  <span className="text-[10px] text-gray-300 truncate">
                                    {b.rooms?.[0]?.roomName || "Rooms"} •{" "}
                                    {(b.rooms || []).reduce(
                                      (s: number, r: any) =>
                                        s +
                                        (Number(r.qty || r.quantity || 1) || 0),
                                      0,
                                    )}{" "}
                                    Rooms
                                  </span>
                                </div>
                                <button
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     router.push(`/dashboard/view/${b._id}`);
                                   }}
                                   className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-lg shadow-orange-500/20"
                                 >
                                   <Eye className="w-3 h-3" /> View Full Details
                                 </button>
                              </div>
                            ))}
                        </div>

                        {/* Tooltip Arrow (Only on Desktop) */}
                        <div className="hidden lg:block absolute right-full top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-900 border-l border-b border-white/10 rotate-45 -mr-1.5"></div>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>

          {/* Status Legend - Moved under grid */}
          <div className="mt-4 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-100">
            <h3 className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 lg:mb-4">
              Status Legend
            </h3>
            <div className="grid grid-cols-2 gap-y-3 lg:gap-y-4 gap-x-3 lg:gap-x-8">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-red-500 flex-shrink-0 shadow-sm"></div>
                <div>
                  <p className="font-bold text-slate-900 text-[10px] sm:text-[11px] leading-tight">Full</p>
                  <p className="text-[8px] sm:text-[9px] text-gray-500 font-medium">Sold Out</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-orange-500 flex-shrink-0 shadow-sm"></div>
                <div>
                  <p className="font-bold text-slate-900 text-[10px] sm:text-[11px] leading-tight">Partial</p>
                  <p className="text-[8px] sm:text-[9px] text-gray-500 font-medium">Booked</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-yellow-400 flex-shrink-0 shadow-sm"></div>
                <div>
                  <p className="font-bold text-slate-900 text-[10px] sm:text-[11px] leading-tight">Quotation</p>
                  <p className="text-[8px] sm:text-[9px] text-gray-500 font-medium">Drafts</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-green-500 flex-shrink-0 shadow-sm"></div>
                <div>
                  <p className="font-bold text-slate-900 text-[10px] sm:text-[11px] leading-tight">Available</p>
                  <p className="text-[8px] sm:text-[9px] text-gray-500 font-medium">Ready</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-slate-400">
              <Sparkles className="w-3 h-3 text-orange-500" />
              <p className="text-[10px] font-bold tracking-tight">
                Tip: Click a colored date to view details.
              </p>
            </div>
          </div>
        </div>

        {/* Today's Details Area */}
        <div className="flex-1 border-t md:border-t-0 border-gray-100 bg-gray-50/20 min-w-0 w-full">
          {/* Today's Status - Human-Centric Premium Overview */}
          <div className="w-full py-4 lg:py-6 px-4 sm:px-6 md:px-5 lg:px-8 xl:px-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between items-start sm:items-center gap-2 lg:gap-4 mb-4 lg:mb-8 pt-1 lg:pt-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-600/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">
                    {selectedDayIndex !== null ? "Selected Date" : "At a Glance"}
                  </h3>
                  <p className="text-lg lg:text-xl font-black text-slate-900 tracking-tight">
                    {selectedDayIndex !== null ? "Day Overview" : "Today's Presence"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center sm:text-right">
                  {selectedDayDetails.referenceDate.toLocaleDateString("en-IN", { weekday: "long" })}
                </span>
                <span className="text-xs font-bold text-orange-600 text-center sm:text-right">
                  {selectedDayDetails.referenceDate.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: selectedDayIndex !== null ? "numeric" : undefined,
                  })}
                </span>
              </div>
            </div>

            <div className="space-y-4 lg:space-y-6">
              {/* Occupied Now - Elegant Guest List */}
              <div className="animate-in slide-in-from-bottom-4 duration-500 delay-150">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <span className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20" />
                      <span className="relative block w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />
                    </div>
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                      {selectedDayIndex !== null ? "Occupied" : "Occupied Now"}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-full border border-red-100">
                    <span className="text-[10px] font-black text-red-600">
                      {selectedDayDetails.booked.length}
                    </span>
                    <span className="text-[8px] font-black text-red-400 uppercase tracking-tighter">
                      Active Stays
                    </span>
                  </div>
                </div>

                <div className="space-y-3 lg:space-y-4 max-h-[280px] lg:max-h-[350px] overflow-y-auto pr-1 scrollbar-hide">
                  {selectedDayDetails.booked.length > 0 ? (
                    selectedDayDetails.booked.map((br, idx) => (
                      <div
                        key={idx}
                        className="group relative bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 cursor-pointer transition-all duration-500"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-orange-600 group-hover:border-orange-600 cursor-pointer transition-all duration-500 overflow-hidden shadow-inner">
                              <Bed className="w-5 h-5 text-orange-600 group-hover:text-white transition-colors duration-500" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest">
                                  {br.roomName}
                                </p>
                              </div>
                              <p className="text-xs font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                                {br.clientName}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Clock className="w-3 h-3 text-gray-400 group-hover:text-orange-400 transition-colors" />
                                <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider group-hover:text-orange-500 transition-colors">
                                  Out:{" "}
                                  {new Date(
                                    br.booking.checkOut,
                                  ).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                  })}{" "}
                                  • 11:00 AM
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                             onClick={(e) => {
                               e.stopPropagation();
                               router.push(`/dashboard/view/${br.booking._id}`);
                             }}
                             className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-900 text-gray-400 hover:text-white rounded-xl cursor-pointer transition-all duration-300"
                           >
                             <Eye className="w-4 h-4" />
                           </button>
                        </div>
                        {/* Interactive Status Bar */}
                        <div className="absolute left-6 right-6 -bottom-[1px] h-[2px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-500" />
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50/40 border-2 border-dashed border-gray-100 rounded-[24px] py-10 px-6 text-center group hover:bg-white hover:border-orange-100 cursor-pointer transition-all duration-500">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-50 group-hover:scale-110 transition-transform duration-500">
                        <Bed className="w-5 h-5 text-gray-300" />
                      </div>
                      <p className="text-sm font-black text-slate-900 mb-1">
                        House is Peaceful
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium max-w-[180px] mx-auto leading-relaxed">
                        No guests currently checked in. Perfect time for
                        maintenance.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Checked Out - Recently Departed */}
              {selectedDayDetails.checkedOut.length > 0 && (
                <div className="animate-in slide-in-from-bottom-4 duration-500 delay-200">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white" />
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                        Checked Out
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                      <span className="text-[10px] font-black text-blue-600">
                        {selectedDayDetails.checkedOut.length}
                      </span>
                      <span className="text-[8px] font-black text-blue-400 uppercase tracking-tighter">
                        Departed
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 lg:space-y-4 max-h-[200px] overflow-y-auto pr-1 scrollbar-hide">
                    {selectedDayDetails.checkedOut.map((br, idx) => (
                      <div
                        key={idx}
                        className="group relative bg-white/60 border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md cursor-pointer transition-all duration-500 grayscale hover:grayscale-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-500 overflow-hidden shadow-inner">
                              <DoorOpen className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-500" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                                  {br.roomName}
                                </p>
                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[7px] font-black rounded-md uppercase">
                                  Done
                                </span>
                              </div>
                              <p className="text-xs font-black text-slate-400 line-through decoration-slate-300">
                                {br.clientName}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[9px] text-blue-400 font-black uppercase tracking-wider">
                                  Checked Out at 11:00 AM
                                </span>
                              </div>
                            </div>
                          </div>

                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               router.push(`/dashboard/view/${br.booking._id}`);
                             }}
                             className="w-10 h-10 flex items-center justify-center bg-blue-50 hover:bg-blue-900 text-blue-400 hover:text-white rounded-xl cursor-pointer transition-all duration-300"
                           >
                             <Eye className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inventory Status - Boutique Breakdown */}
              <div className="animate-in slide-in-from-bottom-4 duration-500 delay-300">
                <div className="flex items-center justify-between mb-5 px-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                      Ready Inventory
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                    <span className="text-[10px] font-black text-green-600">
                      {selectedDayDetails.available.reduce(
                        (s, r) => s + r.available,
                        0,
                      )}
                    </span>
                    <span className="text-[8px] font-black text-green-400 uppercase tracking-tighter">
                      Rooms Ready
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 lg:gap-3 max-h-[180px] lg:max-h-[250px] overflow-y-auto pr-1 scrollbar-hide">
                  {selectedDayDetails.available.length > 0 ? (
                    selectedDayDetails.available.map((ar, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white rounded-[18px] p-3 border border-gray-100 shadow-sm group hover:border-green-300 hover:shadow-lg hover:shadow-green-500/5 cursor-pointer transition-all duration-500"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-600 font-black text-xs">
                            {idx + 1}
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-900 tracking-tight block group-hover:text-green-700 transition-colors">
                              {ar.name}
                            </span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                              Boutique Suite
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-green-50/50 px-4 py-2 rounded-xl border border-green-100/50 group-hover:bg-green-600 group-hover:border-green-600 cursor-pointer transition-all duration-500">
                          <span className="text-xs font-black text-green-700 group-hover:text-white">
                            {ar.available}
                          </span>
                          <span className="text-[8px] font-black text-green-600/50 group-hover:text-white/70 uppercase tracking-tighter">
                            Left
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-900 rounded-[28px] py-8 px-8 text-center shadow-2xl shadow-gray-900/20 border border-white/5 overflow-hidden relative">
                      <div className="relative z-10">
                        <Sparkles className="w-6 h-6 text-orange-500 mx-auto mb-3 animate-pulse" />
                        <p className="text-sm font-black text-white uppercase tracking-widest">
                          Full House Tonight
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium mt-1 leading-relaxed">
                          Every corner of your property is being enjoyed by
                          guests.
                        </p>
                      </div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-[80px] -mr-16 -mt-16" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBooking(null);
            fetchCalendarData();
          }}
          type={modalType}
          isEdit={true}
          initialData={selectedBooking}
        />
      )}
    </div>
  );
}
