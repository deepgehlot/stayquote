"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Building2, CalendarCheck, FileText, DoorOpen } from "lucide-react";
import { getApiUrl } from "@/lib/api";

interface StatCardProps {
  number: string | number;
  label: string;
  Icon: React.ElementType;
  reversed?: boolean;
}

const StatCard = ({ number, label, Icon, reversed }: StatCardProps) => (
  <div
    className={`relative flex items-center w-full max-w-[230px] sm:max-w-[270px] mx-auto group cursor-pointer ${reversed ? "flex-row-reverse md:flex-row" : ""}`}
  >
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg z-10 relative border-[4px] border-gray-50 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
      {number}
    </div>
    <div
      className={`bg-white border border-gray-200 shadow-sm py-4 z-0 flex-1 max-w-[180px] sm:max-w-[220px] transition-colors duration-300 flex items-center gap-2.5
      ${
        reversed
          ? "pr-6 pl-3 sm:pr-10 sm:pl-4 rounded-l-2xl -mr-6 sm:-mr-8 md:mr-0 md:pl-10 md:pr-4 md:rounded-r-2xl md:-ml-8 md:rounded-l-none"
          : "pl-6 pr-3 sm:pl-10 sm:pr-4 rounded-r-2xl -ml-6 sm:-ml-8"
      }`}
    >
      <Icon
        className={`w-3.5 h-3.5 text-orange-600 flex-shrink-0 ${reversed ? "order-last md:order-first" : ""}`}
      />
      <span
        className={`text-gray-600 text-[10px] font-bold uppercase tracking-wider truncate flex-1 ${reversed ? "text-right md:text-left" : ""}`}
      >
        {label}
      </span>
    </div>
  </div>
);

interface StatCardsProps {
  initialRooms?: any[];
  initialBookings?: any[];
}

export default function StatCards({ initialRooms = [], initialBookings = [] }: StatCardsProps) {
  const calculateStats = (rooms: any[], bookings: any[]) => {
    const totalRooms = rooms.reduce((sum: number, r: any) => {
      const n = typeof r?.totalRooms === "number" ? r.totalRooms : parseInt(r?.totalRooms || "0", 10) || 0;
      return sum + n;
    }, 0);

    const confirmedReservations = bookings.filter(
      (b: any) =>
        b?.type === "reservation" &&
        (b?.status?.toLowerCase().startsWith("conf") || b?.status === "Confirmed"),
    );

    const totalBookedCount = confirmedReservations.reduce((sum: number, b: any) => {
      const bookedRooms = (b.rooms || []).reduce((s: number, r: any) => {
        const qty = Number(r.qty || r.quantity || r.roomNumber || 1) || 0;
        return s + qty;
      }, 0);
      return sum + (bookedRooms || 1);
    }, 0);

    const totalQuotes = bookings.filter((b: any) => {
      if (b?.type === "quotation") {
        return !["Confirmed", "confirmed", "Accepted", "accepted", "Declined", "declined"].includes(b?.status);
      }
      if (b?.type === "reservation") {
        return !["Confirmed", "confirmed"].includes(b?.status);
      }
      return false;
    }).length;

    return {
      totalRooms,
      totalBooked: totalBookedCount,
      totalQuotes,
      occupiedToday: totalBookedCount,
    };
  };

  const [stats, setStats] = useState(() => calculateStats(initialRooms, initialBookings));

  const emptyRooms = useMemo(() => {
    return Math.max(0, stats.totalRooms - stats.totalBooked);
  }, [stats.totalRooms, stats.totalBooked]);

  useEffect(() => {
    setStats(calculateStats(initialRooms, initialBookings));
  }, [initialRooms, initialBookings]);

  useEffect(() => {
    // Skip initial fetch if we already have data from the server
    if (initialRooms.length > 0 || initialBookings.length > 0) {
      return;
    }

    const fetchStats = async () => {
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

        const roomsJson = roomsRes.ok
          ? await roomsRes.json().catch(() => ({}))
          : {};
        const bookingsJson = bookingsRes.ok
          ? await bookingsRes.json().catch(() => ({}))
          : {};

        const rooms =
          roomsJson.rooms || (Array.isArray(roomsJson) ? roomsJson : []);
        const bookings =
          bookingsJson.bookings ||
          (Array.isArray(bookingsJson) ? bookingsJson : []);

        const newStats = calculateStats(rooms, bookings);
        setStats(newStats);
      } catch (e) {
      }
    };

    fetchStats();
  }, [initialRooms, initialBookings]);

  return (
    <div className="max-w-[1600px] mx-auto w-full overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 px-1">
      <StatCard
        number={stats.totalRooms}
        label="Total Rooms"
        Icon={Building2}
      />
      <StatCard
        number={emptyRooms}
        label="Empty Rooms"
        Icon={DoorOpen}
        reversed={true}
      />
      <StatCard
        number={stats.totalBooked}
        label="Total Booked"
        Icon={CalendarCheck}
      />
      <StatCard
        number={stats.totalQuotes}
        label="Active Quotations"
        Icon={FileText}
        reversed={true}
      />
      </div>
    </div>
  );
}
