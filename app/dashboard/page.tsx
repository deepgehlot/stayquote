import { cookies } from "next/headers";
import { Suspense } from "react";
import StatCards from "@/components/dashboard/StatCards";
import QuickActions from "@/components/dashboard/QuickActions";
import BookingCalendar from "@/components/dashboard/BookingCalendar";
import { getApiUrl } from "@/lib/api";

async function getDashboardData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  try {
    const [roomsRes, bookingsRes] = await Promise.all([
      fetch(getApiUrl("rooms"), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        next: { revalidate: 30 } // Cache for 30 seconds
      }),
      fetch(getApiUrl("bookings"), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        next: { revalidate: 30 }
      }),
    ]);

    const roomsJson = roomsRes.ok ? await roomsRes.json().catch(() => ({})) : {};
    const bookingsJson = bookingsRes.ok ? await bookingsRes.json().catch(() => ({})) : {};

    return {
      rooms: roomsJson.rooms || (Array.isArray(roomsJson) ? roomsJson : []),
      bookings: bookingsJson.bookings || (Array.isArray(bookingsJson) ? bookingsJson : [])
    };
  } catch (error) {
    console.error("Dashboard prefetch error:", error);
    return { rooms: [], bookings: [] };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Cards Row */}
      <StatCards initialRooms={data.rooms} initialBookings={data.bookings} />

      {/* Booking Calendar Section */}
      <Suspense fallback={<div className="h-[600px] w-full bg-white animate-pulse rounded-xl" />}>
        <BookingCalendar initialRooms={data.rooms} initialBookings={data.bookings} />
      </Suspense>

      {/* Quick Actions Row */}
      <QuickActions />
    </div>
  );
}

