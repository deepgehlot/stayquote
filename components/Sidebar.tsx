"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Settings,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  ChevronDown,
  User,
  ListChecks,
  Sparkles,
  CreditCard,
  Headset,
} from "lucide-react";
import Swal from "sweetalert2";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Quotations", href: "/dashboard/quotations", icon: FileText },
  { name: "Reservations", href: "/dashboard/reservations", icon: Calendar },
];

const settingsItems = [
  { name: "Property Profile", href: "/dashboard/settings#profile", icon: User },
  { name: "Master Inventory", href: "/dashboard/settings#inventory", icon: ListChecks },
  { name: "Policies & Legal", href: "/dashboard/settings#policies", icon: ShieldCheck },
  { name: "Email Config", href: "/dashboard/settings#smtp", icon: Settings },
  { name: "Document Branding", href: "/dashboard/settings#system", icon: Sparkles },
  { name: "Banking & Finance", href: "/dashboard/settings#banking", icon: CreditCard },
];

interface SidebarProps {
  initialSettings?: any;
}

export default function Sidebar({ initialSettings }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(pathname.includes("/settings"));
  const [currentHash, setCurrentHash] = useState("");
  const [propertyTitle, setPropertyTitle] = useState(initialSettings?.title || "System Admin");
  const [propertyLogo, setPropertyLogo] = useState<string | null>(initialSettings?.profilePicture || initialSettings?.logo || null);

  // Sync with localStorage
  const syncProfile = () => {
    const savedTitle = localStorage.getItem("propertyTitle");
    const savedLogo = localStorage.getItem("propertyLogo") || localStorage.getItem("profilePicture");
    if (savedTitle) setPropertyTitle(savedTitle);
    if (savedLogo) setPropertyLogo(savedLogo);
  };

  // Sync state whenever initialSettings props update from layouts
  React.useEffect(() => {
    if (initialSettings) {
      setPropertyTitle(initialSettings.title || "System Admin");
      const logo = initialSettings.profilePicture || initialSettings.logo || null;
      setPropertyLogo(logo);
      
      localStorage.setItem("propertyTitle", initialSettings.title || "System Admin");
      if (logo) {
        localStorage.setItem("propertyLogo", logo);
        localStorage.setItem("profilePicture", logo);
      } else {
        localStorage.removeItem("propertyLogo");
        localStorage.removeItem("profilePicture");
      }
    }
  }, [initialSettings]);

  React.useEffect(() => {
    syncProfile();
    
    // Hash tracking for active sub-items
    const handleHashChange = () => setCurrentHash(window.location.hash);
    setCurrentHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    
    // Listen for custom "settingsUpdated" event
    window.addEventListener("settingsUpdated", syncProfile);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("settingsUpdated", syncProfile);
    };
  }, []);

  // Auto-close settings dropdown when navigating away from settings
  React.useEffect(() => {
    if (!pathname.includes("/settings")) {
      setIsSettingsOpen(false);
    } else {
      setIsSettingsOpen(true);
    }
  }, [pathname]);

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
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden fixed top-5 z-[60] p-2 bg-gray-900 text-white rounded-lg shadow-xl border border-white/10 transition-all duration-300 ${
          isOpen ? "left-[208px]" : "left-5"
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Aside Panel */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-orange-600 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-white/10 shrink-0">
          {propertyLogo ? (
            <img
              src={propertyLogo}
              alt="Logo"
              className="w-10 h-10 rounded-xl object-cover border border-white/10 mr-3"
            />
          ) : (
            <ShieldCheck className="w-8 h-8 text-white mr-3" strokeWidth={2} />
          )}
          <div className="overflow-hidden">
            <h2 className="font-bold text-base tracking-wide text-white truncate">
              {propertyTitle}
            </h2>
            {propertyLogo && (
              <p className="text-[9px] text-white font-black uppercase tracking-tighter opacity-60">
                Property Admin
              </p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto scrollbar-hide flex flex-col">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)} // Close on click for mobile
                className={`group flex items-center px-4 py-2.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-white text-gray-900 font-bold shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
                    : "text-orange-50 hover:bg-white hover:text-gray-900 font-medium"
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? "text-gray-900" : "group-hover:text-gray-900"}`} />
                {item.name}
              </Link>
            );
          })}

          {/* Settings Dropdown Item */}
          <div className="space-y-2">
            <button
              onClick={() => {
                setIsSettingsOpen(!isSettingsOpen);
                if (!pathname.includes("/settings")) {
                  router.push("/dashboard/settings#profile");
                  setCurrentHash("#profile");
                }
              }}
              className={`group w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
                pathname.includes("/settings")
                  ? "bg-white text-gray-900 font-bold shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
                  : "text-orange-50 hover:bg-white hover:text-gray-900 font-medium"
              }`}
            >
              <div className="flex items-center">
                <Settings className={`w-5 h-5 mr-3 transition-colors ${pathname.includes("/settings") ? "text-gray-900" : "group-hover:text-gray-900"}`} />
                <span>Settings</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSettingsOpen ? "rotate-180" : ""} ${pathname.includes("/settings") ? "text-gray-900" : "group-hover:text-gray-900"}`} />
            </button>

            {isSettingsOpen && (
              <div className="pl-4 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                {settingsItems.map((subItem) => {
                  const subItemHash = subItem.href.split("#")[1];
                  const isActive = pathname.startsWith("/dashboard/settings") && currentHash === `#${subItemHash}`;
                  const Icon = subItem.icon;
                  return (
                    <Link
                      key={subItem.name}
                      href={pathname.includes("/settings") ? `#${subItemHash}` : subItem.href}
                      replace={true}
                      onClick={() => {
                        setIsOpen(false);
                        setCurrentHash(`#${subItemHash}`);
                      }}
                      className={`group/sub relative flex items-center px-4 py-2.5 rounded-xl text-[11px] transition-all duration-300 ${
                        (pathname.startsWith("/dashboard/settings") && 
                         (currentHash === `#${subItemHash}` || (currentHash === "" && subItemHash === "profile")))
                          ? "bg-orange-50 text-orange-600 font-bold shadow-sm translate-x-1"
                          : "text-orange-50 hover:bg-white hover:text-orange-600 font-medium"
                      }`}
                    >
                      {/* Active Indicator Line - Positioned clearly inside the white background */}
                      {isActive && (
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-600 rounded-full z-20" />
                      )}
                      
                      <div className="flex items-center gap-3">
                        <div className={`relative transition-transform duration-300 ${isActive ? "scale-110" : "group-hover/sub:scale-110"}`}>
                          <Icon className={`w-4 h-4 ${isActive ? "text-orange-600" : "opacity-60"}`} />
                          {isActive && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-600 rounded-full border-2 border-white z-30" />
                          )}
                        </div>
                        <span>{subItem.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          {/* Support Card - Pushed to bottom of nav */}
          <div className="mt-auto pt-4 pb-2">
            <div className="bg-white border border-gray-100 rounded-xl p-3.5 shadow-lg shadow-black/5 overflow-hidden relative group mx-2">
              <div className="relative z-10">
                <h4 className="text-slate-900 text-xs font-bold mb-1 flex items-center gap-2">
                  <Headset className="w-3.5 h-3.5 text-orange-600" />
                  Need Help?
                </h4>
                <p className="text-slate-500 text-[9px] leading-snug mb-3 font-medium">
                  Our team is available for any assistance.
                </p>
                <button className="w-full bg-orange-600 text-white hover:bg-orange-700 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-orange-600/10 active:scale-95">
                  Contact Support
                </button>
              </div>
              <ShieldCheck className="absolute -bottom-2 -right-2 w-12 h-12 text-gray-50 group-hover:scale-110 transition-transform duration-700" />
            </div>
          </div>
        </nav>

        {/* Mobile Logout (Restored) */}
        <div className="px-4 pb-4 lg:hidden">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 text-white font-bold rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-sm text-xs"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </button>
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-gray-900 border-t border-white/10 shrink-0 flex flex-col items-center gap-2">
          <img
            src="/shape byteS.svg"
            alt="ShapesBytes"
            className="h-4 hover:scale-105 transition-all duration-300 cursor-pointer"
          />
        </div>
      </aside>
    </>
  );
}
