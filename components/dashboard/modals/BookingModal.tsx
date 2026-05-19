"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Plus,
  Settings,
  Sparkles,
  AlertCircle,
  Calendar,
  Users,
  IndianRupee,
  Trash2,
  ChevronRight,
  Loader2,
  Bed,
} from "lucide-react";
import ListManagerModal from "./ListManagerModal";
import { getApiUrl } from "@/lib/api";
import { getPropertyProfileFromSettings } from "@/lib/settings";
import { pdf } from "@react-pdf/renderer";
import PDFWrapper from "@/components/dashboard/pdf/PDFWrapper";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  initialData?: any;
  type?: "quotation" | "reservation";
}

interface QuotationItem {
  id: string;
  type: "room" | "service" | "tax";
  description: string;
  price: number;
  quantity: number;
  extraDetails?: string;
  gst: number;
  applyGST?: boolean;
  showDetails?: boolean;
  roomId?: string;
  serviceId?: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  isEdit,
  initialData,
  type = "quotation",
}: BookingModalProps) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    reference: `${type === "reservation" ? "SBR" : "SBQ"}-${Math.floor(100000 + Math.random() * 900000)}`,
    clientName: "",
    contact: "",
    email: "",
    adults: 2,
    kids: 0,
    checkIn: "",
    checkOut: "",
    nights: 1,
    advance: 0,
  });

  const [isListManagerOpen, setIsListManagerOpen] = useState(false);
  const [managerTitle, setManagerTitle] = useState("");
  const [roomList, setRoomList] = useState<any[]>([]);
  const [serviceList, setServiceList] = useState<any[]>([]);
  const [availableRoomsById, setAvailableRoomsById] = useState<
    Record<string, number>
  >({});
  const [quotationPrefix, setQuotationPrefix] = useState("SBQ");
  const [reservationPrefix, setReservationPrefix] = useState("SBR");

  const [items, setItems] = useState<QuotationItem[]>([]);
  const [globalGst, setGlobalGst] = useState(18);
  const [emailError, setEmailError] = useState(false);
  const [decodedUserId, setDecodedUserId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [fullSettings, setFullSettings] = useState<any>(null);

  // Sync nights when check-in/out changes
  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setFormData((prev) => ({ ...prev, nights: diffDays || 1 }));
    }
  }, [formData.checkIn, formData.checkOut]);

  // Reset form when opening for a new entry OR populate for edit
  useEffect(() => {
    if (isOpen && initialData) {
      // Populate form fields from the booking record (Edit or Conversion)
      const currentRef = initialData.bookingId || "";
      let displayRef = currentRef;

      // If converting Quotation -> Reservation, swap prefix
      if (type === "reservation" && !isEdit) {
        const parts = currentRef.split("-");
        if (parts.length > 1) {
          displayRef = `${reservationPrefix}-${parts[1]}`;
        } else if (currentRef.startsWith("SBQ")) {
          displayRef = currentRef.replace("SBQ", "SBR");
        }
      }

      setFormData({
        date: initialData.reservationDate
          ? new Date(initialData.reservationDate).toISOString().split("T")[0]
          : new Date(initialData.createdAt).toISOString().split("T")[0],
        validUntil: initialData.validUntil
          ? new Date(initialData.validUntil).toISOString().split("T")[0]
          : "",
        reference: displayRef,
        clientName: initialData.clientName || "",
        contact: initialData.clientContact || "",
        email: initialData.clientEmail || "",
        adults: initialData.guests?.adults || 2,
        kids: initialData.guests?.kids || 0,
        checkIn: initialData.checkIn
          ? new Date(initialData.checkIn).toISOString().split("T")[0]
          : "",
        checkOut: initialData.checkOut
          ? new Date(initialData.checkOut).toISOString().split("T")[0]
          : "",
        nights: initialData.nights || 1,
        advance: initialData.payment?.advancePaid || 0,
      });

      // Populate items from rooms and services
      const editItems: QuotationItem[] = [
        ...(initialData.rooms || []).map((r: any) => {
          // If description is missing (stripped by API), we try to get it from roomType
          // but only if roomType is different from roomName (since roomType is often used as fallback for roomName)
          const extra =
            r.description || (r.roomType !== r.roomName ? r.roomType : "");

          return {
            id: Math.random().toString(36).substr(2, 9),
            type: "room" as const,
            description: r.roomName || r.roomType || "",
            price: r.rate || 0,
            quantity: r.qty || r.quantity || 1,
            extraDetails: extra || "",
            gst: r.gst || 0,
            applyGST: (r.gst || 0) > 0,
            showDetails: !!extra,
            roomId: r.roomId || r._id,
          };
        }),
        ...(initialData.services || []).map((s: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          type: "service" as const,
          description: s.serviceName || "",
          price: s.rate || 0,
          quantity: s.qty || s.quantity || 1,
          extraDetails: s.description || "",
          gst: s.gst || 0,
          applyGST: (s.gst || 0) > 0,
          showDetails: false,
          serviceId: s.serviceId || s._id,
        })),
      ];
      setItems(editItems);
    } else if (isOpen && !isEdit) {
      // Reset for a fresh new entry
      setFormData({
        date: new Date().toISOString().split("T")[0],
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        reference: "",
        clientName: "",
        contact: "",
        email: "",
        adults: 2,
        kids: 0,
        checkIn: "",
        checkOut: "",
        nights: 1,
        advance: 0,
      });
      setItems([]);
    }
  }, [isOpen, isEdit, initialData, type, quotationPrefix, reservationPrefix]);

  // Fetch Rooms and Services from API
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("authToken");

          if (token && !decodedUserId) {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const payload = JSON.parse(window.atob(base64));
            setDecodedUserId(
              payload.id || payload._id || payload.userId || payload.sub,
            );
          }

          // Fetch Rooms
          const roomsRes = await fetch(getApiUrl("rooms"), {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (roomsRes.ok) {
            const data = await roomsRes.json();

            const rooms = data.rooms || (Array.isArray(data) ? data : []);
            setRoomList(
              rooms.map((r: any) => ({
                _id: r._id,
                name: r.roomName || r.roomType,
                totalRooms:
                  typeof r.totalRooms === "number"
                    ? r.totalRooms
                    : parseInt(r.totalRooms || "0", 10) || 0,
              })),
            );
          }

          // Fetch Services
          const servicesRes = await fetch(getApiUrl("services"), {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (servicesRes.ok) {
            const data = await servicesRes.json();

            const services = data.services || (Array.isArray(data) ? data : []);
            setServiceList(
              services.map((s: any) => ({
                _id: s._id,
                name: s.serviceName,
              })),
            );
          }

          let quotPrefix = "SBQ";
          let resPrefix = "SBR";

          // Fetch Settings for Prefixes
          try {
            const settingsRes = await fetch(getApiUrl("settings"), {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (settingsRes.ok) {
              const data = await settingsRes.json();
              const settings =
                data.settings || (Array.isArray(data) ? data[0] : data);
              setFullSettings(settings);
              const pdfConfig = settings?.pdf || settings?.pdfConfig;
              if (pdfConfig) {
                quotPrefix = pdfConfig.quotationPrefix || "SBQ";
                resPrefix = pdfConfig.reservationPrefix || "SBR";
                setQuotationPrefix(quotPrefix);
                setReservationPrefix(resPrefix);
              }
            }
          } catch (e) {
            console.error("Error fetching settings prefix:", e);
          }

          // Fetch all bookings to calculate next sequence ID
          let nextSequenceStr = "01";
          try {
            const bookingsRes = await fetch(getApiUrl("bookings"), {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (bookingsRes.ok) {
              const bData = await bookingsRes.json();
              const bookingsList = bData.bookings || (Array.isArray(bData) ? bData : []);
              
              // Filter by exact type (quotation or reservation)
              const sameTypeBookings = bookingsList.filter((b: any) => b?.type === type);
              
              let maxSequenceNum = 0;
              sameTypeBookings.forEach((b: any) => {
                const bookingId = b?.bookingId || "";
                const parts = bookingId.split("-");
                if (parts.length > 1) {
                  const suffix = parts[parts.length - 1];
                  const num = parseInt(suffix, 10);
                  if (!isNaN(num) && num > maxSequenceNum) {
                    maxSequenceNum = num;
                  }
                }
              });
              
              const nextNum = maxSequenceNum + 1;
              nextSequenceStr = String(nextNum).padStart(2, "0");
            }
          } catch (err) {
            console.error("Error computing sequence ID:", err);
          }

          // Update initial reference ONLY if it is currently empty (for fresh new bookings)
          setFormData((prev) => {
            if (prev.reference && !prev.reference.includes("undefined") && prev.reference !== "")
              return prev;
            return {
              ...prev,
              reference: `${type === "reservation" ? resPrefix : quotPrefix}-${nextSequenceStr}`,
            };
          });

          // Force prefix swap for conversion if settings changed prefixes
          if (isOpen && initialData && type === "reservation" && !isEdit) {
            setFormData((prev) => {
              const parts = (initialData.bookingId || "").split("-");
              if (parts.length > 1) {
                return {
                  ...prev,
                  reference: `${resPrefix}-${parts[1]}`,
                };
              }
              return prev;
            });
          }
        } catch (err) {
          console.error("Error fetching modal data:", err);
        }
      };
      fetchData();
    }
  }, [isOpen, decodedUserId]);

  // Prevent scroll from changing number input values
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (
        document.activeElement &&
        document.activeElement.tagName === "INPUT" &&
        (document.activeElement as HTMLInputElement).type === "number"
      ) {
        (document.activeElement as HTMLInputElement).blur();
      }
    };

    if (isOpen) {
      window.addEventListener("wheel", handleWheel);
    }

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isOpen]);

  // Compute available rooms for selected dates (only confirmed reservations block inventory)
  useEffect(() => {
    if (!isOpen) return;

    const computeAvailability = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const checkIn = formData.checkIn ? new Date(formData.checkIn) : null;
        const checkOut = formData.checkOut ? new Date(formData.checkOut) : null;
        if (
          !checkIn ||
          !checkOut ||
          isNaN(checkIn.getTime()) ||
          isNaN(checkOut.getTime())
        )
          return;

        const res = await fetch(getApiUrl("bookings"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const all = data.bookings || (Array.isArray(data) ? data : []);

        const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) =>
          aStart < bEnd && bStart < aEnd; // [start, end)

        const confirmedReservations = all.filter(
          (b: any) =>
            b?.type === "reservation" &&
            b?.status === "Confirmed" &&
            b?.checkIn &&
            b?.checkOut,
        );

        const bookedByRoomName: Record<string, number> = {};
        for (const b of confirmedReservations) {
          // exclude current booking when editing
          if (isEdit && initialData?._id && b?._id === initialData._id)
            continue;

          const bStart = new Date(b.checkIn);
          const bEnd = new Date(b.checkOut);
          if (isNaN(bStart.getTime()) || isNaN(bEnd.getTime())) continue;
          if (!overlaps(checkIn, checkOut, bStart, bEnd)) continue;

          for (const r of b.rooms || []) {
            const name = r.roomName || r.roomType || "";
            const qty = Number(r.roomNumber || r.qty || r.quantity || 1) || 0;
            if (!name) continue;
            bookedByRoomName[name] = (bookedByRoomName[name] || 0) + qty;
          }
        }

        const next: Record<string, number> = {};
        for (const r of roomList) {
          const total = Number(r.totalRooms || 0) || 0;
          const booked = bookedByRoomName[r.name] || 0;
          next[r._id] = Math.max(0, total - booked);
        }

        setAvailableRoomsById(next);
      } catch (e) {
        console.error("Availability compute failed:", e);
      }
    };

    computeAvailability();
  }, [
    isOpen,
    formData.checkIn,
    formData.checkOut,
    roomList,
    isEdit,
    initialData?._id,
  ]);

  const handleRoomAdd = async (name: string, totalRoomsCount?: string) => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");
      const payload = {
        user: decodedUserId,
        totalRooms: parseInt(totalRoomsCount || "1", 10) || 1,
        roomName: name,
        roomType: name,
        description: "Standard Category",
        capacity: 2,
        basePrice: 0,
        gst: 18,
        status: "active",
      };

      const res = await fetch(getApiUrl("rooms"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Refresh the list
        const roomsRes = await fetch(getApiUrl("rooms"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (roomsRes.ok) {
          const data = await roomsRes.json();
          const rooms = data.rooms || (Array.isArray(data) ? data : []);
          setRoomList(
            rooms.map((r: any) => ({
              _id: r._id,
              name: r.roomName || r.roomType,
              totalRooms:
                typeof r.totalRooms === "number"
                  ? r.totalRooms
                  : parseInt(r.totalRooms || "0", 10) || 0,
            })),
          );
        }
      }
    } catch (err) {
      console.error("Error adding room from modal:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoomDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(getApiUrl(`rooms/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRoomList((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      console.error("Error deleting room from modal:", err);
    }
  };

  const handleServiceAdd = async (name: string) => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");
      const payload = {
        user: decodedUserId,
        serviceName: name,
        description: "Added from booking",
        price: 0,
        gst: 18,
        status: "active",
      };

      const res = await fetch(getApiUrl("services"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Refresh the list
        const servicesRes = await fetch(getApiUrl("services"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (servicesRes.ok) {
          const data = await servicesRes.json();
          const services = data.services || (Array.isArray(data) ? data : []);
          setServiceList(
            services.map((s: any) => ({
              _id: s._id,
              name: s.serviceName,
            })),
          );
        }
      }
    } catch (err) {
      console.error("Error adding service from modal:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleServiceDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(getApiUrl(`services/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setServiceList((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      console.error("Error deleting service from modal:", err);
    }
  };

  const handleCloudinaryUpload = async (bookingData: any) => {
    try {
      if (!fullSettings) return null;

      const pdfInstance = pdf(<PDFWrapper data={bookingData} settings={fullSettings || {}} />);
      const blob = await pdfInstance.toBlob();
      
      const base64data = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });

      const formData = new FormData();
      formData.append("file", blob, `${bookingData.bookingId}.pdf`); // Direct blob upload is better for RAW
      formData.append("upload_preset", "sb_hospitability_uploads");
      formData.append("resource_type", "raw");
      formData.append("folder", "avan_homes_docs");
      formData.append("public_id", `${bookingData.type}_${bookingData.bookingId}_v${Date.now()}.pdf`);

      const cloudName = "dwzfpa4vq";
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();

        return result.secure_url;
      }
      return null;
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      return null;
    }
  };

  const handleGenerateBooking = async () => {
    try {
      if (!formData.clientName || !formData.contact) {
        Swal.fire({
          title: "Missing Details",
          text: "Please fill in client details (Name & Contact)",
          icon: "warning",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#ea580c",
        });
        return;
      }

      if (items.length === 0) {
        Swal.fire({
          title: "No Items",
          text: "Please add at least one room or service to the booking",
          icon: "warning",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#ea580c",
        });
        return;
      }

      const invalidItems = items.filter(i => !i.price || i.price <= 0);
      if (invalidItems.length > 0) {
        Swal.fire({
          title: "Missing Amounts",
          text: "Please enter a valid amount (Rate) for all rooms and services",
          icon: "warning",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#ea580c",
        });
        return;
      }

      setIsSaving(true);
      const token = localStorage.getItem("authToken");

      // Calculate detailed payment breakdown
      let totalGST = 0;
      let subtotal = 0;

      const rooms = items
        .filter((i) => i.type === "room")
        .map((i) => {
          const originalRoom = roomList.find((r) => r.name === i.description);
          const nights = formData.nights || 1;
          const itemSubtotal = i.price * i.quantity * nights;
          const itemGST = i.applyGST ? itemSubtotal * ((i.gst || 0) / 100) : 0;
          subtotal += itemSubtotal;
          totalGST += itemGST;

          // Debugging log for each room item


          return {
            roomId: originalRoom?._id || i.roomId || null,
            roomName: i.description,
            // Use roomType as a primary storage for extra details if description is stripped by API
            // If extraDetails is empty, we fallback to roomName for roomType compatibility
            roomType: i.extraDetails || i.description,
            description: i.extraDetails || "",
            qty: i.quantity,
            rate: i.price,
            gst: i.applyGST ? i.gst || 0 : 0,
            total: itemSubtotal + itemGST,
          };
        });

      const services = items
        .filter((i) => i.type === "service")
        .map((i) => {
          const originalService = serviceList.find(
            (s) => s.name === i.description,
          );
          const itemSubtotal = i.price * i.quantity;
          const itemGST = i.applyGST ? itemSubtotal * ((i.gst || 0) / 100) : 0;
          subtotal += itemSubtotal;
          totalGST += itemGST;

          // Debugging log for each service item


          return {
            serviceId: originalService?._id || i.serviceId || null,
            serviceName: i.description,
            description: i.extraDetails || "",
            qty: i.quantity,
            rate: i.price,
            gst: i.applyGST ? i.gst || 0 : 0,
            total: itemSubtotal + itemGST,
          };
        });

      const payload = {
        user: decodedUserId,
        type: type,
        bookingId: formData.reference,
        clientName: formData.clientName,
        clientEmail: formData.email,
        clientContact: formData.contact,
        checkIn: formData.checkIn ? `${formData.checkIn}T11:00:00` : new Date().toISOString(),
        checkOut: formData.checkOut ? `${formData.checkOut}T11:00:00` : new Date().toISOString(),
        nights: formData.nights,
        guests: {
          adults: formData.adults || 1,
          kids: formData.kids || 0,
        },
        rooms: rooms,
        services: services,
        payment: {
          subtotal: subtotal,
          totalGST: totalGST,
          grandTotal: subtotal + totalGST,
          advancePaid: formData.advance,
          pendingAmount: subtotal + totalGST - formData.advance,
        },
        status: "Draft",
        roomBlocked: false,
        reservationDate: formData.date,
        validUntil: formData.validUntil,
        // Link to source quotation if converting or if already linked
        sourceQuotationId:
          !isEdit &&
          type === "reservation" &&
          initialData?._id &&
          initialData?.type === "quotation"
            ? initialData._id
            : initialData?.sourceQuotationId || null,
        sourceQuotationBookingId:
          !isEdit &&
          type === "reservation" &&
          initialData?._id &&
          initialData?.type === "quotation"
            ? initialData.bookingId || formData.reference
            : initialData?.sourceQuotationBookingId || null,
      };



      let apiUrl: string;
      let apiMethod: string;

      if (isEdit && initialData?._id) {
        apiUrl = getApiUrl(`bookings/${initialData._id}`);
        apiMethod = "PUT";
      } else {
        apiUrl = getApiUrl("bookings");
        apiMethod = "POST";
      }



      const response = await fetch(apiUrl, {
        method: apiMethod,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));


      if (!response.ok) {
        console.error("API Error Details:", {
          status: response.status,
          result,
          apiUrl,
          apiMethod,
        });
        throw new Error(
          result.message ||
            result.error ||
            `Failed to ${isEdit ? "update" : "create"} booking (${response.status})`,
        );
      }

      // Helper to extract numeric part of booking ID
      const getNumericId = (id: string) => {
        if (!id) return null;
        const parts = id.split("-");
        return parts.length > 1 ? parts[1] : parts[0];
      };

      // Success! Generate and Upload PDF to Cloudinary
      const newBooking = result.booking || result;
      const bookingDbId = newBooking._id || (isEdit ? initialData?._id : null);

      if (bookingDbId) {
        // Show a small loader for the upload process
        Swal.fire({
          title: "Syncing Document...",
          text: "Generating and uploading PDF to Cloudinary",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // We pass the full payload to PDF generation to ensure it has all latest data
        const cloudinaryUrl = await handleCloudinaryUpload({
          ...payload,
          _id: bookingDbId,
        });

        if (cloudinaryUrl) {
          // Save the Cloudinary PDF link to the booking record
          await fetch(getApiUrl(`bookings/${bookingDbId}`), {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ pdfData: cloudinaryUrl }),
          });
        }
        Swal.close();
      }

      if (isEdit) {
        // If this is a reservation, try to find and update the linked quotation
        if (type === "reservation") {
          try {

            const allRes = await fetch(getApiUrl("bookings"), {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (allRes.ok) {
              const allData = await allRes.json();
              const allBookings =
                allData.bookings || (Array.isArray(allData) ? allData : []);

              const currentNumericId = getNumericId(initialData?.bookingId);

              // Find linked quotation
              const linkedQuot = allBookings.find((b: any) => {
                if (b.type !== "quotation") return false;
                // 1. Direct link check (best)
                if (b.res_pk === initialData._id) return true;
                if (b._id === initialData?.sourceQuotationId) return true;
                // 2. Matching numeric ID and client info (fallback)
                const bNumeric = getNumericId(b.bookingId);
                return (
                  bNumeric &&
                  currentNumericId &&
                  bNumeric === currentNumericId &&
                  (b.clientName === initialData.clientName ||
                    b.clientEmail === initialData.clientEmail)
                );
              });

              if (linkedQuot) {
                const quotationPayload = {
                  ...payload,
                  type: "quotation",
                  bookingId: linkedQuot.bookingId, // Maintain original SBQ ID
                  status: "Accepted",
                  res_pk: initialData._id,
                };

                const syncResponse = await fetch(
                  getApiUrl(`bookings/${linkedQuot._id}`),
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(quotationPayload),
                  },
                );

                if (syncResponse.ok) {

                  // Optional: alert(`Quotation ${linkedQuot.bookingId} also updated!`);
                }
              }
            }
          } catch (syncErr) {
            console.error("Failed to sync with quotation:", syncErr);
          }
        }

        Swal.fire({
          title: "Success!",
          text: `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`,
          icon: "success",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#ea580c",
        }).then(() => {
          router.refresh();
          onClose();
        });
        return;
      }

      // If this was a conversion from a quotation, update the quotation
      if (type === "reservation" && initialData?._id && !isEdit) {
        try {
          const quotationUpdate = {
            ...payload,
            type: "quotation",
            bookingId: initialData.bookingId,
            status: "Accepted",
            res_pk: bookingDbId, // Link the new reservation back to the quotation
          };
          await fetch(getApiUrl(`bookings/${initialData._id}`), {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(quotationUpdate),
          });
        } catch (syncErr) {
          console.error("Failed to link reservation to quotation:", syncErr);
        }
      }

      // Success! Now trigger PDF download
      Swal.fire({
        title: "Success!",
        text: `${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`,
        icon: "success",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ea580c",
      }).then(() => {
        router.refresh();
        onClose();
      });
    } catch (err: any) {
      console.error("Booking submission error:", err);
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ea580c",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const totalCalculatedGST = items.reduce((sum, item) => {
    const nights = item.type === "room" ? formData.nights || 1 : 1;
    const itemTotal = item.price * item.quantity * nights;
    return sum + (item.applyGST ? itemTotal * ((item.gst || 0) / 100) : 0);
  }, 0);

  const subtotalAmount = items.reduce((sum, item) => {
    const nights = item.type === "room" ? formData.nights || 1 : 1;
    return sum + item.price * item.quantity * nights;
  }, 0);
  const grandTotal = subtotalAmount + totalCalculatedGST;
  const pendingAmount = grandTotal - formData.advance;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "email") {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setEmailError(value !== "" && !isValid);
    }
  };

  const addItem = (type: "room" | "service") => {
    const newItem: QuotationItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      description: "", // Initialize with empty string for better placeholder matching
      price: 0,
      quantity: 1,
      extraDetails: "",
      gst: globalGst,
      applyGST: true,
      showDetails: false,
    };
    setItems([...items, newItem]);
  };

  const handleGlobalGstChange = (val: number) => {
    setGlobalGst(val);
    // When changing global %, update the rate for all items that have GST enabled
    setItems(
      items.map((item) => ({
        ...item,
        gst: item.applyGST ? val : 0,
      })),
    );
  };

  const toggleAllGst = () => {
    // If any items have GST, we remove it from all. If none have it, we apply to all.
    const anyApplied = items.some((item) => item.applyGST);
    const targetState = !anyApplied;

    setItems(
      items.map((item) => ({
        ...item,
        applyGST: targetState,
        gst: targetState ? globalGst : 0,
      })),
    );
  };

  const updateItem = (id: string, field: keyof QuotationItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;

        // Handle ID updates when description changes
        if (field === "description") {
          if (item.type === "room") {
            const room = roomList.find((r) => r.name === value);
            return { ...item, description: value, roomId: room?._id };
          } else if (item.type === "service") {
            const service = serviceList.find((s) => s.name === value);
            return { ...item, description: value, serviceId: service?._id };
          }
        }

        // Clamp room quantity to availability (when we can compute it)
        if (item.type === "room" && field === "quantity") {
          const selectedRoom = roomList.find(
            (r: any) => r?.name === item.description,
          );
          const available = selectedRoom?._id
            ? availableRoomsById[selectedRoom._id]
            : undefined;
          if (typeof available === "number") {
            const nextQty = Math.max(
              0,
              Math.min(Number(value) || 0, available),
            );
            return { ...item, quantity: nextQty };
          }
        }

        if (field === "applyGST") {
          return {
            ...item,
            applyGST: value,
            gst: value ? globalGst : 0,
          };
        }

        return { ...item, [field]: value };
      }),
    );
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  if (!isOpen) return null;

  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Hide spin-buttons for Chrome, Safari, Edge, Opera */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none !important;
          margin: 0 !important;
        }

        /* Hide spin-buttons for Firefox */
        input[type="number"] {
          -moz-appearance: textfield !important;
          appearance: none !important;
        }
      `}} />
      <div className="fixed inset-0 z-[200] h-screen overflow-y-auto bg-black/90 backdrop-blur-xl animate-in fade-in duration-300 p-4 md:p-10 scrollbar-hide">
        <div
          className="min-h-full flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          {/* Modal Content */}
          <div className="bg-gray-900 border border-white/10 rounded-2xl md:rounded-[32px] w-full md:max-w-6xl relative z-10 p-6 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-10 shrink-0">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {isEdit ? "Edit" : "Create"}{" "}
                  {type === "reservation" ? "Reservation" : "Quotation"}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {isEdit
                    ? `Update the ${type} details for your client`
                    : `Generate a premium ${type} for your client`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all border border-white/5"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Body */}
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
              {/* General Details */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 ml-1 font-medium">
                  {type === "reservation" ? "Reservation" : "Quotation"} Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 ml-1 font-medium">
                  Valid Until
                </label>
                <input
                  type="date"
                  id="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all text-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2 animate-in fade-in duration-300">
                <label className="text-sm text-gray-400 ml-1 font-medium">
                  {type === "reservation" ? "Reservation" : "Quotation"} ID (Sequential)
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.reference || "Calculating sequential ID..."}
                  className={`w-full bg-orange-600/10 border border-orange-600/30 rounded-xl px-4 py-3 outline-none ${
                    !formData.reference 
                      ? "text-orange-500/50 animate-pulse font-medium" 
                      : "text-orange-500 font-black tracking-widest"
                  } cursor-not-allowed select-all`}
                />
              </div>

              {/* Client Details Section */}
              <div className="md:col-span-2 pt-4 border-t border-white/5">
                <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-4">
                  Client Details
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 ml-1 font-medium">
                  Prepared For (Client Name)
                </label>
                <input
                  type="text"
                  id="clientName"
                  placeholder="e.g. John Doe"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 ml-1 font-medium">
                  Phone Number (10 Digits)
                </label>
                <input
                  type="text"
                  id="contact"
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={formData.contact}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    handleInputChange(e);
                  }}
                  className="w-full bg-gray-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all text-white font-medium"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-gray-400 ml-1 font-medium">
                  Client Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all text-white font-medium"
                />
                {emailError && (
                  <p className="text-red-400 text-[10px] font-bold mt-1 ml-1 uppercase tracking-widest animate-pulse flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" /> Invalid Email
                    Format
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 ml-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Adults
                  </label>
                  <input
                    type="number"
                    id="adults"
                    min="1"
                    value={formData.adults}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all text-white font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 ml-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Kids
                  </label>
                  <input
                    type="number"
                    id="kids"
                    min="0"
                    value={formData.kids}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all text-white font-bold"
                  />
                </div>
              </div>

              {/* Booking Details Section */}
              <div className="md:col-span-2 pt-4 border-t border-white/5">
                <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-4">
                  Booking Details
                </h3>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 ml-1 font-medium">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    id="checkIn"
                    min={today}
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 ml-1 font-medium">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    id="checkOut"
                    min={formData.checkIn || today}
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 ml-1 font-medium">
                    No. of Nights (Auto)
                  </label>
                  <input
                    type="number"
                    readOnly
                    value={formData.nights}
                    className="w-full bg-gray-800/30 border border-white/5 rounded-xl px-4 py-3 outline-none text-orange-600 font-bold cursor-not-allowed"
                  />
                </div>

                {type === "reservation" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 ml-1 font-medium flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5" /> Advance Amount
                      </label>
                      <input
                        type="number"
                        id="advance"
                        value={formData.advance}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all text-white font-bold"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 ml-1 font-medium flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5" /> Pending Amount
                      </label>
                      <input
                        type="number"
                        readOnly
                        value={pendingAmount}
                        className="w-full bg-gray-800/30 border border-white/5 rounded-xl px-4 py-3 outline-none text-red-400 font-bold cursor-not-allowed"
                        placeholder="0.00"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Pricing & Items Section */}
              <div className="md:col-span-2 pt-4 border-t border-white/5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                      Pricing & Items
                    </h3>
                    <div className="flex items-center gap-2 bg-gray-800/80 px-3 py-1.5 rounded-lg border border-white/5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                        GST %
                      </label>
                      <select
                        value={globalGst}
                        onChange={(e) =>
                          handleGlobalGstChange(Number(e.target.value))
                        }
                        className="bg-transparent text-orange-600 text-xs font-bold outline-none cursor-pointer"
                      >
                        <option value="0" className="bg-gray-900 text-white">
                          0%
                        </option>
                        <option value="5" className="bg-gray-900 text-white">
                          5%
                        </option>
                        <option value="12" className="bg-gray-900 text-white">
                          12%
                        </option>
                        <option value="18" className="bg-gray-900 text-white">
                          18%
                        </option>
                        <option value="28" className="bg-gray-900 text-white">
                          28%
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 w-full sm:flex-row sm:w-auto items-center">
                    {/* Mobile Row for Add Buttons */}
                    <div className="grid grid-cols-2 gap-3 w-full sm:flex sm:w-auto">
                      {/* Add Room Split Button */}
                      <div className="flex items-stretch w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => addItem("room")}
                          className="flex-1 sm:flex-none pl-4 pr-3 py-2.5 bg-white/5 hover:bg-white/10 rounded-l-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border border-white/10 border-r-0 text-white group"
                        >
                          <Plus className="w-3.5 h-3.5 text-orange-600 group-hover:scale-110 transition-transform" />{" "}
                          Add Room
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setManagerTitle("Manage Rooms");
                            setIsListManagerOpen(true);
                          }}
                          className="px-2.5 bg-white/5 hover:bg-white/10 rounded-r-xl border border-white/10 transition-all flex items-center justify-center"
                          title="Room Settings"
                        >
                          <Settings className="w-3.5 h-3.5 text-orange-600" />
                        </button>
                      </div>

                      {/* Add Service Split Button */}
                      <div className="flex items-stretch w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => addItem("service")}
                          className="flex-1 sm:flex-none pl-4 pr-3 py-2.5 bg-white/5 hover:bg-white/10 rounded-l-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border border-white/10 border-r-0 text-white group"
                        >
                          <Plus className="w-3.5 h-3.5 text-orange-600 group-hover:scale-110 transition-transform" />{" "}
                          Add Service
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setManagerTitle("Manage Services");
                            setIsListManagerOpen(true);
                          }}
                          className="px-2.5 bg-white/5 hover:bg-white/10 rounded-r-xl border border-white/10 transition-all flex items-center justify-center"
                          title="Service Settings"
                        >
                          <Settings className="w-3.5 h-3.5 text-orange-600" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={toggleAllGst}
                      className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${items.some((i) => i.applyGST) ? "bg-orange-600 text-white border-orange-600" : "bg-white/5 hover:bg-white/10 border-white/10 text-white group"}`}
                    >
                      <Plus
                        className={`w-3.5 h-3.5 transition-transform ${items.some((i) => i.applyGST) ? "rotate-45" : "group-hover:scale-110"}`}
                      />
                      {items.some((i) => i.applyGST) ? "Remove" : "Apply"} GST (
                      {globalGst}%)
                    </button>
                  </div>
                </div>

                {/* Dynamic Items List */}
                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/5 border border-white/5 p-5 rounded-[24px] animate-in slide-in-from-right-4 duration-300"
                    >
                      <div className="flex flex-col gap-4">
                        {/* Row 1: Header (Bullet, Badge, Actions) */}
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.4)]" />
                            <div className="bg-gray-800 border border-white/10 rounded-lg px-2 py-1 text-[7px] font-black text-orange-600 uppercase tracking-tighter text-center">
                              {item.type}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                              <input
                                type="checkbox"
                                checked={item.applyGST}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "applyGST",
                                    e.target.checked,
                                  )
                                }
                                className="w-3.5 h-3.5 rounded border-white/10 bg-gray-900 text-orange-600 focus:ring-orange-600/20 cursor-pointer"
                              />
                              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                                GST
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Row 2: Inputs (Selection, Qty, Rate) */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          <div className="sm:col-span-6 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 relative">
                                {item.type === "room" ||
                                item.type === "service" ? (
                                  <>
                                    <select
                                      value={item.description || ""}
                                      onChange={(e) =>
                                        updateItem(
                                          item.id,
                                          "description",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-orange-600 text-sm sm:text-xs text-white appearance-none cursor-pointer font-medium"
                                    >
                                      <option
                                        value=""
                                        disabled={!!item.description}
                                      >
                                        {item.type === "room"
                                          ? "Select Room"
                                          : "Select Service"}
                                      </option>
                                      {(item.type === "room"
                                        ? roomList.filter((r: any) => {
                                            const available =
                                              availableRoomsById[r._id];
                                            const isSelected =
                                              r.name === item.description ||
                                              r._id === (item as any).roomId;
                                            return (
                                              isSelected ||
                                              (available === undefined
                                                ? true
                                                : available > 0)
                                            );
                                          })
                                        : serviceList
                                      ).map((opt: any) => {
                                        if (typeof opt === "string")
                                          return (
                                            <option key={opt} value={opt}>
                                              {opt}
                                            </option>
                                          );
                                        const available =
                                          item.type === "room"
                                            ? availableRoomsById[opt._id]
                                            : undefined;
                                        const availableLabel =
                                          item.type === "room" &&
                                          available !== undefined
                                            ? ` (${available} available)`
                                            : "";
                                        return (
                                          <option
                                            key={opt._id}
                                            value={opt.name}
                                          >
                                            {opt.name}
                                            {availableLabel}
                                          </option>
                                        );
                                      })}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                      <ChevronRight className="w-3.5 h-3.5 text-gray-500 rotate-90" />
                                    </div>
                                  </>
                                ) : (
                                  <input
                                    type="text"
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) =>
                                      updateItem(
                                        item.id,
                                        "description",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-orange-600 text-sm sm:text-xs text-white font-medium"
                                  />
                                )}
                              </div>
                              {(item.type === "room" ||
                                item.type === "service") && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateItem(
                                      item.id,
                                      "showDetails",
                                      !item.showDetails,
                                    )
                                  }
                                  className={`p-2 rounded-xl border transition-all shrink-0 ${item.showDetails ? "bg-orange-600 text-white border-orange-600" : "bg-white/5 border-white/10 text-orange-600"}`}
                                >
                                  <Plus
                                    className={`w-3.5 h-3.5 transition-transform duration-300 ${item.showDetails ? "rotate-45" : ""}`}
                                  />
                                </button>
                              )}
                            </div>

                            {/* Explicit Spacer to prevent sticking */}
                            {item.showDetails && <div />}

                            {/* Extra Details (Under Dropdown) */}
                            {item.showDetails && (
                              <div className="animate-in slide-in-from-top-2 duration-300">
                                <div className="relative">
                                  <span className="absolute -top-2 left-2 px-1 bg-gray-900 text-[8px] text-gray-500 font-bold uppercase z-10">
                                    Extra Details
                                  </span>
                                  <input
                                    type="text"
                                    placeholder="e.g. Bed type, View, etc."
                                    value={item.extraDetails}
                                    onChange={(e) =>
                                      updateItem(
                                        item.id,
                                        "extraDetails",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full bg-gray-900/50 border border-white/5 rounded-xl px-4 py-2 outline-none focus:border-orange-600 text-xs text-white font-medium placeholder:text-gray-500"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="sm:col-span-6 flex items-center gap-2">
                            {item.type === "room" && (
                              <div className="w-12 shrink-0">
                                <input
                                  type="text"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateItem(
                                      item.id,
                                      "quantity",
                                      parseInt(
                                        e.target.value.replace(/[^0-9]/g, ""),
                                      ) || 0,
                                    )
                                  }
                                  className="w-full bg-gray-900 border border-white/10 rounded-xl py-2 outline-none focus:border-orange-600 text-[10px] text-white text-center font-bold"
                                  title="Rooms"
                                  placeholder="Qty"
                                />
                              </div>
                            )}

                            <div className="flex-1 relative">
                              <input
                                type="number"
                                value={item.price}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "price",
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                className={`w-full bg-gray-900 border ${!item.price || item.price <= 0 ? "border-red-500/50 ring-2 ring-red-500/10" : "border-white/10"} rounded-xl pl-6 pr-2 py-2 outline-none focus:border-orange-600 text-[10px] text-white font-black text-right transition-all`}
                                placeholder="Rate"
                                required
                              />
                              <IndianRupee className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-orange-600" />
                            </div>

                            {item.applyGST ? (
                              <div className="flex-1 flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2 min-w-[140px] animate-in fade-in slide-in-from-right-2">
                                <div className="flex items-center gap-1.5 flex-1">
                                  <span className="text-[8px] font-bold text-gray-500 uppercase whitespace-nowrap">
                                    GST
                                  </span>
                                  <input
                                    type="number"
                                    value={item.gst}
                                    onChange={(e) => {
                                      const val =
                                        parseFloat(e.target.value) || 0;
                                      updateItem(item.id, "gst", val);
                                      updateItem(item.id, "applyGST", val > 0);
                                    }}
                                    className="w-8 bg-transparent text-[11px] font-black text-orange-600 outline-none text-center"
                                  />
                                  <span className="text-[10px] font-bold text-orange-600/50">
                                    %
                                  </span>
                                </div>
                                <div className="w-px h-6 bg-white/10 shrink-0" />
                                <div className="flex items-center gap-2 flex-1 justify-end">
                                  <span className="text-[8px] font-bold text-gray-500 uppercase whitespace-nowrap">
                                    Tax
                                  </span>
                                  <span className="text-[11px] font-black text-white whitespace-nowrap">
                                    ₹
                                    {(
                                      item.price *
                                      item.quantity *
                                      (item.type === "room"
                                        ? formData.nights
                                        : 1) *
                                      (item.gst / 100)
                                    ).toFixed(0)}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex-1" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="py-10 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-gray-500">
                      <FileText className="w-8 h-8 opacity-20 mb-2" />
                      <p className="text-xs font-medium">
                        No items added yet. Click above to add rooms or
                        services.
                      </p>
                    </div>
                  )}
                </div>

                {/* Total Section */}
                <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-center sm:text-left">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Grand Total
                    </h4>
                    <p className="text-gray-500 text-xs mt-1">
                      Total quotation amount including taxes
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-black text-white">
                      ₹
                      {grandTotal.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-2 pt-8 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={handleGenerateBooking}
                  disabled={isSaving}
                  className="w-full sm:flex-1 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-black transition-all hover:shadow-lg hover:shadow-orange-600/20 flex items-center justify-center gap-2 uppercase tracking-widest text-sm disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                  <span>
                    {isSaving
                      ? "Processing..."
                      : isEdit
                        ? "Update & Save Changes"
                        : type === "reservation"
                          ? "Create Reservation"
                          : "Generate Quotation"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setItems([]);
                    setFormData((prev) => ({
                      ...prev,
                      clientName: "",
                      contact: "",
                      email: "",
                      advance: 0,
                    }));
                  }}
                  className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all border border-white/5"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ListManagerModal
        isOpen={isListManagerOpen}
        onClose={() => setIsListManagerOpen(false)}
        title={managerTitle}
        items={
          managerTitle.includes("Rooms")
            ? roomList.map((r) => (typeof r === "string" ? r : `${r.name}::${r.totalRooms || 0}`))
            : serviceList.map((s) => (typeof s === "string" ? s : s.name))
        }
        onAdd={(name, extra) => {
          if (managerTitle.includes("Rooms")) handleRoomAdd(name, extra);
          else handleServiceAdd(name);
        }}
        onRemove={(index) => {
          const list = managerTitle.includes("Rooms") ? roomList : serviceList;
          const itemToDelete = list[index];
          if (itemToDelete?._id) {
            if (managerTitle.includes("Rooms"))
              handleRoomDelete(itemToDelete._id);
            else handleServiceDelete(itemToDelete._id);
          } else {
            // Fallback for local items
            if (managerTitle.includes("Rooms"))
              setRoomList(roomList.filter((_, i) => i !== index));
            else setServiceList(serviceList.filter((_, i) => i !== index));
          }
        }}
      />
    </React.Fragment>
  );
}
