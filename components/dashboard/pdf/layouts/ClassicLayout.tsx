import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";

interface LayoutProps {
  data: any;
  settings: any;
  tw: any;
}

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

const ClassicLayout = ({ data, settings, tw }: LayoutProps) => {
  const isPreview = settings?.isPreview;
  const brandColor = settings?.pdf?.color || settings?.pdfConfig?.color || "#ea580c";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toISOString().split("T")[0];
    } catch (e) {
      return dateStr;
    }
  };

  const propertyTitle = isPreview
    ? "SHAPESBYTES"
    : settings?.title || "SHAPESBYTES";

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
    <View style={tw("flex-1 bg-white p-10")}>
      {/* Header - Classic Centered with Double Divider */}
      <View style={tw("flex flex-col items-center mb-2")}>
        {/* Dynamic Logo from Settings */}
        {(settings?.profilePicture || settings?.logo) && (
          <Image
            src={settings.profilePicture || settings.logo}
            style={[
              tw("w-16 h-16 rounded-full mb-4 object-cover border border-gray-100"),
              { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 }
            ]}
          />
        )}
        <Text
          style={[
            tw("text-3xl font-bold uppercase tracking-[0.2em] mb-2"),
            { color: brandColor },
          ]}
        >
          {propertyTitle}
        </Text>
        <View
          style={[tw("w-full h-[2px] mb-2"), { backgroundColor: brandColor }]}
        />

        <View style={tw("flex flex-col items-center")}>
          <Text
            style={tw(
              "text-[8px] text-gray-500 uppercase tracking-widest mb-1",
            )}
          >
            {isPreview
              ? "123, DEMO BUSINESS PARK, SECTOR 5, JODHPUR, RAJASTHAN - 342001"
              : settings?.address || "N/A"}
          </Text>
          <Text
            style={tw("text-[8px] text-gray-500 uppercase tracking-widest")}
          >
            GSTIN:{" "}
            {isPreview
              ? "08ABWFA8226H1ZY"
              : settings?.bankDetails?.gstNumber || "N/A"}{" "}
            • PHONE:{" "}
            {isPreview ? "+91 88902 77537" : settings?.phoneNumber || "N/A"} •
            EMAIL:{" "}
            {isPreview ? "CONTACT@SHAPESBYTES.IN" : settings?.email || "N/A"}
          </Text>
          {settings?.websiteLink && (
            <Text
              style={tw(
                "text-[8px] text-gray-500 uppercase tracking-widest mt-1",
              )}
            >
              WEBSITE: {isPreview ? "WWW.SHAPESBYTES.IN" : settings.websiteLink}
            </Text>
          )}
        </View>
        <View
          style={[
            tw("w-full h-[1px] mt-4"),
            { backgroundColor: brandColor, opacity: 0.2 },
          ]}
        />
      </View>

      {/* Document Type & ID */}
      <View style={tw("flex flex-row justify-between items-end mb-4")}>
        <View>
          <Text
            style={[
              tw("text-2xl font-black uppercase tracking-tighter"),
              { color: brandColor },
            ]}
          >
            {data?.type === "quotation" ? "Quotation" : "Reservation"}
          </Text>
          <View
            style={[tw("w-12 h-1 mt-1"), { backgroundColor: brandColor }]}
          />
        </View>
        <View style={tw("text-right")}>
          <Text style={tw("text-[8px] text-gray-400 uppercase font-black")}>
            {data?.type} ID
          </Text>
          <Text
            style={[tw("text-sm font-bold uppercase"), { color: brandColor }]}
          >
            {data?.bookingId || "AVH-DEMO"}
          </Text>
        </View>
      </View>

      {/* Stay Info Section - Centered Grid */}
      <View
        style={[
          tw("mb-4 border rounded-sm overflow-hidden"),
          { borderColor: brandColor },
        ]}
      >
        <View
          style={[tw("flex flex-row py-2"), { backgroundColor: brandColor }]}
        >
          <Text
            style={tw(
              "flex-1 text-[7px] font-bold text-white text-center uppercase tracking-widest",
            )}
          >
            Check-In Date
          </Text>
          <Text
            style={tw(
              "flex-1 text-[7px] font-bold text-white text-center uppercase tracking-widest",
            )}
          >
            Check-Out Date
          </Text>
          <Text
            style={tw(
              "flex-1 text-[7px] font-bold text-white text-center uppercase tracking-widest",
            )}
          >
            No. of Nights
          </Text>
          <Text
            style={tw(
              "flex-1 text-[7px] font-bold text-white text-center uppercase tracking-widest",
            )}
          >
            No. of Guests
          </Text>
        </View>
        <View style={tw("flex flex-row py-3")}>
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

      {/* Information Grid - Exact Match to Modern */}
      <View style={tw("mb-4")}>
        <View
          style={[
            tw("border flex flex-row flex-wrap"),
            { borderColor: brandColor },
          ]}
        >
          <View
            style={[
              tw("w-1/4 p-2.5 border-b border-r bg-white"),
              { borderColor: brandColor },
            ]}
          >
            <Text style={tw("text-[7px] font-bold text-gray-400 uppercase")}>
              DATE
            </Text>
          </View>
          <View
            style={[
              tw("w-1/4 p-2.5 border-b border-r bg-white"),
              { borderColor: brandColor },
            ]}
          >
            <Text style={[tw("text-[7px] font-bold"), { color: brandColor }]}>
              {formatDate(createdDate)}
            </Text>
          </View>
          <View
            style={[
              tw("w-1/4 p-2.5 border-b border-r bg-white"),
              { borderColor: brandColor },
            ]}
          >
            <Text style={tw("text-[7px] font-bold text-gray-400 uppercase")}>
              PREPARED FOR
            </Text>
          </View>
          <View
            style={[
              tw("w-1/4 p-2.5 border-b bg-white"),
              { borderColor: brandColor },
            ]}
          >
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
            style={[
              tw("w-1/4 p-2.5 border-b border-r bg-white"),
              { borderColor: brandColor },
            ]}
          >
            <Text style={tw("text-[7px] font-bold text-gray-400 uppercase")}>
              VALID UNTIL
            </Text>
          </View>
          <View
            style={[
              tw("w-1/4 p-2.5 border-b border-r bg-white"),
              { borderColor: brandColor },
            ]}
          >
            <Text style={[tw("text-[7px] font-bold"), { color: brandColor }]}>
              {formatDate(data?.validUntil)}
            </Text>
          </View>
          <View
            style={[
              tw("w-1/4 p-2.5 border-b border-r bg-white"),
              { borderColor: brandColor },
            ]}
          >
            <Text style={tw("text-[7px] font-bold text-gray-400 uppercase")}>
              CONTACT
            </Text>
          </View>
          <View
            style={[
              tw("w-1/4 p-2.5 border-b bg-white"),
              { borderColor: brandColor },
            ]}
          >
            <Text style={[tw("text-[7px] font-bold"), { color: brandColor }]}>
              {clientPhone}
            </Text>
          </View>

          <View
            style={[
              tw("w-1/4 p-2.5 border-r bg-white"),
              { borderColor: brandColor },
            ]}
          >
            <Text style={tw("text-[7px] font-bold text-gray-400 uppercase")}>
              {data?.type} ID
            </Text>
          </View>
          <View
            style={[
              tw("w-1/4 p-2.5 border-r bg-white"),
              { borderColor: brandColor },
            ]}
          >
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
            style={[
              tw("w-1/4 p-2.5 border-r bg-white"),
              { borderColor: brandColor },
            ]}
          >
            <Text style={tw("text-[7px] font-bold text-gray-400 uppercase")}>
              CLIENT EMAIL
            </Text>
          </View>
          <View style={tw("w-1/4 p-2.5 bg-white")}>
            <Text style={[tw("text-[7px] font-bold"), { color: brandColor }]}>
              {isPreview ? "demo@shapesbytes.in" : data?.clientEmail || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Pricing Table - Exact Match to Modern Logic */}
      <View style={[tw("mb-4 border"), { borderColor: brandColor }]}>
        <View
          style={[
            tw("flex flex-row border-b"),
            { backgroundColor: brandColor, borderColor: brandColor },
          ]}
        >
          <View
            style={[
              tw("w-[8%] py-2 justify-center border-r"),
              { borderRightColor: "#ffffff", borderRightWidth: 0.5 },
            ]}
          >
            <Text style={tw("text-[7px] font-black text-white text-center")}>
              #
            </Text>
          </View>
          <View
            style={[
              tw("flex-1 py-2 px-3 justify-center border-r"),
              { borderRightColor: "#ffffff", borderRightWidth: 0.5 },
            ]}
          >
            <Text style={tw("text-[7px] font-black text-white")}>
              DESCRIPTION
            </Text>
          </View>
          <View
            style={[
              tw("w-[10%] py-2 justify-center border-r"),
              { borderRightColor: "#ffffff", borderRightWidth: 0.5 },
            ]}
          >
            <Text
              style={tw("text-[7px] font-black text-white text-right pr-4")}
            >
              QTY
            </Text>
          </View>
          <View
            style={[
              tw("w-[15%] py-2 justify-center border-r"),
              { borderRightColor: "#ffffff", borderRightWidth: 0.5 },
            ]}
          >
            <Text
              style={tw("text-[7px] font-black text-white text-right pr-4")}
            >
              RATE
            </Text>
          </View>
          {hasGST && (
            <View
              style={[
                tw("w-[12%] py-2 justify-center border-r"),
                { borderRightColor: "#ffffff", borderRightWidth: 0.5 },
              ]}
            >
              <Text
                style={tw("text-[7px] font-black text-white text-right pr-4")}
              >
                GST (%)
              </Text>
            </View>
          )}
          <View style={tw("w-[18%] py-2 justify-center")}>
            <Text
              style={tw("text-[7px] font-black text-white text-right pr-6")}
            >
              TOTAL
            </Text>
          </View>
        </View>

        {(data?.rooms || [])
          .concat(data?.services || [])
          .map((item: any, i: number) => (
            <View
              key={i}
              style={[
                tw("flex flex-row border-b"),
                { borderBottomColor: brandColor, borderBottomWidth: 0.5 },
              ]}
            >
              <View
                style={[
                  tw("w-[8%] flex-shrink-0 py-3 border-r justify-center"),
                  { borderRightColor: brandColor, borderRightWidth: 0.5 },
                ]}
              >
                <Text
                  style={[tw("text-[8px] text-center"), { color: brandColor }]}
                >
                  {i + 1}
                </Text>
              </View>
              <View
                style={[
                  tw("flex-1 py-3 px-3 border-r justify-center"),
                  { borderRightColor: brandColor, borderRightWidth: 0.5 },
                ]}
              >
                <Text
                  style={[tw("text-[8px] font-bold"), { color: brandColor }]}
                >
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
                style={[
                  tw("w-[10%] flex-shrink-0 py-3 border-r justify-center"),
                  { borderRightColor: brandColor, borderRightWidth: 0.5 },
                ]}
              >
                <Text
                  style={[
                    tw("text-[8px] text-right pr-4"),
                    { color: brandColor },
                  ]}
                >
                  {item.qty || data?.nights}
                </Text>
              </View>
              <View
                style={[
                  tw("w-[15%] flex-shrink-0 py-3 border-r justify-center"),
                  { borderRightColor: brandColor, borderRightWidth: 0.5 },
                ]}
              >
                <Text
                  style={[
                    tw("text-[8px] text-right pr-4"),
                    { color: brandColor },
                  ]}
                >
                  {Number(item.rate).toFixed(2)}
                </Text>
              </View>
                {hasGST && (
                  <View
                    style={[
                      tw("w-[12%] flex-shrink-0 py-3 border-r justify-center"),
                      { borderRightColor: brandColor, borderRightWidth: 0.5 },
                    ]}
                  >
                    <Text
                      style={[
                        tw("text-[8px] text-right pr-4"),
                        { color: brandColor },
                      ]}
                    >
                      {item.gst || 0}%
                    </Text>
                  </View>
                )}
              <View style={tw("w-[18%] flex-shrink-0 py-3 justify-center")}>
                <Text
                  style={[
                    tw("text-[8px] font-bold text-right pr-6"),
                    { color: brandColor },
                  ]}
                >
                  {Number(item.total).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}

        {/* TOTAL GST */}
        {hasGST && (
          <View
            style={[
              tw("flex flex-row border-b"),
              { borderBottomColor: brandColor, borderBottomWidth: 0.5 },
            ]}
          >
            <View
              style={[
                tw("w-[8%] py-2 border-r"),
                { borderRightColor: brandColor, borderRightWidth: 0.5 },
              ]}
            />
            <View
              style={[
                tw("flex-1 py-2 border-r"),
                { borderRightColor: brandColor, borderRightWidth: 0.5 },
              ]}
            />
            <View
              style={[
                tw("w-[10%] py-2 border-r"),
                { borderRightColor: brandColor, borderRightWidth: 0.5 },
              ]}
            />
            <View
              style={[
                tw("w-[15%] py-2 border-r"),
                { borderRightColor: brandColor, borderRightWidth: 0.5 },
              ]}
            />
            <View
              style={[
                tw("w-[12%] py-2 border-r justify-center"),
                { borderRightColor: brandColor, borderRightWidth: 0.5 },
              ]}
            >
              <Text
                style={[
                  tw("text-[7px] font-black text-right pr-2 uppercase"),
                  { color: brandColor },
                ]}
              >
                TOTAL GST
              </Text>
            </View>
            <View style={tw("w-[18%] py-2 justify-center")}>
              <Text
                style={[
                  tw("text-[8px] font-black text-right pr-6"),
                  { color: brandColor },
                ]}
              >
                Rs. {Number(taxAmount).toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* SUBTOTAL */}
        <View
          style={[
            tw("flex flex-row border-b"),
            { borderBottomColor: brandColor, borderBottomWidth: 0.5 },
          ]}
        >
          <View
            style={[
              tw("w-[8%] py-2 border-r"),
              { borderRightColor: brandColor, borderRightWidth: 0.5 },
            ]}
          />
          <View
            style={[
              tw("flex-1 py-2 border-r"),
              { borderRightColor: brandColor, borderRightWidth: 0.5 },
            ]}
          />
          <View
            style={[
              tw("w-[10%] py-2 border-r"),
              { borderRightColor: brandColor, borderRightWidth: 0.5 },
            ]}
          />
          <View
            style={[
              tw("w-[15%] py-2 border-r"),
              { borderRightColor: brandColor, borderRightWidth: 0.5 },
            ]}
          />
          <View
            style={[
              tw("w-[12%] py-2 border-r justify-center"),
              { borderRightColor: brandColor, borderRightWidth: 0.5 },
            ]}
          >
            <Text
              style={[
                tw("text-[7px] font-black text-right pr-2 uppercase"),
                { color: brandColor },
              ]}
            >
              SUBTOTAL
            </Text>
          </View>
          <View style={tw("w-[18%] py-2 justify-center")}>
            <Text
              style={[
                tw("text-[8px] font-black text-right pr-6"),
                { color: brandColor },
              ]}
            >
              Rs. {Number(subtotalAmount).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* ADVANCE PAID & REMAINING (Only for Reservations) */}
        {isReservation && (
          <>
            <View style={[tw("flex flex-row border-b"), { borderBottomColor: brandColor, borderBottomWidth: 0.5 }]}>
              <View style={tw("flex-1 py-2")} />
              <View
                style={[tw("w-[12%] py-2 justify-center border-l"), { borderLeftColor: brandColor, borderLeftWidth: 0.5 }]}
              >
                <Text
                  style={[tw("text-[7px] font-black text-right pr-2 uppercase"), { color: brandColor }]}
                >
                  ADVANCE PAID
                </Text>
              </View>
              <View style={tw("w-[18%] py-2 justify-center")}>
                <Text
                  style={[tw("text-[8px] font-black text-right pr-6"), { color: brandColor }]}
                >
                  Rs. {Number(advancePaid).toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={[tw("flex flex-row border-b"), { borderBottomColor: brandColor, borderBottomWidth: 0.5 }]}>
              <View style={tw("flex-1 py-2")} />
              <View
                style={[tw("w-[12%] py-2 justify-center border-l"), { borderLeftColor: brandColor, borderLeftWidth: 0.5 }]}
              >
                <Text
                  style={[tw("text-[7px] font-black text-right pr-2 uppercase"), { color: brandColor }]}
                >
                  REMAINING
                </Text>
              </View>
              <View style={tw("w-[18%] py-2 justify-center")}>
                <Text
                  style={[tw("text-[8px] font-black text-right pr-6"), { color: brandColor }]}
                >
                  Rs. {Number(balanceDue).toLocaleString()}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* GRAND TOTAL */}
        <View
          style={[
            tw("flex flex-row items-center"),
            { backgroundColor: brandColor },
          ]}
        >
          <View style={tw("flex-1 py-3 justify-center")}>
            <Text
              style={tw(
                "text-[8px] font-bold text-white uppercase tracking-widest text-right pr-4",
              )}
            >
              Grand Total :
            </Text>
          </View>
          <View style={tw("w-[18%] py-3 justify-center")}>
            <Text style={tw("text-[9px] font-bold text-white text-right pr-6")}>
              Rs. {Number(grandTotalAmount).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Amount in words */}
      <View style={tw("flex flex-row items-center mb-4")}>
        <Text
          style={[
            tw("text-[9px] font-black shrink-0 uppercase tracking-tighter"),
            { color: brandColor },
          ]}
        >
          Amount in Words: Rupees
        </Text>
        <View
          style={[
            tw("flex-1 mx-2 border-b h-4 flex flex-row justify-center items-center"),
            { borderColor: brandColor, borderBottomWidth: 0.5 },
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
            tw("text-[9px] font-black shrink-0 uppercase tracking-tighter"),
            { color: brandColor },
          ]}
        >
          Only
        </Text>
      </View>

      {/* Footer Section - Grid Style */}
      <View style={tw("flex flex-row gap-6")}>
        <View style={[tw("w-1/2 border"), { borderColor: brandColor }]}>
          <View style={[tw("py-1.5 px-3"), { backgroundColor: brandColor }]}>
            <Text
              style={tw(
                "text-[7px] font-bold text-white uppercase tracking-widest",
              )}
            >
              Bank Account Details
            </Text>
          </View>
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
              style={[
                tw("flex flex-row border-b"),
                { borderBottomColor: brandColor, borderBottomWidth: 0.5 },
              ]}
            >
              <View
                style={[
                  tw("w-28 py-2 px-3 border-r bg-white"),
                  {
                    borderRightColor: brandColor,
                    borderRightWidth: 0.5,
                  },
                ]}
              >
                <Text
                  style={[tw("text-[7px] font-black"), { color: brandColor }]}
                >
                  {item.label}
                </Text>
              </View>
              <View style={tw("flex-1 py-2 px-3 flex flex-row justify-center")}>
                <Text
                  style={[tw("text-[7px] font-black"), { color: brandColor }]}
                >
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={tw("w-1/2")}>
          <View style={tw("mb-4")}>
            <Text
              style={[
                tw(
                  "text-[8px] font-black uppercase border-b pb-1 mb-2 tracking-widest",
                ),
                { color: brandColor, borderColor: brandColor },
              ]}
            >
              Payment Terms
            </Text>
            {(isPreview
              ? [
                  "50% advance to confirm the booking.",
                  "Remaining 50% due 48 hours before check-in.",
                  "Full payment required before check-in.",
                ]
              : settings?.paymentTerms || []
            )
              .slice(0, 4)
              .map((term: string, i: number) => (
                <Text key={i} style={tw("text-[7px] text-gray-500 mb-1")}>
                  • {term}
                </Text>
              ))}
          </View>
          <View>
            <Text
              style={[
                tw(
                  "text-[8px] font-black uppercase border-b pb-1 mb-2 tracking-widest",
                ),
                { color: brandColor, borderColor: brandColor },
              ]}
            >
              Cancellation Policy
            </Text>
            {(isPreview
              ? [
                  "60+ days before check-in: 100% refund.",
                  "30-60 days before check-in: 50% refund.",
                ]
              : settings?.cancellationPolicies || []
            )
              .slice(0, 3)
              .map((policy: string, i: number) => (
                <Text key={i} style={tw("text-[7px] text-gray-500 mb-1")}>
                  • {policy}
                </Text>
              ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ClassicLayout;
