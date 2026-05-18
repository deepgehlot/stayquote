"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  FileText,
  Calendar,
  Settings,
} from "lucide-react";
import Swal from "sweetalert2";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const getPageInfo = () => {
    if (pathname === "/dashboard")
      return { title: "Dashboard Overview", icon: LayoutDashboard };
    if (pathname.includes("/quotations"))
      return { title: "Quotations Management", icon: FileText };
    if (pathname.includes("/reservations"))
      return { title: "Reservations", icon: Calendar };
    if (pathname.includes("/settings"))
      return { title: "System Settings", icon: Settings };
    return { title: "Dashboard", icon: LayoutDashboard };
  };

  const { title, icon: Icon } = getPageInfo();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to exit?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ea580c",
      cancelButtonColor: "#0f172a",
      confirmButtonText: "Yes, logout!",
      background: "#ffffff",
      color: "#0f172a",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("propertyTitle");
      localStorage.removeItem("propertyLogo");
      localStorage.removeItem("profilePicture");
      // Clear cookie for middleware
      document.cookie =
        "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie =
        "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      router.push("/");
    }
  };

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 pl-20 lg:px-10 shadow-sm shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-50 rounded-xl hidden sm:block">
          <Icon className="w-6 h-6 text-orange-600" />
        </div>
        <h1 className="text-2xl font-bold text-forest-900 tracking-wide">
          {title}
        </h1>
      </div>

      {/* Logout Button - Visible only on Desktop */}
      <button
        onClick={handleLogout}
        className="hidden lg:flex items-center px-4 py-2.5 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all duration-300 border border-orange-100"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </button>
    </header>
  );
}
