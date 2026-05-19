"use client";

import {
  Save,
  Building2,
  CreditCard,
  User,
  MapPin,
  ChevronRight,
  Settings,
  Plus,
  ListChecks,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Headset,
  Loader2,
  Camera,
  HeadsetIcon,
  FileText,
  Download,
  Printer,
  X,
  Check,
  Layout,
  Bed,
  Sparkles,
} from "lucide-react";
import PDFPreviewModal from "@/components/dashboard/modals/PDFPreviewModal";
import { useState, useEffect } from "react";
import { getApiUrl } from "@/lib/api";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import ListManagerModal from "@/components/dashboard/modals/ListManagerModal";

import RoomInventoryModal from "@/components/dashboard/modals/RoomInventoryModal";
import ServiceInventoryModal from "@/components/dashboard/modals/ServiceInventoryModal";
import Swal from "sweetalert2";

import PropertyProfile from "@/components/dashboard/settings/PropertyProfile";
import MasterInventory from "@/components/dashboard/settings/MasterInventory";
import PoliciesLegal from "@/components/dashboard/settings/PoliciesLegal";
import EmailConfig from "@/components/dashboard/settings/EmailConfig";
import DocumentBranding from "@/components/dashboard/settings/DocumentBranding";
import BankingFinance from "@/components/dashboard/settings/BankingFinance";
import SupportHelp from "@/components/dashboard/settings/SupportHelp";

const categories = [
  { id: "profile", label: "Property Profile", icon: User },
  { id: "inventory", label: "Master Inventory", icon: ListChecks },
  { id: "policies", label: "Policies & Legal", icon: ShieldCheck },
  { id: "smtp", label: "Email Configuration", icon: Settings },
  { id: "system", label: "Document & PDF", icon: Sparkles },
  { id: "banking", label: "Banking & Finance", icon: CreditCard },
  { id: "support", label: "Support & Help", icon: HeadsetIcon },
];

interface SettingsClientProps {
  initialSettings?: any;
  initialRooms?: any[];
  initialServices?: any[];
}

