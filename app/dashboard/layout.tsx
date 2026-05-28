import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { cookies } from "next/headers";
import { getApiUrl } from "@/lib/api";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { Suspense } from "react";

async function getLayoutData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  try {
    const response = await fetch(getApiUrl("settings"), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: 'no-store' // Do not cache user settings across different users/requests
    });

    if (!response.ok) return null;
    const data = await response.json();
    const allSettings = data.settings || data;
    
    if (Array.isArray(allSettings)) {
      return allSettings.length > 0 ? allSettings[allSettings.length - 1] : null;
    }
    return allSettings;
  } catch (error) {
    console.error("Layout prefetch error:", error);
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialSettings = await getLayoutData();

  return (
    <div className="flex h-screen w-full bg-[#f8f9fa] overflow-hidden">
      <Sidebar initialSettings={initialSettings} />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<div className="animate-pulse h-96 bg-white rounded-3xl" />}>
              <SubscriptionGuard>
                {children}
              </SubscriptionGuard>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
