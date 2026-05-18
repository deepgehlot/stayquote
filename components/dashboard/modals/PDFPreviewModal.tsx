"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Loader2, 
  Calendar, 
  Users, 
  Clock 
} from 'lucide-react';
import { PDFViewer, PDFDownloadLink, pdf } from '@react-pdf/renderer';
import PDFWrapper from '../pdf/PDFWrapper';
import { getApiUrl } from '@/lib/api';

// Helper to convert numbers to Indian Rupees in words
const toWords = (num: number): string => {
  const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  const nToW = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + 'hundred ' + (n % 100 !== 0 ? nToW(n % 100) : '');
    if (n < 100000) return nToW(Math.floor(n / 1000)) + 'thousand ' + (n % 1000 !== 0 ? nToW(n % 1000) : '');
    if (n < 10000000) return nToW(Math.floor(n / 100000)) + 'lakh ' + (n % 100000 !== 0 ? nToW(n % 100000) : '');
    return nToW(Math.floor(n / 10000000)) + 'crore ' + (n % 10000000 !== 0 ? nToW(n % 10000000) : '');
  };

  const words = nToW(Math.floor(num));
  return words ? words.charAt(0).toUpperCase() + words.slice(1).trim() : '';
};

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: any;
  settings?: any;
}

const PDFPreviewModal = ({ isOpen, onClose, bookingData, settings: propSettings }: PDFPreviewModalProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [scale, setScale] = useState(1);
  const [settings, setSettings] = useState<any>(propSettings || null);
  const [loading, setLoading] = useState(!propSettings);
  const [isRendering, setIsRendering] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [openingNative, setOpeningNative] = useState(false);

  const openInNativeViewer = async () => {
    if (!bookingData || !settings) return;
    try {
      setOpeningNative(true);
      
      // Compile the React-PDF document dynamically to a Blob
      const doc = <PDFWrapper data={bookingData} settings={settings} />;
      const pdfInstance = pdf(doc);
      const blob = await pdfInstance.toBlob();
      
      // Create a local blob URL
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger the download/native viewer
      const link = document.createElement('a');
      link.href = url;
      link.download = `${bookingData?.bookingId || bookingData?.reference || 'DOCUMENT'} - ${(bookingData?.clientName || 'Guest').toUpperCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Failed to generate native PDF preview:", error);
    } finally {
      setOpeningNative(false);
    }
  };

  useEffect(() => {
    if (isOpen && isMobile && settings && !loading && !isRendering) {
      const timer = setTimeout(() => {
        openInNativeViewer();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMobile, !!settings, loading, isRendering]);

  useEffect(() => {
    setIsClient(true);
    // Detect mobile device & calculate dynamic scale to fit the exact A4 layout to the screen
    const updateDimensions = () => {
      const isMob = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMob);
      
      if (isMob) {
        const containerWidth = window.innerWidth - 32; // 16px padding on left & right
        const targetWidth = 794;
        const newScale = Math.min(containerWidth / targetWidth, 1);
        setScale(newScale);
      } else {
        setScale(1);
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsRendering(true);
      
      const fileName = `${bookingData?.bookingId || bookingData?.reference || (bookingData?.type || 'DOC').toUpperCase()} - ${(bookingData?.clientName || 'Guest').toUpperCase()}`;
      const originalTitle = document.title;
      document.title = fileName;

      if (!propSettings) {
        fetchSettings();
      } else {
        setSettings(propSettings);
        setLoading(false);
        setIsRendering(false);
      }

      return () => {
        document.title = originalTitle;
      };
    }
  }, [isOpen, propSettings, bookingData]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(getApiUrl("settings"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const s = data.settings || (Array.isArray(data) ? data[0] : data);
        setSettings(s);
        setIsRendering(false);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Data Normalization (same as Layouts)
  const normalizedData = useMemo(() => {
    if (!bookingData) return null;
    const clientPhone = bookingData?.clientPhone || bookingData?.clientContact || "N/A";
    const taxAmount = bookingData?.payment?.totalGST || bookingData?.tax || bookingData?.gst || 0;
    const subtotalAmount = bookingData?.payment?.subtotal || bookingData?.subtotal || 0;
    const grandTotalAmount = bookingData?.payment?.grandTotal || bookingData?.total || 0;
    const guestCount = typeof bookingData?.guests === 'object' 
      ? (Number(bookingData.guests.adults || 0) + Number(bookingData.guests.kids || 0)) 
      : (bookingData?.guests || 0);
    const formattedGuests = typeof bookingData?.guests === 'object'
      ? `${bookingData.guests.adults || 0} Adults${bookingData.guests.kids ? `, ${bookingData.guests.kids} Kids` : ""}`
      : `${bookingData?.guests || 0} Guests`;
    const createdDate = bookingData?.reservationDate || bookingData?.createdAt;
    const advancePaid = bookingData?.payment?.advancePaid || 0;
    const balanceDue = bookingData?.payment?.pendingAmount || (grandTotalAmount - advancePaid);
    const isReservation = bookingData?.type === "reservation";
    const hasGST = taxAmount > 0;

    return {
      clientPhone,
      taxAmount,
      subtotalAmount,
      grandTotalAmount,
      guestCount,
      formattedGuests,
      createdDate,
      advancePaid,
      balanceDue,
      isReservation,
      hasGST
    };
  }, [bookingData]);

  if (!isOpen || !isClient) return null;

  const brandColor = settings?.pdf?.color || "#ea580c";
  const propertyTitle = settings?.title || "SHAPESBYTES";
  const layoutStyle = settings?.pdf?.layout || 'Modern';

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toISOString().split("T")[0];
    } catch (e) {
      return dateStr;
    }
  };

  // Renders the high-fidelity A4-matched HTML layout
  const renderA4HTMLLayout = () => {
    const isPreview = settings?.isPreview;
    const gst = isPreview ? "08ABWFA8226H1ZY" : settings?.bankDetails?.gstNumber;
    const phone = isPreview ? "+91 88902 77537" : settings?.phoneNumber;
    const email = isPreview ? "CONTACT@SHAPESBYTES.IN" : settings?.email;
    const website = isPreview ? "WWW.SHAPESBYTES.IN" : settings?.websiteLink;
    const address = isPreview ? "123, DEMO BUSINESS PARK, SECTOR 5, JODHPUR, RAJASTHAN - 342001" : settings?.address || "N/A";

    const items = (bookingData?.rooms || []).concat(bookingData?.services || []);

    switch (layoutStyle) {
      case 'Classic':
        return (
          <div className="flex-1 bg-white p-10 select-none text-[10px] leading-normal font-sans" style={{ color: '#1e293b' }}>
            {/* Header - Classic Centered with Double Divider */}
            <div className="flex flex-col items-center mb-6">
              {(settings?.profilePicture || settings?.logo) && (
                <img
                  src={settings.profilePicture || settings.logo}
                  alt="Logo"
                  className="w-14 h-14 rounded-full mb-3 object-cover border border-gray-100 shadow-sm"
                />
              )}
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] mb-1" style={{ color: brandColor }}>
                {propertyTitle}
              </h2>
              <div className="w-full h-[2px] mb-2" style={{ backgroundColor: brandColor }} />
              
              <div className="flex flex-col items-center text-center text-[7.5px] uppercase tracking-wider text-slate-500 font-semibold space-y-0.5">
                <p>{address}</p>
                <p>
                  GSTIN: {gst || "N/A"} • PHONE: {phone || "N/A"} • EMAIL: {email || "N/A"}
                </p>
                {website && <p>WEBSITE: {website}</p>}
              </div>
              <div className="w-full h-[1px] mt-3" style={{ backgroundColor: brandColor, opacity: 0.2 }} />
            </div>

            {/* Document Type & ID */}
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter" style={{ color: brandColor }}>
                  {bookingData?.type === "quotation" ? "Quotation" : "Reservation"}
                </h3>
                <div className="w-12 h-1 mt-0.5" style={{ backgroundColor: brandColor }} />
              </div>
              <div className="text-right">
                <p className="text-[7px] text-gray-400 uppercase font-black tracking-wider">
                  {bookingData?.type} ID
                </p>
                <p className="text-xs font-bold uppercase" style={{ color: brandColor }}>
                  {bookingData?.bookingId || "AVH-DEMO"}
                </p>
              </div>
            </div>

            {/* Stay Info Section - Centered Grid */}
            <div className="mb-6 border rounded-sm overflow-hidden" style={{ borderColor: brandColor }}>
              <div className="flex text-white py-1.5 font-bold uppercase tracking-wider text-[7px]" style={{ backgroundColor: brandColor }}>
                <span className="flex-1 text-center">Check-In Date</span>
                <span className="flex-1 text-center">Check-Out Date</span>
                <span className="flex-1 text-center">No. of Nights</span>
                <span className="flex-1 text-center">No. of Guests</span>
              </div>
              <div className="flex py-2 text-[10px] font-black" style={{ color: brandColor }}>
                <span className="flex-1 text-center">{formatDate(bookingData?.checkIn)}</span>
                <span className="flex-1 text-center">{formatDate(bookingData?.checkOut)}</span>
                <span className="flex-1 text-center">{bookingData?.nights || "0"}</span>
                <span className="flex-1 text-center">{normalizedData?.guestCount}</span>
              </div>
            </div>

            {/* Information Grid */}
            <div className="mb-6">
              <div className="border flex flex-wrap rounded-sm overflow-hidden bg-white" style={{ borderColor: brandColor }}>
                <div className="w-1/4 p-2 border-b border-r text-[7px] font-bold text-gray-400 uppercase" style={{ borderColor: brandColor }}>DATE</div>
                <div className="w-1/4 p-2 border-b border-r font-bold" style={{ borderColor: brandColor, color: brandColor }}>{formatDate(normalizedData?.createdDate)}</div>
                <div className="w-1/4 p-2 border-b border-r text-[7px] font-bold text-gray-400 uppercase" style={{ borderColor: brandColor }}>PREPARED FOR</div>
                <div className="w-1/4 p-2 border-b font-bold uppercase" style={{ borderColor: brandColor, color: brandColor }}>{bookingData?.clientName || "DEMO CLIENT"}</div>

                <div className="w-1/4 p-2 border-b border-r text-[7px] font-bold text-gray-400 uppercase" style={{ borderColor: brandColor }}>VALID UNTIL</div>
                <div className="w-1/4 p-2 border-b border-r font-bold" style={{ borderColor: brandColor, color: brandColor }}>{formatDate(bookingData?.validUntil)}</div>
                <div className="w-1/4 p-2 border-b border-r text-[7px] font-bold text-gray-400 uppercase" style={{ borderColor: brandColor }}>CONTACT</div>
                <div className="w-1/4 p-2 border-b font-bold" style={{ borderColor: brandColor, color: brandColor }}>{normalizedData?.clientPhone}</div>

                <div className="w-1/4 p-2 border-r text-[7px] font-bold text-gray-400 uppercase" style={{ borderColor: brandColor }}>{bookingData?.type} ID</div>
                <div className="w-1/4 p-2 border-r font-bold uppercase" style={{ borderColor: brandColor, color: brandColor }}>{bookingData?.bookingId || "AVH-DEMO"}</div>
                <div className="w-1/4 p-2 border-r text-[7px] font-bold text-gray-400 uppercase" style={{ borderColor: brandColor }}>CLIENT EMAIL</div>
                <div className="w-1/4 p-2 font-bold" style={{ color: brandColor }}>{bookingData?.clientEmail || "N/A"}</div>
              </div>
            </div>

            {/* Pricing Table */}
            <div className="mb-4 border rounded-sm overflow-hidden" style={{ borderColor: brandColor }}>
              <div className="flex text-white font-black text-[7px] uppercase tracking-wider py-2" style={{ backgroundColor: brandColor }}>
                <span className="w-[8%] text-center border-r border-white/20">#</span>
                <span className="flex-1 px-3 border-r border-white/20">DESCRIPTION</span>
                <span className="w-[10%] text-right pr-4 border-r border-white/20">QTY</span>
                <span className="w-[15%] text-right pr-4 border-r border-white/20">RATE</span>
                {normalizedData?.hasGST && <span className="w-[12%] text-right pr-4 border-r border-white/20">GST (%)</span>}
                <span className="w-[18%] text-right pr-6">TOTAL</span>
              </div>

              {items.map((item: any, i: number) => (
                <div key={i} className="flex border-b text-[8px] font-medium" style={{ borderColor: brandColor }}>
                  <span className="w-[8%] py-2.5 text-center border-r" style={{ borderColor: brandColor, color: brandColor }}>{i + 1}</span>
                  <div className="flex-1 py-2.5 px-3 border-r flex flex-col justify-center" style={{ borderColor: brandColor }}>
                    <span className="font-bold" style={{ color: brandColor }}>{item.roomName || item.serviceName}</span>
                    {item.description && <span className="text-[6.5px] text-gray-400 mt-0.5">{item.description}</span>}
                  </div>
                  <span className="w-[10%] py-2.5 text-right pr-4 border-r" style={{ borderColor: brandColor, color: brandColor }}>{item.qty || bookingData?.nights}</span>
                  <span className="w-[15%] py-2.5 text-right pr-4 border-r" style={{ borderColor: brandColor, color: brandColor }}>{Number(item.rate).toFixed(2)}</span>
                  {normalizedData?.hasGST && (
                    <span className="w-[12%] py-2.5 text-right pr-4 border-r" style={{ borderColor: brandColor, color: brandColor }}>{item.gst || 0}%</span>
                  )}
                  <span className="w-[18%] py-2.5 text-right pr-6 font-bold" style={{ color: brandColor }}>{Number(item.total).toFixed(2)}</span>
                </div>
              ))}

              {/* TOTAL GST */}
              {normalizedData?.hasGST && (
                <div className="flex border-b text-[7.5px]" style={{ borderColor: brandColor }}>
                  <span className="flex-1 py-1.5" />
                  <span className="w-[20%] py-1.5 text-right pr-2 font-black uppercase border-l" style={{ borderColor: brandColor, color: brandColor }}>TOTAL GST</span>
                  <span className="w-[18%] py-1.5 text-right pr-6 font-black" style={{ color: brandColor }}>Rs. {Number(normalizedData?.taxAmount).toLocaleString()}</span>
                </div>
              )}

              {/* SUBTOTAL */}
              <div className="flex border-b text-[7.5px]" style={{ borderColor: brandColor }}>
                <span className="flex-1 py-1.5" />
                <span className="w-[20%] py-1.5 text-right pr-2 font-black uppercase border-l" style={{ borderColor: brandColor, color: brandColor }}>SUBTOTAL</span>
                <span className="w-[18%] py-1.5 text-right pr-6 font-black" style={{ color: brandColor }}>Rs. {Number(normalizedData?.subtotalAmount).toLocaleString()}</span>
              </div>

              {/* ADVANCE PAID & BALANCE */}
              {normalizedData?.isReservation && (
                <>
                  <div className="flex border-b text-[7.5px]" style={{ borderColor: brandColor }}>
                    <span className="flex-1 py-1.5" />
                    <span className="w-[20%] py-1.5 text-right pr-2 font-black uppercase border-l" style={{ borderColor: brandColor, color: brandColor }}>ADVANCE PAID</span>
                    <span className="w-[18%] py-1.5 text-right pr-6 font-black" style={{ color: brandColor }}>Rs. {Number(normalizedData?.advancePaid).toLocaleString()}</span>
                  </div>
                  <div className="flex border-b text-[7.5px]" style={{ borderColor: brandColor }}>
                    <span className="flex-1 py-1.5" />
                    <span className="w-[20%] py-1.5 text-right pr-2 font-black uppercase border-l" style={{ borderColor: brandColor, color: brandColor }}>REMAINING</span>
                    <span className="w-[18%] py-1.5 text-right pr-6 font-black" style={{ color: brandColor }}>Rs. {Number(normalizedData?.balanceDue).toLocaleString()}</span>
                  </div>
                </>
              )}

              {/* GRAND TOTAL */}
              <div className="flex items-center text-white py-2.5 font-bold" style={{ backgroundColor: brandColor }}>
                <span className="flex-1 text-right pr-4 text-[8px] uppercase tracking-wider">Grand Total :</span>
                <span className="w-[18%] text-right pr-6 text-[9.5px]">Rs. {Number(normalizedData?.grandTotalAmount).toLocaleString()}</span>
              </div>
            </div>

            {/* Amount in words */}
            <div className="flex items-center mb-6">
              <span className="text-[7.5px] font-black uppercase tracking-tighter shrink-0" style={{ color: brandColor }}>Amount in Words: Rupees</span>
              <div className="flex-1 mx-2 border-b h-4 flex justify-center items-center" style={{ borderColor: brandColor }}>
                <span className="text-[8px] italic font-semibold text-center" style={{ color: brandColor }}>
                  {bookingData?.totalInWords || toWords(normalizedData?.grandTotalAmount || 0)}
                </span>
              </div>
              <span className="text-[7.5px] font-black uppercase tracking-tighter shrink-0" style={{ color: brandColor }}>Only</span>
            </div>

            {/* Footer Section */}
            <div className="flex gap-6 items-start mt-6 pt-4 border-t border-slate-100">
              {/* Bank details */}
              <div className="w-[45%] border rounded-sm overflow-hidden" style={{ borderColor: brandColor }}>
                <div className="py-1 px-2.5 text-white font-bold text-[6.5px] uppercase tracking-wider" style={{ backgroundColor: brandColor }}>
                  Bank Account Details
                </div>
                {[
                  { label: "Account Name", value: isPreview ? "ShapesBytes" : settings?.bankDetails?.accountName || "N/A" },
                  { label: "Bank Name", value: isPreview ? "AXIS BANK LTD" : settings?.bankDetails?.bankName || "N/A" },
                  { label: "Branch", value: isPreview ? "NINE MILE ROAD RJ" : settings?.bankDetails?.branchName || "N/A" },
                  { label: "Account No.", value: isPreview ? "921020057962261" : settings?.bankDetails?.accountNumber || "N/A" },
                  { label: "IFSC Code", value: isPreview ? "UTIB0004728" : settings?.bankDetails?.ifscCode || "N/A" },
                  { label: "Account Type", value: isPreview ? "Current Account" : settings?.bankDetails?.accountType || "N/A" },
                ].map((item, i) => (
                  <div key={i} className="flex border-b last:border-b-0" style={{ borderColor: brandColor }}>
                    <div className="w-24 p-1 border-r bg-gray-50 text-[5.5px] font-bold text-gray-400 uppercase" style={{ borderColor: brandColor }}>{item.label}</div>
                    <div className="flex-1 p-1 text-[5.5px] font-black" style={{ color: brandColor }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Terms & Policies */}
              <div className="flex-1 flex gap-6 text-[6.5px]">
                <div>
                  <h4 className="font-black uppercase tracking-wider mb-1" style={{ color: brandColor }}>Payment Terms</h4>
                  {(settings?.paymentTerms || ["50% advance to confirm.", "50% due 48 hours before check-in.", "Full payment before check-in."]).slice(0, 3).map((term: string, i: number) => (
                    <p key={i} className="text-gray-500 mb-0.5">• {term}</p>
                  ))}
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-wider mb-1" style={{ color: brandColor }}>Cancellation Policy</h4>
                  {(settings?.cancellationPolicies || ["60+ days: 100% refund.", "30-60 days: 50% refund.", "Less than 30 days: No refund."]).slice(0, 3).map((policy: string, i: number) => (
                    <p key={i} className="text-gray-500 mb-0.5">• {policy}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'Elite':
        const darkColor = "#2b3445";
        const tagline = settings?.isPreview ? "123, DEMO BUSINESS PARK, SECTOR 5, JODHPUR" : settings?.address?.substring(0, 50) || "Company Tagline Here";
        return (
          <div className="flex-1 bg-white relative select-none text-[10px] leading-normal font-sans" style={{ color: '#1e293b' }}>
            {/* Top Header Section with Angled Polygons via inline SVG */}
            <div className="relative h-[120px] w-full overflow-hidden">
              <svg height="120" width="100%" className="absolute top-0 left-0 right-0">
                <polygon points="0,0 260,0 200,120 0,120" fill={darkColor} />
                <polygon points="260,0 290,0 230,120 200,120" fill={brandColor} opacity={0.5} />
                <polygon points="290,0 340,0 280,120 230,120" fill={brandColor} />
              </svg>
              
              <div className="absolute inset-0 flex flex-row items-start px-10 pt-8 z-10">
                {/* Left Logo & Name - sits on dark navy background, text should be white */}
                <div className="flex-1 flex flex-row items-center gap-3 text-white">
                  {(settings?.profilePicture || settings?.logo) ? (
                    <img
                      src={settings.profilePicture || settings.logo}
                      alt="Logo"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-40 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg" style={{ backgroundColor: brandColor }}>
                      {propertyTitle.charAt(0)}
                    </div>
                  )}
                  <div className="w-44 space-y-0.5 mt-0.5 text-left">
                    <h2 className="text-white text-[16px] font-black uppercase tracking-wider leading-none mb-1">{propertyTitle}</h2>
                    {(phone || email) && (
                      <p className="text-gray-300 text-[5px] uppercase leading-none pt-0.5">
                        {[phone, email].filter(Boolean).join(" | ")}
                      </p>
                    )}
                    {website && <p className="text-gray-300 text-[5px] uppercase leading-none pt-0.5">{website}</p>}
                    <p className="text-gray-300 text-[5px] uppercase leading-tight mt-0.5">{tagline}</p>
                  </div>
                </div>

                {/* Right RESERVATION - sits on white background, text is dark gray/black */}
                <div className="items-end flex flex-col text-right">
                  <h3 className="text-3xl font-black tracking-widest uppercase mb-2 leading-none" style={{ color: brandColor }}>
                    {bookingData?.type === "quotation" ? "QUOTATION" : "RESERVATION"}
                  </h3>
                  <div className="flex gap-2 mt-1 text-[7px]">
                    <div className="space-y-1 text-left font-bold text-gray-800">
                      <p>{bookingData?.type === "quotation" ? "Quotation" : "Reservation"} Number:</p>
                      <p>{bookingData?.type === "quotation" ? "Quotation" : "Reservation"} Date:</p>
                      {bookingData?.type === "quotation" && <p>Valid Until:</p>}
                    </div>
                    <div className="space-y-1 text-right text-gray-600 font-bold">
                      <p>#{bookingData?.bookingId || "123456"}</p>
                      <p>{formatDate(normalizedData?.createdDate)}</p>
                      {bookingData?.type === "quotation" && <p>{formatDate(bookingData?.validUntil)}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice To & Stay Details Section */}
            <div className="px-10 mt-6 flex justify-between mb-8">
              {/* Invoice To */}
              <div className="w-[40%] text-left">
                <h4 className="text-[8px] font-bold mb-2 uppercase" style={{ color: brandColor }}>
                  PREPARED FOR:
                </h4>
                <p className="text-lg font-black text-gray-800 mb-1 uppercase">{bookingData?.clientName || "N/A"}</p>
                <p className="text-[7px] text-gray-600 mb-0.5">Email: {bookingData?.clientEmail || "N/A"}</p>
                <p className="text-[7px] text-gray-600 mb-0.5">Phone: {normalizedData?.clientPhone}</p>
                <p className="text-[7px] text-gray-600">Guests: {normalizedData?.formattedGuests}</p>
              </div>

              {/* Stay Details */}
              <div className="w-[50%] justify-end pb-2 flex flex-col text-left">
                <h4 className="text-[8px] font-bold mb-2 uppercase" style={{ color: brandColor }}>
                  Stay Details:
                </h4>
                <div className="flex gap-2">
                  {[
                    { label: "Check In", value: formatDate(bookingData?.checkIn) },
                    { label: "Check Out", value: formatDate(bookingData?.checkOut) },
                    { label: "Nights", value: bookingData?.nights || "0" },
                  ].map((item, i) => (
                    <div key={i} className="flex-1 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                      <p className="text-[5px] text-gray-500 font-black uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-[8px] font-black" style={{ color: brandColor }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Table Area */}
            <div className="px-10 mb-4 text-left">
              {/* Table Header */}
              <div className="flex w-full mb-0 text-[7px] font-bold text-white uppercase">
                <span className="w-[10%] py-2.5 px-3 text-center" style={{ backgroundColor: brandColor }}>ITEM</span>
                <span className="w-[1px] bg-white" />
                <span className="flex-1 py-2.5 px-3" style={{ backgroundColor: brandColor }}>DESCRIPTION</span>
                <span className="w-[1px] bg-white" />
                <span className="w-[12%] py-2.5 px-3 text-center" style={{ backgroundColor: darkColor }}>QTY</span>
                <span className="w-[1px] bg-white" />
                <span className="w-[18%] py-2.5 px-3 text-center" style={{ backgroundColor: darkColor }}>RATE</span>
                {normalizedData?.hasGST && (
                  <>
                    <span className="w-[1px] bg-white" />
                    <span className="w-[12%] py-2.5 px-3 text-center" style={{ backgroundColor: darkColor }}>GST</span>
                  </>
                )}
                <span className="w-[1px] bg-white" />
                <span className="w-[18%] py-2.5 px-3 text-center" style={{ backgroundColor: darkColor }}>AMOUNT</span>
              </div>

              {/* Table Body */}
              {items.map((item: any, i: number) => (
                <div key={i} className={`flex items-center text-[8px] border-b border-white ${i % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100/50'}`}>
                  <span className="w-[10%] py-4 px-3 text-center font-black text-gray-800">{String(i + 1).padStart(2, '0')}</span>
                  <span className="w-[1px] h-full bg-white" />
                  <div className="flex-1 py-3 px-3">
                    <p className="font-black text-gray-800 mb-0.5">{item.roomName || item.serviceName}</p>
                    {(item.roomType || item.description) && (
                      <p className="text-[6px] text-gray-500 font-medium">
                        {item.roomType && item.roomType !== item.roomName ? item.roomType : (item.description || "")}
                      </p>
                    )}
                  </div>
                  <span className="w-[1px] h-full bg-white" />
                  <span className="w-[12%] py-4 px-3 text-center font-black text-gray-800">{item.qty || bookingData?.nights}</span>
                  <span className="w-[1px] h-full bg-white" />
                  <span className="w-[18%] py-4 px-3 text-center font-black text-gray-800">{Number(item.rate).toFixed(2)}</span>
                  {normalizedData?.hasGST && (
                    <>
                      <span className="w-[1px] h-full bg-white" />
                      <span className="w-[12%] py-4 px-3 text-center font-black text-gray-800">{item.gst || 0}%</span>
                    </>
                  )}
                  <span className="w-[1px] h-full bg-white" />
                  <span className="w-[18%] py-4 px-3 text-center font-black text-gray-800">{Number(item.total).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals Section */}
            <div className="px-10 flex justify-end mt-4 text-left">
              <div className="w-[40%] space-y-2">
                <div className="flex justify-between px-2 text-[8px] font-bold text-gray-800">
                  <span>Subtotal:</span>
                  <span>{Number(normalizedData?.subtotalAmount).toFixed(2)}</span>
                </div>
                {normalizedData?.hasGST && (
                  <div className="flex justify-between px-2 text-[8px] font-bold text-gray-800">
                    <span>Tax (GST):</span>
                    <span>{Number(normalizedData?.taxAmount).toFixed(2)}</span>
                  </div>
                )}
                {normalizedData?.isReservation ? (
                  <>
                    <div className="flex justify-between px-2 text-[8px] font-bold text-gray-800">
                      <span>Advance Paid:</span>
                      <span>{Number(normalizedData?.advancePaid).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-4 px-2 text-[8px] font-bold text-gray-800">
                      <span>Balance Due:</span>
                      <span>{Number(normalizedData?.balanceDue).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between px-4 py-3 text-white text-[10px] font-bold animate-none" style={{ backgroundColor: brandColor }}>
                      <span>Grand Total:</span>
                      <span>{Number(normalizedData?.grandTotalAmount).toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between px-4 py-3 mt-2 text-white text-[10px] font-bold animate-none" style={{ backgroundColor: brandColor }}>
                    <span>Total:</span>
                    <span>{Number(normalizedData?.grandTotalAmount).toFixed(2)}</span>
                  </div>
                )}
                
                {/* Amount in words */}
                <div className="mt-2 px-2 text-[6px] text-gray-500 italic text-right">
                  Amount in words: {bookingData?.totalInWords || toWords(normalizedData?.grandTotalAmount || 0)} Rupees Only
                </div>
              </div>
            </div>

            {/* Payment Method / Bank Details */}
            <div className="px-10 mt-6 text-left">
              <h4 className="text-[8px] font-bold mb-3 uppercase" style={{ color: brandColor }}>Payment Details</h4>
              <div className="border border-gray-200 flex flex-row flex-wrap rounded-sm overflow-hidden text-[7px]">
                
                <div className="w-[20%] py-2 px-3 border-b border-r border-white flex items-center text-[6px] font-bold text-white uppercase shrink-0" style={{ backgroundColor: brandColor }}>Account Name</div>
                <div className="w-[30%] py-2 px-3 border-b border-r border-gray-200 bg-gray-50 flex items-center font-bold text-gray-800 shrink-0">{settings?.bankDetails?.accountName || "N/A"}</div>

                <div className="w-[20%] py-2 px-3 border-b border-r border-white flex items-center text-[6px] font-bold text-white uppercase shrink-0" style={{ backgroundColor: brandColor }}>Account No</div>
                <div className="w-[30%] py-2 px-3 border-b border-gray-200 bg-gray-50 flex items-center font-bold text-gray-800 shrink-0">{settings?.bankDetails?.accountNumber || "N/A"}</div>

                <div className="w-[20%] py-2 px-3 border-b border-r border-white flex items-center text-[6px] font-bold text-white uppercase shrink-0" style={{ backgroundColor: brandColor }}>Bank Name</div>
                <div className="w-[30%] py-2 px-3 border-b border-r border-gray-200 bg-gray-50 flex items-center font-bold text-gray-800 shrink-0">{settings?.bankDetails?.bankName || "N/A"}</div>

                <div className="w-[20%] py-2 px-3 border-b border-r border-white flex items-center text-[6px] font-bold text-white uppercase shrink-0" style={{ backgroundColor: brandColor }}>IFSC Code</div>
                <div className="w-[30%] py-2 px-3 border-b border-gray-200 bg-gray-50 flex items-center font-bold text-gray-800 shrink-0 uppercase">{settings?.bankDetails?.ifscCode || "N/A"}</div>

                <div className="w-[20%] py-2 px-3 border-b border-r border-white flex items-center text-[6px] font-bold text-white uppercase shrink-0" style={{ backgroundColor: brandColor }}>Branch Name</div>
                <div className="w-[30%] py-2 px-3 border-b border-r border-gray-200 bg-gray-50 flex items-center font-bold text-gray-800 shrink-0">{settings?.bankDetails?.branchName || "N/A"}</div>

                <div className="w-[20%] py-2 px-3 border-b border-r border-white flex items-center text-[6px] font-bold text-white uppercase shrink-0" style={{ backgroundColor: brandColor }}>Account Type</div>
                <div className="w-[30%] py-2 px-3 border-b border-gray-200 bg-gray-50 flex items-center font-bold text-gray-800 shrink-0">{settings?.bankDetails?.accountType || "N/A"}</div>

                <div className="w-[20%] py-2 px-3 border-r border-white flex items-center text-[6px] font-bold text-white uppercase shrink-0" style={{ backgroundColor: brandColor }}>GSTIN</div>
                <div className="w-[30%] py-2 px-3 border-r border-gray-200 bg-gray-50 flex items-center font-bold text-gray-800 shrink-0 uppercase">{gst || "N/A"}</div>

                <div className="w-[20%] py-2 px-3 border-r border-white flex items-center text-[6px] font-bold text-white uppercase shrink-0" style={{ backgroundColor: brandColor }}>UPI ID</div>
                <div className="w-[30%] py-2 px-3 bg-gray-50 flex items-center font-bold text-gray-800 shrink-0">{settings?.bankDetails?.upiId || "N/A"}</div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="px-10 flex flex-row mt-8 mb-16 text-left">
              {/* Payment Terms & Policies */}
              <div className="w-1/2 pr-4">
                <h4 className="text-[7px] font-bold mb-2 uppercase" style={{ color: brandColor }}>PAYMENT TERMS & POLICIES</h4>
                <div className="space-y-1">
                  {(settings?.paymentTerms || []).map((term: string, i: number) => (
                    <p key={i} className="text-[6px] text-gray-500 leading-relaxed">• {term}</p>
                  ))}
                </div>
              </div>

              {/* Cancellation Policies */}
              <div className="w-1/2 pl-4 border-l border-gray-100">
                <h4 className="text-[7px] font-bold mb-2 uppercase" style={{ color: brandColor }}>CANCELLATION POLICY</h4>
                <div className="space-y-1">
                  {(settings?.cancellationPolicies || []).map((policy: string, i: number) => (
                    <p key={i} className="text-[6px] text-gray-500 leading-relaxed">• {policy}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Absolute Footer Banner */}
            <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center text-white font-bold text-[9px] uppercase tracking-widest text-center" style={{ backgroundColor: darkColor }}>
              Thank you for choosing {propertyTitle} for your stay.
            </div>
          </div>
        );

      case 'Signature':
        return (
          <div className="flex-1 bg-white relative select-none text-[10px] leading-normal font-sans" style={{ color: '#1e293b' }}>
            {/* Left Brand accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: brandColor }} />
            
            <div className="pl-10 pr-8 pt-8 pb-8 flex flex-col min-h-full">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  {(settings?.profilePicture || settings?.logo) && (
                    <img
                      src={settings.profilePicture || settings.logo}
                      alt="Logo"
                      className="w-12 h-12 rounded-full mb-2 object-cover border border-gray-100"
                    />
                  )}
                  <h2 className="text-xl font-black uppercase tracking-tighter" style={{ color: brandColor }}>
                    {propertyTitle}
                  </h2>
                  <div className="w-12 h-0.5 mt-0.5" style={{ backgroundColor: brandColor }} />
                  <p className="text-[7.5px] text-gray-400 mt-2 font-bold uppercase tracking-wider max-w-xs">{address}</p>
                  <p className="text-[6.5px] text-gray-400 mt-1 uppercase font-bold">
                    GSTIN: {gst || "N/A"} • PHONE: {phone || "N/A"}
                  </p>
                  <p className="text-[6.5px] text-gray-400 uppercase font-bold">
                    EMAIL: {email || "N/A"} • WEB: {website || "N/A"}
                  </p>
                </div>

                <div className="text-right">
                  <h3 className="text-xl font-black uppercase tracking-tighter" style={{ color: brandColor }}>
                    {bookingData?.type}
                  </h3>
                  <p className="text-[7.5px] text-gray-400 mt-0.5 font-bold uppercase tracking-widest">
                    ID: <span style={{ color: brandColor }}>{bookingData?.bookingId || "AVH-DEMO"}</span>
                  </p>
                </div>
              </div>

              {/* Guest Greeting Section */}
              <div className="mb-6">
                <h4 className="text-base font-bold mb-1" style={{ color: brandColor }}>
                  Greetings, {bookingData?.clientName || "Valued Guest"}
                </h4>
                <p className="text-[7.5px] text-gray-400 leading-relaxed max-w-[460px]">
                  We are pleased to present this {bookingData?.type} for your stay. At {propertyTitle}, we prioritize your comfort and aim to provide a seamless hospitality experience. Please find the detailed breakdown of your booking below.
                </p>
              </div>

              {/* Info Header */}
              <div className="py-1 px-3 text-white font-bold text-[7px] uppercase tracking-wider rounded-t-sm" style={{ backgroundColor: brandColor }}>
                {bookingData?.type} Information
              </div>

              {/* Information Row Grid */}
              <div className="mb-6">
                <div className="border-t border-b py-3 flex text-[8px] font-bold" style={{ borderColor: brandColor }}>
                  <div className="flex-1">
                    <p className="text-[6.5px] text-gray-400 uppercase mb-0.5">Date Issued</p>
                    <p style={{ color: brandColor }}>{formatDate(normalizedData?.createdDate)}</p>
                  </div>
                  <div className="flex-1 border-l pl-3" style={{ borderColor: brandColor }}>
                    <p className="text-[6.5px] text-gray-400 uppercase mb-0.5">Valid Until</p>
                    <p style={{ color: brandColor }}>{formatDate(bookingData?.validUntil)}</p>
                  </div>
                  <div className="flex-1 border-l pl-3" style={{ borderColor: brandColor }}>
                    <p className="text-[6.5px] text-gray-400 uppercase mb-0.5">Contact No.</p>
                    <p style={{ color: brandColor }}>{normalizedData?.clientPhone}</p>
                  </div>
                  <div className="flex-1 border-l pl-3" style={{ borderColor: brandColor }}>
                    <p className="text-[6.5px] text-gray-400 uppercase mb-0.5">Email Address</p>
                    <p className="truncate" style={{ color: brandColor }}>{bookingData?.clientEmail || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Stay Summary Bar */}
              <div className="flex gap-3 mb-6">
                {[
                  { label: "Arrival Date", value: formatDate(bookingData?.checkIn) },
                  { label: "Departure Date", value: formatDate(bookingData?.checkOut) },
                  { label: "Nights", value: bookingData?.nights || "0" },
                  { label: "Total Guests", value: normalizedData?.guestCount },
                ].map((item, i) => (
                  <div key={i} className="flex-1 p-2 border-l-2 bg-slate-50/40" style={{ borderLeftColor: brandColor }}>
                    <p className="text-[5.5px] text-gray-400 font-bold uppercase mb-0.5">{item.label}</p>
                    <p className="text-[9px] font-black" style={{ color: brandColor }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="mb-4 border rounded-sm overflow-hidden" style={{ borderColor: brandColor }}>
                <div className="flex text-white font-black text-[7px] uppercase tracking-wider py-1.5" style={{ backgroundColor: brandColor }}>
                  <span className="w-[8%] text-center border-r border-white/20">#</span>
                  <span className="flex-1 px-3 border-r border-white/20">DESCRIPTION</span>
                  <span className="w-[10%] text-right pr-4 border-r border-white/20">QTY</span>
                  <span className="w-[15%] text-right pr-4 border-r border-white/20">RATE</span>
                  {normalizedData?.hasGST && <span className="w-[12%] text-right pr-4 border-r border-white/20">GST</span>}
                  <span className="w-[18%] text-right pr-6">TOTAL</span>
                </div>

                {items.map((item: any, i: number) => (
                  <div key={i} className="flex border-b text-[8px] font-medium" style={{ borderColor: brandColor }}>
                    <span className="w-[8%] py-2 text-center border-r" style={{ borderColor: brandColor, color: brandColor }}>{i + 1}</span>
                    <div className="flex-1 py-2 px-3 border-r flex flex-col justify-center" style={{ borderColor: brandColor }}>
                      <span className="font-bold" style={{ color: brandColor }}>{item.roomName || item.serviceName}</span>
                      {item.description && <span className="text-[6.5px] text-gray-400 mt-0.5">{item.description}</span>}
                    </div>
                    <span className="w-[10%] py-2 text-right pr-4 border-r" style={{ borderColor: brandColor, color: brandColor }}>{item.qty || bookingData?.nights}</span>
                    <span className="w-[15%] py-2 text-right pr-4 border-r" style={{ borderColor: brandColor, color: brandColor }}>{Number(item.rate).toFixed(2)}</span>
                    {normalizedData?.hasGST && (
                      <span className="w-[12%] py-2 text-right pr-4 border-r" style={{ borderColor: brandColor, color: brandColor }}>{item.gst || 0}%</span>
                    )}
                    <span className="w-[18%] py-2 text-right pr-6 font-bold" style={{ color: brandColor }}>{Number(item.total).toFixed(2)}</span>
                  </div>
                ))}

                {/* SUBTOTALS */}
                {normalizedData?.hasGST && (
                  <div className="flex border-b text-[7.5px]" style={{ borderColor: brandColor }}>
                    <span className="flex-1 py-1" />
                    <span className="w-[20%] py-1 text-right pr-2 font-black uppercase border-l" style={{ borderColor: brandColor, color: brandColor }}>TOTAL GST</span>
                    <span className="w-[18%] py-1 text-right pr-6 font-black" style={{ color: brandColor }}>Rs. {Number(normalizedData?.taxAmount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex border-b text-[7.5px]" style={{ borderColor: brandColor }}>
                  <span className="flex-1 py-1" />
                  <span className="w-[20%] py-1 text-right pr-2 font-black uppercase border-l" style={{ borderColor: brandColor, color: brandColor }}>SUBTOTAL</span>
                  <span className="w-[18%] py-1 text-right pr-6 font-black" style={{ color: brandColor }}>Rs. {Number(normalizedData?.subtotalAmount).toLocaleString()}</span>
                </div>
                {normalizedData?.isReservation && (
                  <>
                    <div className="flex border-b text-[7.5px]" style={{ borderColor: brandColor }}>
                      <span className="flex-1 py-1" />
                      <span className="w-[20%] py-1 text-right pr-2 font-black uppercase border-l" style={{ borderColor: brandColor, color: brandColor }}>ADVANCE PAID</span>
                      <span className="w-[18%] py-1 text-right pr-6 font-black" style={{ color: brandColor }}>Rs. {Number(normalizedData?.advancePaid).toLocaleString()}</span>
                    </div>
                    <div className="flex border-b text-[7.5px]" style={{ borderColor: brandColor }}>
                      <span className="flex-1 py-1" />
                      <span className="w-[20%] py-1 text-right pr-2 font-black uppercase border-l" style={{ borderColor: brandColor, color: brandColor }}>REMAINING</span>
                      <span className="w-[18%] py-1 text-right pr-6 font-black" style={{ color: brandColor }}>Rs. {Number(normalizedData?.balanceDue).toLocaleString()}</span>
                    </div>
                  </>
                )}
                <div className="flex items-center text-white py-2 font-bold" style={{ backgroundColor: brandColor }}>
                  <span className="flex-1 text-right pr-4 text-[8px] uppercase tracking-wider">Grand Total :</span>
                  <span className="w-[18%] text-right pr-6 text-[9.5px]">Rs. {Number(normalizedData?.grandTotalAmount).toLocaleString()}</span>
                </div>
              </div>

              {/* BankDetails and Terms */}
              <div className="flex gap-6 items-start mt-6 pt-4 border-t border-slate-100">
                {/* Bank Account */}
                <div className="w-[45%] border" style={{ borderColor: brandColor }}>
                  <div className="py-1 px-2.5 text-white font-bold text-[6.5px] uppercase tracking-wider" style={{ backgroundColor: brandColor }}>
                    Bank Account Details
                  </div>
                  {[
                    { label: "Account Name", value: isPreview ? "ShapesBytes" : settings?.bankDetails?.accountName || "N/A" },
                    { label: "Bank Name", value: isPreview ? "AXIS BANK LTD" : settings?.bankDetails?.bankName || "N/A" },
                    { label: "Branch", value: isPreview ? "NINE MILE ROAD RJ" : settings?.bankDetails?.branchName || "N/A" },
                    { label: "Account No.", value: isPreview ? "921020057962261" : settings?.bankDetails?.accountNumber || "N/A" },
                    { label: "IFSC Code", value: isPreview ? "UTIB0004728" : settings?.bankDetails?.ifscCode || "N/A" },
                    { label: "Account Type", value: isPreview ? "Current Account" : settings?.bankDetails?.accountType || "N/A" },
                  ].map((item, i) => (
                    <div key={i} className="flex border-b last:border-b-0" style={{ borderColor: brandColor, borderBottomWidth: 0.5 }}>
                      <div className="w-24 p-1 border-r bg-gray-50 text-[5.5px] font-bold text-gray-400 uppercase" style={{ borderColor: brandColor }}>{item.label}</div>
                      <div className="flex-1 p-1 text-[5.5px] font-black" style={{ color: brandColor }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Terms and policies */}
                <div className="flex-1 flex gap-6 text-[6.5px]">
                  <div>
                    <h4 className="font-black uppercase tracking-wider mb-1" style={{ color: brandColor }}>Payment Terms</h4>
                    {(settings?.paymentTerms || ["50% advance to confirm."]).slice(0, 3).map((term: string, i: number) => (
                      <p key={i} className="text-gray-500 mb-0.5">• {term}</p>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-wider mb-1" style={{ color: brandColor }}>Cancellation Policy</h4>
                    {(settings?.cancellationPolicies || ["Standard cancellation policies apply."]).slice(0, 3).map((policy: string, i: number) => (
                      <p key={i} className="text-gray-500 mb-0.5">• {policy}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Modern':
      default:
        return (
          <div className="flex-1 bg-white select-none text-[10px] leading-normal font-sans" style={{ color: '#1e293b' }}>
            {/* Header - Modern Minimal */}
            <div className="pt-6 pb-8 flex flex-col items-center text-white" style={{ backgroundColor: brandColor }}>
              {(settings?.profilePicture || settings?.logo) && (
                <img
                  src={settings.profilePicture || settings.logo}
                  alt="Logo"
                  className="w-12 h-12 rounded-full mb-3 object-cover border-2 border-white/20 shadow-inner"
                />
              )}
              <h2 className="text-xl font-bold tracking-[0.3em] uppercase mb-1 leading-none">{propertyTitle}</h2>
              <div className="w-8 h-[1px] bg-white/40 my-2" />
              <div className="flex flex-col items-center text-center text-[7.5px] font-medium opacity-90 space-y-0.5">
                <p>{address}</p>
                <p>
                  GSTIN: {gst || "N/A"} • PHONE: {phone || "N/A"}
                </p>
                <p>
                  EMAIL: {email || "N/A"} • WEBSITE: {website || "N/A"}
                </p>
              </div>
            </div>

            {/* Overlapping Floating Badge */}
            <div className="flex justify-center -mt-4 mb-4">
              <div className="bg-white px-8 py-2 rounded-full border shadow-sm font-black text-[8px] uppercase tracking-[0.4em]" style={{ borderColor: brandColor, color: brandColor }}>
                {bookingData?.type}
              </div>
            </div>

            <div className="px-8 mt-4">
              {/* Stay Info Bar */}
              <div className="mb-4">
                <div className="flex mb-1.5 px-3">
                  <span className="flex-1 text-[7px] text-gray-400 font-bold text-center uppercase tracking-wider">Check-In Date</span>
                  <span className="flex-1 text-[7px] text-gray-400 font-bold text-center uppercase tracking-wider">Check-Out Date</span>
                  <span className="flex-1 text-[7px] text-gray-400 font-bold text-center uppercase tracking-wider">No. of Nights</span>
                  <span className="flex-1 text-[7px] text-gray-400 font-bold text-center uppercase tracking-wider">No. of Guests</span>
                </div>
                <div className="flex border-t py-2.5 px-3 font-black text-[11px]" style={{ borderColor: brandColor }}>
                  <span className="flex-1 text-center" style={{ color: brandColor }}>{formatDate(bookingData?.checkIn)}</span>
                  <span className="flex-1 text-center" style={{ color: brandColor }}>{formatDate(bookingData?.checkOut)}</span>
                  <span className="flex-1 text-center" style={{ color: brandColor }}>{bookingData?.nights || "0"}</span>
                  <span className="flex-1 text-center" style={{ color: brandColor }}>{normalizedData?.guestCount}</span>
                </div>
              </div>

              {/* Information Grid */}
              <div className="mb-6">
                <div className="py-1 px-3 text-white font-bold text-[7.5px] uppercase tracking-wider rounded-t-sm" style={{ backgroundColor: brandColor }}>
                  {bookingData?.type} Information
                </div>
                <div className="border flex flex-wrap bg-white" style={{ borderColor: '#f1f5f9' }}>
                  <div className="w-1/4 p-2 border-b border-r bg-slate-50/50 text-[7px] font-bold text-gray-400 uppercase">DATE</div>
                  <div className="w-1/4 p-2 border-b border-r font-bold text-slate-800">{formatDate(normalizedData?.createdDate)}</div>
                  <div className="w-1/4 p-2 border-b border-r bg-slate-50/50 text-[7px] font-bold text-gray-400 uppercase">PREPARED FOR</div>
                  <div className="w-1/4 p-2 border-b font-bold text-slate-800 uppercase">{bookingData?.clientName || "N/A"}</div>

                  <div className="w-1/4 p-2 border-b border-r bg-slate-50/50 text-[7px] font-bold text-gray-400 uppercase">VALID UNTIL</div>
                  <div className="w-1/4 p-2 border-b border-r font-bold text-slate-800">{formatDate(bookingData?.validUntil)}</div>
                  <div className="w-1/4 p-2 border-b border-r bg-slate-50/50 text-[7px] font-bold text-gray-400 uppercase">CONTACT</div>
                  <div className="w-1/4 p-2 border-b font-bold text-slate-800">{normalizedData?.clientPhone}</div>

                  <div className="w-1/4 p-2 border-r bg-slate-50/50 text-[7px] font-bold text-gray-400 uppercase">{bookingData?.type} ID</div>
                  <div className="w-1/4 p-2 border-r font-bold text-slate-800 uppercase">{bookingData?.bookingId || "AVH-DEMO"}</div>
                  <div className="w-1/4 p-2 border-r bg-slate-50/50 text-[7px] font-bold text-gray-400 uppercase">CLIENT EMAIL</div>
                  <div className="w-1/4 p-2 font-bold text-slate-800">{bookingData?.clientEmail || "N/A"}</div>
                </div>
              </div>

              {/* Table */}
              <div className="mb-4 border border-slate-200 rounded-sm overflow-hidden">
                <div className="flex text-white font-black text-[7px] uppercase tracking-wider py-2" style={{ backgroundColor: brandColor }}>
                  <span className="w-[8%] text-center border-r border-white/20">#</span>
                  <span className="flex-1 px-3 border-r border-white/20">DESCRIPTION</span>
                  <span className="w-[10%] text-right pr-4 border-r border-white/20">QTY</span>
                  <span className="w-[15%] text-right pr-4 border-r border-white/20">RATE</span>
                  {normalizedData?.hasGST && <span className="w-[12%] text-right pr-4 border-r border-white/20">GST (%)</span>}
                  <span className="w-[18%] text-right pr-6">TOTAL</span>
                </div>

                {items.map((item: any, i: number) => (
                  <div key={i} className="flex border-b text-[8px] font-medium border-slate-100">
                    <span className="w-[8%] py-2.5 text-center border-r border-slate-100 text-slate-800">{i + 1}</span>
                    <div className="flex-1 py-2.5 px-3 border-r border-slate-100 flex flex-col justify-center">
                      <span className="font-bold text-slate-800">{item.roomName || item.serviceName}</span>
                      {item.description && <span className="text-[6.5px] text-gray-400 mt-0.5">{item.description}</span>}
                    </div>
                    <span className="w-[10%] py-2.5 text-right pr-4 border-r border-slate-100 text-slate-800">{item.qty || bookingData?.nights}</span>
                    <span className="w-[15%] py-2.5 text-right pr-4 border-r border-slate-100 text-slate-800">{Number(item.rate).toFixed(2)}</span>
                    {normalizedData?.hasGST && (
                      <span className="w-[12%] py-2.5 text-right pr-4 border-r border-slate-100 text-slate-800">{item.gst || 0}%</span>
                    )}
                    <span className="w-[18%] py-2.5 text-right pr-6 font-bold text-slate-800">{Number(item.total).toFixed(2)}</span>
                  </div>
                ))}

                {/* TOTAL GST */}
                {normalizedData?.hasGST && (
                  <div className="flex border-b text-[7.5px] border-slate-100">
                    <span className="flex-1 py-1.5" />
                    <span className="w-[20%] py-1.5 text-right pr-2 font-black uppercase border-l border-slate-100 text-slate-800">TOTAL GST</span>
                    <span className="w-[18%] py-1.5 text-right pr-6 font-black text-slate-800">Rs. {Number(normalizedData?.taxAmount).toLocaleString()}</span>
                  </div>
                )}

                {/* SUBTOTAL */}
                <div className="flex border-b text-[7.5px] border-slate-100">
                  <span className="flex-1 py-1.5" />
                  <span className="w-[20%] py-1.5 text-right pr-2 font-black uppercase border-l border-slate-100 text-slate-800">SUBTOTAL</span>
                  <span className="w-[18%] py-1.5 text-right pr-6 font-black text-slate-800">Rs. {Number(normalizedData?.subtotalAmount).toLocaleString()}</span>
                </div>

                {/* ADVANCE PAID & BALANCE */}
                {normalizedData?.isReservation && (
                  <>
                    <div className="flex border-b text-[7.5px] border-slate-100">
                      <span className="flex-1 py-1.5" />
                      <span className="w-[20%] py-1.5 text-right pr-2 font-black uppercase border-l border-slate-100 text-slate-800">ADVANCE PAID</span>
                      <span className="w-[18%] py-1.5 text-right pr-6 font-black text-slate-800">Rs. {Number(normalizedData?.advancePaid).toLocaleString()}</span>
                    </div>
                    <div className="flex border-b text-[7.5px] border-slate-100">
                      <span className="flex-1 py-1.5" />
                      <span className="w-[20%] py-1.5 text-right pr-2 font-black uppercase border-l border-slate-100 text-slate-800">REMAINING</span>
                      <span className="w-[18%] py-1.5 text-right pr-6 font-black text-orange-600">Rs. {Number(normalizedData?.balanceDue).toLocaleString()}</span>
                    </div>
                  </>
                )}

                {/* GRAND TOTAL */}
                <div className="flex items-center text-white py-2.5 font-bold" style={{ backgroundColor: brandColor }}>
                  <span className="flex-1 text-right pr-4 text-[8px] uppercase tracking-wider">Grand Total :</span>
                  <span className="w-[18%] text-right pr-6 text-[9.5px]">Rs. {Number(normalizedData?.grandTotalAmount).toLocaleString()}</span>
                </div>
              </div>

              {/* Amount in words */}
              <div className="flex items-center mb-6">
                <span className="text-[7.5px] font-black uppercase tracking-tighter shrink-0" style={{ color: brandColor }}>Amount in Words: Rupees</span>
                <div className="flex-1 mx-2 border-b h-4 flex justify-center items-center" style={{ borderColor: brandColor }}>
                  <span className="text-[8px] italic font-semibold text-center" style={{ color: brandColor }}>
                    {bookingData?.totalInWords || toWords(normalizedData?.grandTotalAmount || 0)}
                  </span>
                </div>
                <span className="text-[7.5px] font-black uppercase tracking-tighter shrink-0" style={{ color: brandColor }}>Only</span>
              </div>

              {/* Footer Details */}
              <div className="flex gap-6 items-start mt-6 pt-4 border-t border-slate-100">
                {/* Bank details */}
                <div className="w-[45%] border border-slate-200 rounded-sm overflow-hidden">
                  {[
                    { label: "Account Name", value: isPreview ? "ShapesBytes" : settings?.bankDetails?.accountName || "N/A" },
                    { label: "Bank Name", value: isPreview ? "AXIS BANK LTD" : settings?.bankDetails?.bankName || "N/A" },
                    { label: "Branch", value: isPreview ? "NINE MILE ROAD RJ" : settings?.bankDetails?.branchName || "N/A" },
                    { label: "Account No.", value: isPreview ? "921020057962261" : settings?.bankDetails?.accountNumber || "N/A" },
                    { label: "IFSC Code", value: isPreview ? "UTIB0004728" : settings?.bankDetails?.ifscCode || "N/A" },
                    { label: "Account Type", value: isPreview ? "Current Account" : settings?.bankDetails?.accountType || "N/A" },
                  ].map((item, i) => (
                    <div key={i} className="flex border-b last:border-b-0 border-slate-200">
                      <div className="w-24 p-1.5 border-r bg-slate-50 text-[6px] font-bold text-gray-400 uppercase border-slate-200">{item.label}</div>
                      <div className="flex-1 p-1.5 text-[6px] font-black text-slate-700">{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Terms box */}
                <div className="flex-1 border rounded-xl py-2.5 px-4" style={{ borderColor: brandColor }}>
                  <h4 className="text-[7.5px] font-black mb-1 uppercase" style={{ color: brandColor }}>Payment Terms</h4>
                  {(settings?.paymentTerms || ["50% advance to confirm.", "Remaining 50% due before check-in."]).slice(0, 4).map((term: string, i: number) => (
                    <p key={i} className="text-[6.5px] text-gray-500 mb-0.5">• {term}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        style={{ height: isMobile ? '88vh' : '95vh', width: isMobile ? '96%' : '90%', maxWidth: '1200px' }}
        className="bg-white rounded-[32px] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20"
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${brandColor}10` }}>
              <Printer className="w-5 h-5" style={{ color: brandColor }} />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">{isMobile ? "Document View" : "Document Preview"}</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <PDFDownloadLink
              document={<PDFWrapper data={bookingData} settings={settings} />}
              fileName={`${bookingData?.bookingId || bookingData?.reference || (bookingData?.type || 'DOC').toUpperCase()} - ${(bookingData?.clientName || 'Guest').toUpperCase()}.pdf`}
              className="flex items-center justify-center text-white rounded-2xl font-black transition-all shadow-lg active:scale-95 group hover:brightness-110"
              style={{ 
                backgroundColor: brandColor,
                boxShadow: `0 10px 15px -3px ${brandColor}30`,
                padding: isMobile ? '10px 14px' : '12px 24px',
                fontSize: isMobile ? '11px' : '14px'
              }}
            >
              {({ loading }) => (
                <span className="flex items-center gap-1.5">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>{loading ? "Preparing..." : (isMobile ? "Download" : "Download PDF")}</span>
                </span>
              )}
            </PDFDownloadLink>

            <button
              onClick={onClose}
              className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 bg-slate-900/5 relative overflow-hidden flex flex-col">
          {(loading || isRendering) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-white z-[110]">
              <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin" style={{ color: brandColor }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: brandColor }} />
                </div>
              </div>
              <div className="text-center px-6">
                <p className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-1">Building Document</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Applying branding & layouts...</p>
              </div>
            </div>
          )}
          
          {settings ? (
            isMobile ? (
              /* Premium Native App Viewer Trigger Card for Mobile devices */
              <div className="w-full h-full flex flex-col justify-center items-center bg-slate-50 p-6 text-center select-none">
                <div className="max-w-md w-full bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 flex flex-col items-center gap-6">
                  {/* Decorative PDF Icon */}
                  <div className="w-20 h-20 rounded-[24px] flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: `${brandColor}15` }}>
                    <div className="absolute inset-0 animate-ping rounded-[24px] opacity-20" style={{ backgroundColor: brandColor }} />
                    <Printer className="w-10 h-10 relative z-10" style={{ color: brandColor }} />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">Open PDF Document</h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                      View this document directly inside your device's default PDF viewer for absolute pixel-perfect desktop quality!
                    </p>
                  </div>

                  {/* Trigger Button */}
                  <button
                    onClick={openInNativeViewer}
                    disabled={openingNative}
                    className="w-full flex items-center justify-center gap-2 text-white font-black rounded-2xl transition-all shadow-lg active:scale-95 duration-200"
                    style={{
                      backgroundColor: brandColor,
                      boxShadow: `0 10px 20px -3px ${brandColor}40`,
                      padding: '16px 24px',
                      fontSize: '14px'
                    }}
                  >
                    {openingNative ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating Document...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>View Document</span>
                      </>
                    )}
                  </button>

                  <div className="text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl max-w-[280px]">
                    💡 Tip: Once the file downloads, tap <span className="text-slate-600">"Open"</span> at the bottom of your screen to launch it immediately in your PDF reader.
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop PDFViewer */
              <div className="w-full h-full flex-1">
                <PDFViewer width="100%" height="100%" style={{ border: 'none', height: '100%', width: '100%' }} showToolbar={false}>
                  <PDFWrapper data={bookingData} settings={settings} />
                </PDFViewer>
              </div>
            )
          ) : !loading && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold bg-white">
              Failed to load settings. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewModal;