export default function SettingsClient({ 
  initialSettings, 
  initialRooms = [], 
  initialServices = [] 
}: SettingsClientProps) {
  const router = useRouter();
  const [isListManagerOpen, setIsListManagerOpen] = useState(false);
  const [managerTitle, setManagerTitle] = useState("");
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedRoomForEdit, setSelectedRoomForEdit] = useState<any>(null);
  const [selectedServiceForEdit, setSelectedServiceForEdit] =
    useState<any>(null);
  const [roomList, setRoomList] = useState<any[]>(() => {
    return initialRooms.map((r: any) => ({
      _id: r._id,
      name: r.roomName || r.roomType || "Untitled Room",
      totalRooms: r.totalRooms?.toString() || "0",
    }));
  });
  const [serviceList, setServiceList] = useState<any[]>(() => {
    return initialServices.map((s: any) => ({
      _id: s._id,
      name: s.serviceName || "Untitled Service",
      price: s.price || 0,
      description: s.description || "",
    }));
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(initialSettings?.profilePicture || initialSettings?.logo || null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(!initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [settingId, setSettingId] = useState(initialSettings?._id || "");
  const [quotationPrefix, setQuotationPrefix] = useState(initialSettings?.pdf?.quotationPrefix || initialSettings?.pdfConfig?.quotationPrefix || "SBQ");
  const [reservationPrefix, setReservationPrefix] = useState(initialSettings?.pdf?.reservationPrefix || initialSettings?.pdfConfig?.reservationPrefix || "SBR");
  const [pdfLayout, setPdfLayout] = useState(initialSettings?.pdf?.layout || initialSettings?.pdfConfig?.layout || "Modern");
  const [pdfColor, setPdfColor] = useState(initialSettings?.pdf?.color || initialSettings?.pdfConfig?.color || "#ea580c");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewLayout, setPreviewLayout] = useState<string>("Modern");

  // Property Profile States
  const [adminUsername, setAdminUsername] = useState(""); // Still decoded from token on client for safety
  const [propertyTitle, setPropertyTitle] = useState(initialSettings?.title || "");
  const [officialEmail, setOfficialEmail] = useState(initialSettings?.email || "");
  const [emailError, setEmailError] = useState("");
  const [contactPhone, setContactPhone] = useState(initialSettings?.phoneNumber || "");
  const [phoneError, setPhoneError] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState(initialSettings?.websiteLink || "");
  const [propertyAddress, setPropertyAddress] = useState(initialSettings?.address || "");
  const [paymentTerms, setPaymentTerms] = useState<string[]>(initialSettings?.paymentTerms || []);
  const [cancellationPolicies, setCancellationPolicies] = useState<string[]>(
    initialSettings?.cancellationPolicies || [],
  );

  // Banking Details States
  const [beneficiaryName, setBeneficiaryName] = useState(initialSettings?.bankDetails?.accountName || "");
  const [bankName, setBankName] = useState(initialSettings?.bankDetails?.bankName || "");
  const [branchName, setBranchName] = useState(initialSettings?.bankDetails?.branchName || "");
  const [accountType, setAccountType] = useState(initialSettings?.bankDetails?.accountType || "Current Account");
  const [accountNumber, setAccountNumber] = useState(initialSettings?.bankDetails?.accountNumber || "");
  const [ifscCode, setIfscCode] = useState(initialSettings?.bankDetails?.ifscCode || "");
  const [ifscError, setIfscError] = useState("");
  const [upiId, setUpiId] = useState(initialSettings?.bankDetails?.upiId || "");
  const [gstNumber, setGstNumber] = useState(initialSettings?.bankDetails?.gstNumber || "");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [upiError, setUpiError] = useState("");
  const [beneficiaryError, setBeneficiaryError] = useState("");
  const [bankError, setBankError] = useState("");
  const [branchError, setBranchError] = useState("");
  const [accountError, setAccountError] = useState("");

  // SMTP States
  const [smtpHost, setSmtpHost] = useState(initialSettings?.smtp?.smtpHost || initialSettings?.smtpHost || "");
  const [smtpPort, setSmtpPort] = useState(initialSettings?.smtp?.smtpPort || initialSettings?.smtpPort || 587);
  const [smtpUser, setSmtpUser] = useState(initialSettings?.smtp?.smtpUser || initialSettings?.smtpUser || "");
  const [smtpPass, setSmtpPass] = useState("");
  const [showSmtpPass, setShowSmtpPass] = useState(false);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");
  const [decodedUserId, setDecodedUserId] = useState<string | null>(null);



  // Helper to update sidebar instantly
  const syncSidebar = (title: string, logo: string | null) => {
    localStorage.setItem("propertyTitle", title || "System Admin");
    if (logo) {
      localStorage.setItem("propertyLogo", logo);
      localStorage.setItem("profilePicture", logo); // Keep both in sync
    }
    window.dispatchEvent(new Event("settingsUpdated"));
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        // Decode JWT manually (split by dot, take second part, base64 decode)
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(""),
        );

        const decoded = JSON.parse(jsonPayload);
        setAdminUsername(decoded.username || "");
        const id = decoded.id || decoded._id || decoded.userId || decoded.sub;
        setDecodedUserId(id);

        // Only fetch if initial data is missing
        if (!initialSettings) fetchSettings(id, token);
        if (!initialRooms || initialRooms.length === 0) fetchRooms(token);
        if (!initialServices || initialServices.length === 0) fetchServices(token);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  // Sync with Hash for navigation
  const syncHash = () => {
    if (typeof window === "undefined") return;
    const fullHash = window.location.hash;
    // Handle both cases: "#profile" and "#/dashboard/settings#profile" (if Next.js does something weird)
    const hashParts = fullHash.split("#").filter(Boolean);
    
    // Get the actual tab ID (the last part if it accumulated, or the only part)
    const tabId = hashParts[hashParts.length - 1] || "profile";
    
    // Validate if tabId is one of our categories
    const isValidTab = categories.some(cat => cat.id === tabId);
    const finalTabId = isValidTab ? tabId : "profile";

    // If we have multiple hashes or an invalid hash, clean it up in the URL
    if (hashParts.length > 1 || (fullHash && !isValidTab)) {
      window.history.replaceState(null, "", `${window.location.pathname}#${finalTabId}`);
    } else if (!fullHash) {
      // Default to #profile in URL if no hash is present (cleaner experience)
      window.history.replaceState(null, "", `${window.location.pathname}#profile`);
    }
    
    setActiveTab(finalTabId);
  };

  useEffect(() => {
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  // Also sync on pathname changes (e.g. initial navigation to the page)
  useEffect(() => {
    syncHash();
  }, [pathname, searchParams]);

  const fetchServices = async (token: string) => {
    try {
      const response = await fetch(getApiUrl("services"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch services");

      const data = await response.json();


      const services = data.services || (Array.isArray(data) ? data : []);

      const mappedServices = services.map((s: any) => ({
        _id: s._id,
        name: s.serviceName || "Untitled Service",
        price: s.price || 0,
        description: s.description || "",
      }));

      setServiceList(mappedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleServiceAdd = async (data: { name: string }) => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");

      const payload = {
        user: decodedUserId,
        serviceName: data.name,
        description: "Premium hospitality service",
        price: 0,
        gst: 18,
        status: "active",
      };



      const response = await fetch(getApiUrl("services"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json().catch(() => ({}));


      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create service");
      }

      fetchServices(token || "");
      Swal.fire({
        title: "Success!",
        text: "Service added successfully!",
        icon: "success",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ea580c",
      });
    } catch (error: any) {
      console.error("Error adding service:", error);
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ea580c",
      });
    } finally {
      setIsSaving(false);
      setIsServiceModalOpen(false);
    }
  };

  const handleServiceUpdate = async (data: { name: string }) => {
    if (!selectedServiceForEdit?._id) return;

    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");

      const payload = {
        serviceName: data.name,
        price: selectedServiceForEdit.price || 0,
        description:
          selectedServiceForEdit.description || "Updated service description",
      };



      const response = await fetch(
        getApiUrl(`services/${selectedServiceForEdit._id}`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const responseData = await response.json().catch(() => ({}));


      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update service");
      }

      fetchServices(token || "");
      Swal.fire({
        title: "Success!",
        text: "Service updated successfully!",
        icon: "success",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ea580c",
      });
    } catch (error: any) {
      console.error("Error updating service:", error);
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ea580c",
      });
    } finally {
      setIsSaving(false);
      setSelectedServiceForEdit(null);
      setIsServiceModalOpen(false);
    }
  };
  const handleServiceDelete = async (service: any) => {
    if (!service._id) {
      setServiceList((prev) => prev.filter((s) => s !== service));
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to delete "${service.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      background: "#0f172a",
      color: "#fff",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#4b5563",
    });

    if (!result.isConfirmed) return;

    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");

      const response = await fetch(getApiUrl(`services/${service._id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json().catch(() => ({}));


      if (!response.ok) {
        throw new Error(responseData.message || "Failed to delete service");
      }

      fetchServices(token || "");
      Swal.fire({
        title: "Deleted!",
        text: "Service deleted successfully!",
        icon: "success",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ea580c",
      });
    } catch (error: any) {
      console.error("Error deleting service:", error);
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ea580c",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const fetchRooms = async (token: string) => {
    try {
      const response = await fetch(getApiUrl("rooms"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch rooms");

      const data = await response.json();


      const rooms = data.rooms || (Array.isArray(data) ? data : []);

      // Map API fields to our UI state
      const mappedRooms = rooms.map((r: any) => ({
        _id: r._id,
        name: r.roomName || r.roomType || "Untitled Room",
        totalRooms: r.totalRooms?.toString() || "0",
      }));

      setRoomList(mappedRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleRoomAdd = async (data: {
    category: string;
    totalRooms: string;
  }) => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");

      const payload = {
        user: decodedUserId,
        totalRooms: parseInt(data.totalRooms), // using totalRooms as key
        roomName: data.category,
        roomType: data.category,
        description: "Premium Room",
        capacity: 2,
        basePrice: 4500,
        gst: 18,
        status: "active",
      };



      const response = await fetch(getApiUrl("rooms"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json().catch(() => ({}));


      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to create room category",
        );
      }

      // Re-fetch rooms to sync with server
      fetchRooms(token || "");
      Swal.fire({
        title: "Success!",
        text: "Room Category added successfully!",
        icon: "success",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ea580c",
      });
    } catch (error: any) {
      console.error("Error adding room:", error);
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ea580c",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoomUpdate = async (data: {
    category: string;
    totalRooms: string;
  }) => {
    if (!selectedRoomForEdit?._id) return;

    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");

      const payload = {
        roomName: data.category,
        roomType: data.category,
        totalRooms: parseInt(data.totalRooms),
      };



      const response = await fetch(
        getApiUrl(`rooms/${selectedRoomForEdit._id}`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const responseData = await response.json().catch(() => ({}));


      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update room");
      }

      // Re-fetch rooms to sync
      fetchRooms(token || "");
      Swal.fire({
        title: "Success!",
        text: "Room updated successfully!",
        icon: "success",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ea580c",
      });
    } catch (error: any) {
      console.error("Error updating room:", error);
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ea580c",
      });
    } finally {
      setIsSaving(false);
      setSelectedRoomForEdit(null);
      setIsRoomModalOpen(false);
    }
  };
  const handleRoomDelete = async (room: any) => {
    if (!room._id) {
      setRoomList((prev) => prev.filter((r) => r !== room));
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Deleting the "${room.name}" category will also permanently delete all reservations and quotations associated with it!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      background: "#0f172a",
      color: "#fff",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#4b5563",
    });

    if (!result.isConfirmed) return;

    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");

      // 1. Fetch all bookings to perform cascade deletion of associated bookings
      const bookingsResponse = await fetch(getApiUrl("bookings"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        const allBookings = bookingsData.bookings || (Array.isArray(bookingsData) ? bookingsData : []);

        const bookingsToDelete = allBookings.filter((b: any) => {
          return (b.rooms || []).some((r: any) => 
            r.roomId === room._id || 
            (r.roomName && r.roomName.toLowerCase() === room.name.toLowerCase())
          );
        });

        if (bookingsToDelete.length > 0) {
          const deletePromises = bookingsToDelete.map((b: any) =>
            fetch(getApiUrl(`bookings/${b._id}`), {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            })
          );
          await Promise.all(deletePromises);
        }
      }

      // 2. Delete the room category itself
      const response = await fetch(getApiUrl(`rooms/${room._id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to delete room");
      }

      fetchRooms(token || "");
      Swal.fire({
        title: "Deleted!",
        text: "Room category and all its associated bookings have been deleted successfully!",
        icon: "success",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ea580c",
      });
    } catch (error: any) {
      console.error("Error deleting room:", error);
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ea580c",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const fetchSettings = async (id: string, token: string) => {
    try {
      setIsLoadingSettings(true);
      // Fetch settings for this specific user
      const response = await fetch(getApiUrl("settings"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch settings");

      const data = await response.json();


      const allSettingsRaw = data.settings || data;
      let settings = null;

      if (Array.isArray(allSettingsRaw)) {

        settings =
          allSettingsRaw.length > 0
            ? allSettingsRaw[allSettingsRaw.length - 1]
            : null;
      } else {

        settings = allSettingsRaw;
      }



      if (settings) {
        // Capture Setting ID for updates
        setSettingId(settings._id || "");

        // Sync Sidebar
        syncSidebar(settings.title, settings.logo);

        // Map Property Profile
        setPropertyTitle(settings.title || "");
        setOfficialEmail(settings.email || "");
        setContactPhone(settings.phoneNumber || "");
        setWebsiteUrl(settings.websiteLink || "");
        setPropertyAddress(settings.address || "");
        setProfilePic(settings.profilePicture || settings.logo || null);
        setPaymentTerms(settings.paymentTerms || []);
        setCancellationPolicies(settings.cancellationPolicies || []);

        // Map PDF Config
        const pdf = settings.pdf || settings.pdfConfig;
        if (pdf) {
          setQuotationPrefix(pdf.quotationPrefix || "SBQ");
          setReservationPrefix(pdf.reservationPrefix || "SBR");
          setPdfLayout(pdf.layout || "Modern");
          setPdfColor(pdf.color || "#ea580c");
        }

        // Map Banking Details
        if (settings.bankDetails) {
          setBeneficiaryName(settings.bankDetails.accountName || "");
          setBankName(settings.bankDetails.bankName || "");
          setBranchName(settings.bankDetails.branchName || "");
          setAccountType(settings.bankDetails.accountType || "Current Account");
          setAccountNumber(settings.bankDetails.accountNumber || "");
          setIfscCode(settings.bankDetails.ifscCode || "");
          setUpiId(settings.bankDetails.upiId || "");
          setGstNumber(settings.bankDetails.gstNumber || "");
        }

        // Map SMTP Details (Check both nested and flat fields for maximum compatibility)
        const smtp = settings.smtp || {};
        setSmtpHost(smtp.smtpHost || settings.smtpHost || "");
        setSmtpPort(smtp.smtpPort || settings.smtpPort || 587);
        setSmtpUser(smtp.smtpUser || settings.smtpUser || "");
        setSmtpPass(""); // Backend returns empty anyway - password is write-only
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const validateForm = (
    section: "profile" | "banking" | "system" | "smtp" | "policies",
  ) => {
    if (section === "profile") {
      if (!propertyTitle.trim()) {
        Swal.fire({
          title: "Required",
          text: "Property Name is required",
          icon: "warning",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#ea580c",
        });
        return false;
      }
      if (!officialEmail.trim() || !officialEmail.includes("@")) {
        Swal.fire({
          title: "Invalid Email",
          text: "Please enter a valid official email",
          icon: "warning",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#ea580c",
        });
        return false;
      }
      if (!contactPhone.trim() || contactPhone.length < 10) {
        Swal.fire({
          title: "Invalid Phone",
          text: "Please enter a valid contact phone number",
          icon: "warning",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#ea580c",
        });
        return false;
      }
      if (!propertyAddress.trim()) {
        Swal.fire({
          title: "Required",
          text: "Property Address is required",
          icon: "warning",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#ea580c",
        });
        return false;
      }
    }

    if (section === "banking") {
      if (!beneficiaryName.trim()) {
        Swal.fire({
          title: "Required",
          text: "Beneficiary Name is required",
          icon: "warning",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#ea580c",
        });
        return false;
      }
      if (!bankName.trim()) {
        Swal.fire({
          title: "Required",
          text: "Bank Name is required",
          icon: "warning",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#ea580c",
        });
        return false;
      }
      if (!branchName.trim()) {
        Swal.fire({
          title: "Required",
          text: "Branch Name is required",
          icon: "warning",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#ea580c",
        });
        return false;
      }
      if (!accountNumber.trim()) {
        Swal.fire({
          title: "Required",
          text: "Account Number is required",
          icon: "warning",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#ea580c",
        });
        return false;
      }
      if (!ifscCode.trim()) {
        Swal.fire({
          title: "Required",
          text: "IFSC Code is required",
          icon: "warning",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#ea580c",
        });
        return false;
      }
      if (!upiId.trim()) {
        Swal.fire({
          title: "Required",
          text: "UPI ID is required",
          icon: "warning",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#ea580c",
        });
        return false;
      }
      if (!upiId.includes("@")) {
        Swal.fire({
          title: "Invalid UPI",
          text: "Please enter a valid UPI ID (must contain @)",
          icon: "warning",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#ea580c",
        });
        return false;
      }
    }

    return true;
  };

  const handleProfileUpdate = async (
    section: "profile" | "banking" | "system" | "smtp" | "policies" = "profile",
  ) => {
    if (!validateForm(section)) return;

    try {
      setSavingSection(section);
      const token = localStorage.getItem("authToken");

      // Construct payload dynamically based on the section being saved
      let payload: any = {
        user: decodedUserId,
      };

      if (section === "profile") {
        payload = {
          ...payload,
          username: adminUsername,
          logo: profilePic,
          profilePicture: profilePic,
          title: propertyTitle,
          address: propertyAddress,
          phoneNumber: contactPhone,
          email: officialEmail,
          websiteLink: websiteUrl,
        };
      } else if (section === "banking") {
        payload.bankDetails = {
          accountName: beneficiaryName,
          bankName: bankName,
          branchName: branchName,
          accountNumber: accountNumber,
          ifscCode: ifscCode,
          accountType: accountType,
          upiId: upiId,
          gstNumber: gstNumber,
        };
      } else if (section === "policies") {
        payload.paymentTerms = paymentTerms;
        payload.cancellationPolicies = cancellationPolicies;
      } else if (section === "system") {
        payload.pdf = {
          quotationPrefix: quotationPrefix,
          reservationPrefix: reservationPrefix,
          layout: pdfLayout,
          color: pdfColor,
        };
      } else if (section === "smtp") {
        payload.smtp = {
          smtpHost: smtpHost,
          smtpPort: smtpPort,
          smtpUser: smtpUser,
          ...(smtpPass ? { smtpPass: smtpPass } : {}),
        };
        // Flattened fields for backward compatibility if needed
        payload.smtpHost = smtpHost;
        payload.smtpPort = smtpPort;
        payload.smtpUser = smtpUser;
        if (smtpPass) payload.smtpPass = smtpPass;
      }

      const isCreating = !settingId;
      const url = isCreating
        ? getApiUrl("settings")
        : getApiUrl(`settings/${settingId}`);
      const method = isCreating ? "POST" : "PATCH";



      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));


      if (!response.ok) {
        throw new Error(data.message || "Failed to save settings");
      }

      // Update Sidebar immediately
      syncSidebar(propertyTitle, profilePic);

      // Refresh server components cache so settings propagate instantly without reload
      router.refresh();

      // Update settingId so subsequent saves work (e.g. Profile -> Banking)
      if (data.settings && data.settings._id) {
        setSettingId(data.settings._id);
      } else if (data._id) {
        setSettingId(data._id);
      }

      Swal.fire({
        title: "Success!",
        text: "Settings saved successfully!",
        icon: "success",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ea580c",
      });
    } catch (error: any) {
      console.error("Update error:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong",
        icon: "error",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ea580c",
      });
    } finally {
      setSavingSection(null);
    }
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case "profile":
        return (
          <PropertyProfile
            adminUsername={adminUsername}
            setAdminUsername={setAdminUsername}
            propertyTitle={propertyTitle}
            setPropertyTitle={setPropertyTitle}
            officialEmail={officialEmail}
            setOfficialEmail={setOfficialEmail}
            contactPhone={contactPhone}
            setContactPhone={setContactPhone}
            websiteUrl={websiteUrl}
            setWebsiteUrl={setWebsiteUrl}
            propertyAddress={propertyAddress}
            setPropertyAddress={setPropertyAddress}
            profilePic={profilePic}
            setProfilePic={setProfilePic}
            phoneError={phoneError}
            setPhoneError={setPhoneError}
            emailError={emailError}
            setEmailError={setEmailError}
            isSaving={savingSection === "profile"}
            onSave={handleProfileUpdate}
          />
        );
      case "inventory":
        return (
          <MasterInventory
            roomList={roomList}
            serviceList={serviceList}
            setIsRoomModalOpen={setIsRoomModalOpen}
            setIsServiceModalOpen={setIsServiceModalOpen}
            setSelectedRoomForEdit={setSelectedRoomForEdit}
            setSelectedServiceForEdit={setSelectedServiceForEdit}
            handleRoomDelete={handleRoomDelete}
            handleServiceDelete={handleServiceDelete}
          />
        );
      case "policies":
        return (
          <PoliciesLegal
            paymentTerms={paymentTerms}
            setPaymentTerms={setPaymentTerms}
            cancellationPolicies={cancellationPolicies}
            setCancellationPolicies={setCancellationPolicies}
            isSaving={savingSection === "policies"}
            onSave={handleProfileUpdate}
          />
        );
      case "smtp":
        return (
          <EmailConfig
            smtpHost={smtpHost}
            setSmtpHost={setSmtpHost}
            smtpPort={smtpPort}
            setSmtpPort={setSmtpPort}
            smtpUser={smtpUser}
            setSmtpUser={setSmtpUser}
            smtpPass={smtpPass}
            setSmtpPass={setSmtpPass}
            showSmtpPass={showSmtpPass}
            setShowSmtpPass={setShowSmtpPass}
            isSaving={savingSection === "smtp"}
            onSave={handleProfileUpdate}
          />
        );
      case "system":
        return (
          <DocumentBranding
            quotationPrefix={quotationPrefix}
            setQuotationPrefix={setQuotationPrefix}
            reservationPrefix={reservationPrefix}
            setReservationPrefix={setReservationPrefix}
            pdfLayout={pdfLayout}
            setPdfLayout={setPdfLayout}
            pdfColor={pdfColor}
            setPdfColor={setPdfColor}
            setPreviewData={setPreviewData}
            setPreviewLayout={setPreviewLayout}
            setIsPreviewModalOpen={setIsPreviewModalOpen}
            isSaving={savingSection === "system"}
            onSave={handleProfileUpdate}
          />
        );
      case "banking":
        return (
          <BankingFinance
            bankName={bankName}
            setBankName={setBankName}
            branchName={branchName}
            setBranchName={setBranchName}
            accountHolder={beneficiaryName}
            setAccountHolder={setBeneficiaryName}
            accountType={accountType}
            setAccountType={setAccountType}
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            ifscCode={ifscCode}
            setIfscCode={setIfscCode}
            upiId={upiId}
            setUpiId={setUpiId}
            gstNumber={gstNumber}
            setGstNumber={setGstNumber}
            qrCode={qrCode}
            setQrCode={setQrCode}
            isSaving={savingSection === "banking"}
            onSave={handleProfileUpdate}
          />
        );
      case "support":
        return <SupportHelp />;
      default:
        return null;
    }
  };



  return (
    <div className="min-h-screen pb-20 relative">
      <div className="max-w-5xl mx-auto space-y-8 w-full">
        {/* Settings Content Sections */}
        <div className="flex-1 space-y-8 w-full">
          {renderActiveSection()}

        </div>
      </div>

      <ListManagerModal
        isOpen={isListManagerOpen}
        onClose={() => setIsListManagerOpen(false)}
        title={managerTitle}
        items={
          managerTitle.includes("Rooms")
            ? roomList.map((r) => (typeof r === "string" ? r : r.name))
            : serviceList.map((s) => (typeof s === "string" ? s : s.name))
        }
        onAdd={(name) => {
          if (managerTitle.includes("Rooms"))
            setRoomList([...roomList, { name, totalRooms: "0" }]);
          else handleServiceAdd({ name });
        }}
        onRemove={(index) => {
          if (managerTitle.includes("Rooms"))
            setRoomList(roomList.filter((_, i) => i !== index));
          else setServiceList(serviceList.filter((_, i) => i !== index));
        }}
      />

      <RoomInventoryModal
        isOpen={isRoomModalOpen}
        onClose={() => {
          setIsRoomModalOpen(false);
          setSelectedRoomForEdit(null);
        }}
        onAdd={handleRoomAdd}
        onUpdate={handleRoomUpdate}
        isEdit={!!selectedRoomForEdit}
        initialData={
          selectedRoomForEdit
            ? {
                category: selectedRoomForEdit.name,
                totalRooms: selectedRoomForEdit.totalRooms,
              }
            : undefined
        }
      />

      <ServiceInventoryModal
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false);
          setSelectedServiceForEdit(null);
        }}
        onAdd={handleServiceAdd}
        onUpdate={handleServiceUpdate}
        isEdit={!!selectedServiceForEdit}
        initialData={
          selectedServiceForEdit
            ? {
                name: selectedServiceForEdit.name,
              }
            : undefined
        }
      />

      <PDFPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        bookingData={previewData}
        settings={{
          title: propertyTitle,
          logo: profilePic,
          address: propertyAddress,
          phoneNumber: contactPhone,
          email: officialEmail,
          websiteLink: websiteUrl,
          bankDetails: {
            accountName: beneficiaryName,
            bankName: bankName,
            branchName: branchName,
            accountNumber: accountNumber,
            ifscCode: ifscCode,
            accountType: accountType,
            upiId: upiId,
            gstNumber: gstNumber,
          },
          paymentTerms: paymentTerms,
          cancellationPolicies: cancellationPolicies,
          pdf: {
            layout: previewLayout,
            color: pdfColor,
          },
          isPreview: true,
        }}
      />
    </div>
  );
}
