import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";

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

interface LayoutProps {
  data: any;
  settings: any;
  tw: any;
}

const ModernLayout = ({ data, settings, tw }: LayoutProps) => {
  const isPreview = settings?.isPreview;

  // Use ShapesBytes as demo if needed, otherwise use settings
  const propertyTitle = isPreview
    ? "SHAPESBYTES"
    : settings?.title || "SHAPESBYTES";
  const brandColor = settings?.pdf?.color || settings?.pdfConfig?.color || "#ea580c";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toISOString().split("T")[0]; // YYYY-MM-DD as in screenshot
    } catch (e) {
      return dateStr;
    }
  };

  // Data Normalization for Parity
  const clientPhone = data?.clientPhone || data?.clientContact || "N/A";
  const taxAmount = data?.payment?.totalGST || data?.tax || data?.gst || 0;
  const subtotalAmount = data?.payment?.subtotal || data?.subtotal || 0;
  const grandTotalAmount = data?.payment?.grandTotal || data?.total || 0;
  const guestCount = typeof data?.guests === 'object' ? (Number(data.guests.adults || 0) + Number(data.guests.kids || 0)) : (data?.guests || 0);
  const createdDate = data?.reservationDate || data?.createdAt;
  const advancePaid = data?.payment?.advancePaid || 0;
  const balanceDue = data?.payment?.pendingAmount || (grandTotalAmount - advancePaid);
  const isReservation = data?.type === "reservation";
  const hasGST = taxAmount > 0;

  return (
    <View style={tw("flex-1 bg-white")}>
      {/* Compact Dark Navy Header */}
      <View
        style={[
          tw("pt-8 pb-10 flex flex-col items-center"),
          { backgroundColor: brandColor },
        ]}
      >
        {/* Dynamic Logo from Settings */}
        {(settings?.profilePicture || settings?.logo) && (
          <Image
            src={settings.profilePicture || settings.logo}
            style={[
              tw("w-14 h-14 rounded-full mb-4 object-cover border-2 border-white/20"),
              { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2 }
            ]}
          />
        )}
        
        <Text
          style={[
            tw("text-2xl font-bold tracking-[0.3em] text-white"),
            { lineHeight: 1 },
          ]}
        >
          {propertyTitle.toUpperCase()}
        </Text>
        <View
          style={[
            tw("w-8 h-[1px] bg-white"),
            { marginTop: 10, marginBottom: 10 },
          ]}
        />

        <Text
          style={tw(
            "text-[7px] font-bold text-white mb-1.5 tracking-wider uppercase",
          )}
        >
          {isPreview
            ? "123, DEMO BUSINESS PARK, SECTOR 5, JODHPUR, RAJASTHAN - 342001"
            : settings?.address || "N/A"}
        </Text>
        <Text
          style={tw(
            "text-[7px] font-bold text-white mb-1.5 tracking-wider uppercase",
          )}
        >
          GSTIN:{" "}
          {isPreview
            ? "08ABWFA8226H1ZY"
            : settings?.bankDetails?.gstNumber || "N/A"}{" "}
          • PHONE:{" "}
          {isPreview ? "+91 88902 77537" : settings?.phoneNumber || "N/A"}
        </Text>
        <Text
          style={tw("text-[7px] font-bold text-white tracking-wider uppercase")}
        >
          EMAIL:{" "}
          {isPreview ? "CONTACT@SHAPESBYTES.IN" : settings?.email || "N/A"} •
          WEBSITE:{" "}
          {isPreview ? "WWW.SHAPESBYTES.IN" : settings?.websiteLink || "N/A"}
        </Text>
      </View>

      {/* Floating Badge - Overlapping */}
      <View style={tw("flex flex-row justify-center -mt-6 mb-4")}>
        <View
          style={[
            tw("bg-white px-10 py-3 rounded-full border shadow-lg"),
            { borderColor: brandColor },
          ]}
        >
          <Text
            style={[
              tw("text-[9px] font-bold tracking-[0.4em] uppercase"),
              { color: brandColor },
            ]}
          >
            {data?.type === "quotation" ? "QUOTATION" : "RESERVATION"}
          </Text>
        </View>
      </View>

      <View style={tw("px-8")}>
        {/* Stay Info Bar */}
        <View style={tw("mb-4")}>
          <View style={tw("flex flex-row mb-2 px-4")}>
            <Text
              style={tw(
                "flex-1 text-[7px] text-gray-400 font-bold text-center uppercase",
              )}
            >
              Check-In Date
            </Text>
            <Text
              style={tw(
                "flex-1 text-[7px] text-gray-400 font-bold text-center uppercase",
              )}
            >
              Check-Out Date
            </Text>
            <Text
              style={tw(
                "flex-1 text-[7px] text-gray-400 font-bold text-center uppercase",
              )}
            >
              No. of Nights
            </Text>
            <Text
              style={tw(
                "flex-1 text-[7px] text-gray-400 font-bold text-center uppercase",
              )}
            >
              No. of Guests
            </Text>
          </View>
          <View
            style={[
              tw("flex flex-row border-t py-3 px-4"),
              { borderColor: brandColor },
            ]}
          >
            <Text
              style={[
                tw("flex-1 text-xs font-bold text-center"),
                { color: brandColor },
              ]}
            >
              {formatDate(data?.checkIn)}
            </Text>
            <Text
              style={[
                tw("flex-1 text-xs font-bold text-center"),
                { color: brandColor },
              ]}
            >
              {formatDate(data?.checkOut)}
            </Text>
            <Text
              style={[
                tw("flex-1 text-xs font-bold text-center"),
                { color: brandColor },
              ]}
            >
              {data?.nights || "0"}
            </Text>
            <Text
              style={[
                tw("flex-1 text-xs font-bold text-center"),
                { color: brandColor },
              ]}
            >
              {guestCount}
            </Text>
          </View>
        </View>

        {/* Quotation Information Grid */}
        <View style={tw("mb-6")}>
          <View
            style={[
              tw("py-2 px-4 rounded-t-sm"),
              { backgroundColor: brandColor },
            ]}
          >
            <Text
              style={tw(
                "text-[8px] font-bold text-white tracking-widest uppercase",
              )}
            >
              {data?.type === "quotation" ? "QUOTATION" : "RESERVATION"}{" "}
              INFORMATION
            </Text>
          </View>
          <View style={tw("border border-gray-100 flex flex-row flex-wrap")}>
            <View
              style={tw(
                "w-1/4 p-2 border-b border-r border-gray-100 bg-gray-50/50",
              )}
            >
              <Text style={tw("text-[7px] font-bold text-gray-400")}>DATE</Text>
            </View>
            <View style={tw("w-1/4 p-2 border-b border-r border-gray-100")}>
              <Text
                style={[tw("text-[7px] font-bold"), { color: brandColor }]}
              >
                {formatDate(createdDate)}
              </Text>
            </View>
            <View
              style={tw(
                "w-1/4 p-2 border-b border-r border-gray-100 bg-gray-50/50",
              )}
            >
              <Text style={tw("text-[7px] font-bold text-gray-400")}>
                PREPARED FOR
              </Text>
            </View>
            <View style={tw("w-1/4 p-2 border-b border-gray-100")}>
              <Text
                style={[
                  tw("text-[7px] font-bold uppercase"),
                  { color: brandColor },
                ]}
              >
                {data?.clientName || "DEMO CLIENT"}
              </Text>
            </View>

            <View
              style={tw(
                "w-1/4 p-2 border-b border-r border-gray-100 bg-gray-50/50",
              )}
            >
              <Text style={tw("text-[7px] font-bold text-gray-400")}>
                VALID UNTIL
              </Text>
            </View>
            <View style={tw("w-1/4 p-2 border-b border-r border-gray-100")}>
              <Text
                style={[tw("text-[7px] font-bold"), { color: brandColor }]}
              >
                {formatDate(data?.validUntil)}
              </Text>
            </View>
            <View
              style={tw(
                "w-1/4 p-2 border-b border-r border-gray-100 bg-gray-50/50",
              )}
            >
              <Text style={tw("text-[7px] font-bold text-gray-400")}>
                CONTACT
              </Text>
            </View>
            <View style={tw("w-1/4 p-2 border-b border-gray-100")}>
              <Text
                style={[tw("text-[7px] font-bold"), { color: brandColor }]}
              >
                {clientPhone}
              </Text>
            </View>

            <View
              style={tw("w-1/4 p-2 border-r border-gray-100 bg-gray-50/50")}
            >
              <Text style={tw("text-[7px] font-bold text-gray-400 uppercase")}>
                {data?.type} ID
              </Text>
            </View>
            <View style={tw("w-1/4 p-2 border-r border-gray-100")}>
              <Text
                style={[
                  tw("text-[7px] font-bold uppercase"),
                  { color: brandColor },
                ]}
              >
                {data?.bookingId || "AVH-DEMO"}
              </Text>
            </View>
            <View
              style={tw("w-1/4 p-2 border-r border-gray-100 bg-gray-50/50")}
            >
              <Text style={tw("text-[7px] font-bold text-gray-400")}>
                CLIENT EMAIL
              </Text>
            </View>
            <View style={tw("w-1/4 p-2")}>
              <Text
                style={[tw("text-[7px] font-bold"), { color: brandColor }]}
              >
                {isPreview ? "demo@shapesbytes.in" : data?.clientEmail || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Pricing and Services Table */}
        <View style={tw("mb-2")}>
          <View
            style={[
              tw("py-2.5 px-4 rounded-t-sm"),
              { backgroundColor: brandColor },
            ]}
          >
            <Text
              style={tw(
                "text-[8px] font-bold text-white tracking-widest uppercase",
              )}
            >
              Pricing and Services
            </Text>
          </View>
          <View style={tw("border border-slate-200")}>
            {/* Dark Top Header (Added based on your image) */}

            {/* Table Header Row */}
            <View
              style={tw("bg-[#f8fafc] flex flex-row border-b border-slate-200")}
            >
              <View
                style={tw(
                  "w-[8%] py-2 border-r border-slate-200 justify-center",
                )}
              >
                <Text
                  style={tw("text-[7px] font-black text-slate-900 text-center")}
                >
                  #
                </Text>
              </View>
              <View
                style={tw(
                  "flex-1 py-2 px-3 border-r border-slate-200 justify-center",
                )}
              >
                <Text style={tw("text-[7px] font-black text-slate-900")}>
                  DESCRIPTION
                </Text>
              </View>
              <View
                style={tw(
                  "w-[10%] py-2 border-r border-slate-200 justify-center",
                )}
              >
                <Text
                  style={tw(
                    "text-[7px] font-black text-slate-900 text-right pr-4",
                  )}
                >
                  QTY
                </Text>
              </View>
              <View
                style={tw(
                  "w-[15%] py-2 border-r border-slate-200 justify-center",
                )}
              >
                <Text
                  style={tw(
                    "text-[7px] font-black text-slate-900 text-right pr-4",
                  )}
                >
                  RATE
                </Text>
              </View>
              {hasGST && (
                <View
                  style={tw(
                    "w-[12%] py-2 border-r border-slate-200 justify-center",
                  )}
                >
                  <Text
                    style={tw(
                      "text-[7px] font-black text-slate-900 text-right pr-4",
                    )}
                  >
                    GST (%)
                  </Text>
                </View>
              )}
              <View style={tw("w-[18%] py-2 justify-center")}>
                <Text
                  style={tw(
                    "text-[7px] font-black text-slate-900 text-right pr-6",
                  )}
                >
                  TOTAL
                </Text>
              </View>
            </View>

            {/* Table Body Rows */}
            {(data?.rooms || [])
              .concat(data?.services || [])
              .map((item: any, i: number) => (
                <View
                  key={i}
                  style={tw("flex flex-row border-b border-slate-100")}
                >
                  <View
                    style={tw(
                      "w-[8%] py-3 border-r border-slate-100 justify-center",
                    )}
                  >
                    <Text style={tw("text-[8px] text-slate-900 text-center")}>
                      {i + 1}
                    </Text>
                  </View>
                  <View
                    style={tw(
                      "flex-1 py-3 px-3 border-r border-slate-100 justify-center",
                    )}
                  >
                    <Text style={tw("text-[8px] font-bold text-slate-900")}>
                      {item.roomName || item.serviceName}
                    </Text>
                    {/* Show description/roomType if available and different from the name */}
                    {(item.roomType || item.description) && (
                      <Text style={tw("text-[7px] text-gray-400 mt-1 font-medium")}>
                        {item.roomType && item.roomType !== item.roomName ? item.roomType : (item.description || "")}
                      </Text>
                    )}
                  </View>
                  <View
                    style={tw(
                      "w-[10%] py-3 border-r border-slate-100 justify-center",
                    )}
                  >
                    <Text
                      style={tw("text-[8px] text-slate-900 text-right pr-4")}
                    >
                      {item.qty || data?.nights}
                    </Text>
                  </View>
                  <View
                    style={tw(
                      "w-[15%] py-3 border-r border-slate-100 justify-center",
                    )}
                  >
                    <Text
                      style={tw("text-[8px] text-slate-900 text-right pr-4")}
                    >
                      {Number(item.rate).toFixed(2)}
                    </Text>
                  </View>
                  {hasGST && (
                    <View
                      style={tw(
                        "w-[12%] py-3 border-r border-slate-100 justify-center",
                      )}
                    >
                      <Text
                        style={tw("text-[8px] text-slate-900 text-right pr-4")}
                      >
                        {item.gst || 0}%
                      </Text>
                    </View>
                  )}
                  <View style={tw("w-[18%] py-3 justify-center")}>
                    <Text
                      style={tw(
                        "text-[8px] font-bold text-slate-900 text-right pr-6",
                      )}
                    >
                      {Number(item.total).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}

            {/* TOTAL GST Row - Always visible as requested */}
            {hasGST && (
              <View style={tw("flex flex-row border-b border-slate-100")}>
                <View style={tw("w-[8%] py-2 border-r border-slate-100")} />
                <View style={tw("flex-1 py-2 border-r border-slate-100")} />
                <View style={tw("w-[10%] py-2 border-r border-slate-100")} />
                <View style={tw("w-[15%] py-2 border-r border-slate-100")} />
                <View
                  style={tw(
                    "w-[12%] py-2 border-r border-slate-100 justify-center",
                  )}
                >
                  <Text
                    style={tw(
                      "text-[7px] font-black text-slate-900 text-right pr-2 uppercase",
                    )}
                  >
                    TOTAL GST
                  </Text>
                </View>
                <View style={tw("w-[18%] py-2 justify-center")}>
                  <Text
                    style={tw("text-[8px] font-black text-slate-900 text-right pr-6")}
                  >
                    Rs. {Number(taxAmount).toLocaleString()}
                  </Text>
                </View>
              </View>
            )}
 
            {/* Subtotal Row */}
            <View style={tw("flex flex-row border-b border-slate-100")}>
              {/* Matching empty columns perfectly with the body widths */}
              <View style={tw("w-[8%] py-2 border-r border-slate-100")} />
              <View style={tw("flex-1 py-2 border-r border-slate-100")} />
              <View style={tw("w-[10%] py-2 border-r border-slate-100")} />
              <View style={tw("w-[15%] py-2 border-r border-slate-100")} />
              <View
                style={tw(
                  "w-[12%] py-2 border-r border-slate-100 justify-center",
                )}
              >
                <Text
                  style={tw(
                    "text-[7px] font-black text-slate-900 text-right pr-2 uppercase",
                  )}
                >
                  SUBTOTAL
                </Text>
              </View>
              <View style={tw("w-[18%] py-2 justify-center")}>
                <Text
                  style={tw("text-[8px] font-black text-slate-900 text-right pr-6")}
                >
                  Rs. {Number(subtotalAmount).toLocaleString()}
                </Text>
              </View>
            </View>

            {/* ADVANCE PAID & REMAINING (Only for Reservations) */}
            {isReservation && (
              <>
                <View style={tw("flex flex-row border-b border-slate-100")}>
                  <View style={tw("flex-1 py-2")} />
                  <View
                    style={tw(
                      "w-[12%] py-2 border-l border-slate-100 justify-center",
                    )}
                  >
                    <Text
                      style={tw(
                        "text-[7px] font-black text-slate-900 text-right pr-2 uppercase",
                      )}
                    >
                      ADVANCE PAID
                    </Text>
                  </View>
                  <View style={tw("w-[18%] py-2 justify-center")}>
                    <Text
                      style={tw("text-[8px] font-black text-slate-900 text-right pr-6")}
                    >
                      Rs. {Number(advancePaid).toLocaleString()}
                    </Text>
                  </View>
                </View>

                <View style={tw("flex flex-row border-b border-slate-100")}>
                  <View style={tw("flex-1 py-2")} />
                  <View
                    style={tw(
                      "w-[12%] py-2 border-l border-slate-100 justify-center",
                    )}
                  >
                    <Text
                      style={tw(
                        "text-[7px] font-black text-slate-900 text-right pr-2 uppercase",
                      )}
                    >
                      REMAINING
                    </Text>
                  </View>
                  <View style={tw("w-[18%] py-2 justify-center")}>
                    <Text
                      style={tw("text-[8px] font-black text-orange-600 text-right pr-6")}
                    >
                      Rs. {Number(balanceDue).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {/* Grand Total Row */}
            <View
              style={[
                tw("flex flex-row items-center"),
                { backgroundColor: brandColor || "#0f172a" },
              ]}
            >
              {/* Merged all columns except TOTAL to easily push the text to the right */}
              <View style={tw("flex-1 py-3 justify-center")}>
                <Text
                  style={tw(
                    "text-[8px] font-bold text-white uppercase tracking-widest text-right",
                  )}
                >
                  Grand Total :
                </Text>
              </View>
              {/* Kept the TOTAL column exact width for perfect vertical alignment */}
              <View style={tw("w-[18%] py-3 justify-center")}>
                <Text
                  style={tw("text-[9px] font-bold text-white text-right pr-6")}
                >
                  Rs. {Number(grandTotalAmount).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Amount in words */}
        <View style={tw("flex flex-row items-center mb-4")}>
          <Text
            style={[
              tw("text-[9px] font-black shrink-0"),
              { color: brandColor },
            ]}
          >
            Amount in Words: Rupees
          </Text>
          <View
            style={[
              tw("flex-1 mx-2 border-b h-4 flex flex-row justify-center items-center"),
              { borderColor: brandColor },
            ]}
          >
            <Text
              style={[
                tw("text-[9px] italic font-medium text-center"),
                { color: brandColor },
              ]}
            >
              {data?.totalInWords || toWords(grandTotalAmount)}
            </Text>
          </View>
          <Text
            style={[
              tw("text-[9px] font-black shrink-0"),
              { color: brandColor },
            ]}
          >
            Only
          </Text>
        </View>

        {/* Footer Details */}
        <View style={tw("flex flex-row gap-6 items-start")}>
          {/* Bank Details Grid */}
          <View style={tw("w-[45%] border border-slate-200")}>
            {[
              {
                label: "Account Name",
                value: isPreview
                  ? "Avan Homes"
                  : settings?.bankDetails?.accountName || "N/A",
              },
              {
                label: "Bank Name",
                value: isPreview
                  ? "AXIS BANK LTD"
                  : settings?.bankDetails?.bankName || "N/A",
              },
              {
                label: "Branch",
                value: isPreview
                  ? "NINE MILE ROAD RJ, JODHPUR"
                  : settings?.bankDetails?.branchName || "N/A",
              },
              {
                label: "Account No.",
                value: isPreview
                  ? "921020057962261"
                  : settings?.bankDetails?.accountNumber || "N/A",
              },
              {
                label: "IFSC Code",
                value: isPreview
                  ? "UTIB0004728"
                  : settings?.bankDetails?.ifscCode || "N/A",
              },
              {
                label: "Account Type",
                value: isPreview
                  ? "Current Account"
                  : settings?.bankDetails?.accountType || "N/A",
              },
            ].map((item, i) => (
              <View
                key={i}
                style={tw("flex flex-row border-b border-slate-200")}
              >
                <View
                  style={tw(
                    "w-32 bg-[#f8fafc] py-2 px-3 border-r border-slate-200",
                  )}
                >
                  <Text style={tw("text-[8px] font-black text-slate-900")}>
                    {item.label}
                  </Text>
                </View>
                <View
                  style={tw("flex-1 py-2 px-3 flex flex-row justify-center")}
                >
                  <Text style={tw("text-[8px] font-black text-slate-900")}>
                    {item.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Terms Box */}
          <View
            style={[
              tw("flex-1 border rounded-3xl py-2 px-5"),
              { borderColor: brandColor },
            ]}
          >
            <Text
              style={[
                tw("text-[8px] font-black mb-1"),
                { color: brandColor },
              ]}
            >
              Payment Terms
            </Text>
            {(isPreview
              ? [
                  "50% advance to confirm the booking.",
                  "Remaining 50% due 48 hours before check-in.",
                  "Full payment required before check-in.",
                  "Damage deposit: Rs. 10,000 (refundable at check-out).",
                  "Accepted: bank transfer or cash.",
                ]
              : settings?.paymentTerms || [
                  "50% advance to confirm the booking.",
                  "Remaining 50% due 48 hours before check-in.",
                  "Full payment required before check-in.",
                ]
            )
              .slice(0, 5)
              .map((term: string, i: number) => (
                <Text
                  key={i}
                  style={tw("text-[7px] text-gray-500 mb-1 leading-tight")}
                >
                  • {term}
                </Text>
              ))}

            <Text
              style={[
                tw("text-[8px] font-black mt-1 mb-1"),
                { color: brandColor },
              ]}
            >
              Cancellation Policy
            </Text>
            {(isPreview
              ? [
                  "60+ days before check-in: 100% refund.",
                  "30-60 days before check-in: 50% refund.",
                  "Less than 30 days before check-in: No refund.",
                ]
              : settings?.cancellationPolicies || [
                  "60+ days before check-in: 100% refund.",
                  "30-60 days before check-in: 50% refund.",
                ]
            )
              .slice(0, 3)
              .map((policy: string, i: number) => (
                <Text
                  key={i}
                  style={tw("text-[7px] text-gray-500 mb-1 leading-tight")}
                >
                  • {policy}
                </Text>
              ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ModernLayout;
