import { cookies } from "next/headers";
import { Suspense } from "react";
import SettingsClient from "./SettingsClient";
import { getApiUrl } from "@/lib/api";

async function getSettingsData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  try {
    const [settingsRes, roomsRes, servicesRes] = await Promise.all([
      fetch(getApiUrl("settings"), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        next: { revalidate: 30 }
      }),
      fetch(getApiUrl("rooms"), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        next: { revalidate: 30 }
      }),
      fetch(getApiUrl("services"), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        next: { revalidate: 30 }
      }),
    ]);

    const settingsJson = settingsRes.ok ? await settingsRes.json().catch(() => ({})) : {};
    const roomsJson = roomsRes.ok ? await roomsRes.json().catch(() => ({})) : {};
    const servicesJson = servicesRes.ok ? await servicesRes.json().catch(() => ({})) : {};

    // Settings extraction logic (matching Client side)
    const allSettingsRaw = settingsJson.settings || settingsJson;
    let settings = null;
    if (Array.isArray(allSettingsRaw)) {
      settings = allSettingsRaw.length > 0 ? allSettingsRaw[allSettingsRaw.length - 1] : null;
    } else {
      settings = allSettingsRaw;
    }

    return {
      settings,
      rooms: roomsJson.rooms || (Array.isArray(roomsJson) ? roomsJson : []),
      services: servicesJson.services || (Array.isArray(servicesJson) ? servicesJson : [])
    };
  } catch (error) {
    console.error("Settings prefetch error:", error);
    return { settings: null, rooms: [], services: [] };
  }
}

export default async function SettingsPage() {
  const data = await getSettingsData();

  return (
    <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
      <SettingsClient 
        initialSettings={data.settings} 
        initialRooms={data.rooms} 
        initialServices={data.services} 
      />
    </Suspense>
  );
}
