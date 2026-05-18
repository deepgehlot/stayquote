import { cookies } from "next/headers";
import { Suspense } from "react";
import QuotationsClient from "./QuotationsClient";
import { getApiUrl } from "@/lib/api";

async function getQuotationsData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  try {
    const [bookingsRes, settingsRes] = await Promise.all([
      fetch(getApiUrl("bookings"), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        next: { revalidate: 30 }
      }),
      fetch(getApiUrl("settings"), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        next: { revalidate: 30 }
      }),
    ]);

    const bookingsJson = bookingsRes.ok ? await bookingsRes.json().catch(() => ({})) : {};
    const settingsJson = settingsRes.ok ? await settingsRes.json().catch(() => ({})) : {};

    // Filter logic (matching Client side)
    const allBookings = bookingsJson.bookings || (Array.isArray(bookingsJson) ? bookingsJson : []);
    const quotations = allBookings.filter((b: any) => b.type === "quotation");

    const settings = settingsJson.settings || settingsJson.data || (Array.isArray(settingsJson) ? settingsJson[0] : settingsJson);

    return {
      bookings: quotations,
      settings
    };
  } catch (error) {
    console.error("Quotations prefetch error:", error);
    return { bookings: [], settings: null };
  }
}

export default async function QuotationsPage() {
  const data = await getQuotationsData();

  return (
    <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
      <QuotationsClient 
        initialBookings={data.bookings} 
        initialSettings={data.settings} 
      />
    </Suspense>
  );
}
