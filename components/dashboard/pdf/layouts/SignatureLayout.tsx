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

const SignatureLayout = ({ data, settings, tw }: LayoutProps) => {
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
    <View style={tw("flex-1 bg-white")}>
      {/* Luxury Vertical Sidebar Accent */}
      <View
        style={[
          tw("absolute left-0 top-0 bottom-0 w-1.5"),
          { backgroundColor: brandColor },
        ]}
      />

      <View style={tw("pl-10 pr-8 pt-4 pb-4 flex-1")}>
        {/* Header - Minimalist Luxury */}
        <View style={tw("flex flex-row justify-between items-start mb-2")}>
          <View>
            {/* Dynamic Logo from Settings */}
            {(settings?.profilePicture || settings?.logo) && (
              <Image
                src={settings.profilePicture || settings.logo}
                style={[
                  tw("w-14 h-14 rounded-full mb-3 object-cover border border-gray-100"),
                  { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 }
                ]}
              />
            )}
            <Text
              style={[
                tw("text-3xl font-black uppercase tracking-tighter"),
                { color: brandColor },
              ]}
            >
              {propertyTitle}
            </Text>
            <View style={[tw("w-12 h-1 mt-0.5"), { backgroundColor: brandColor }]} />
            <Text style={tw("text-[8px] text-gray-400 mt-1.5 uppercase font-bold")}>
              {isPreview ? "123, DEMO BUSINESS PARK, SECTOR 5, JODHPUR" : settings?.address || "N/A"}
            </Text>
            <Text style={tw("text-[7px] text-gray-400 mt-0.5 uppercase font-bold")}>
              GSTIN: {isPreview ? "08ABWFA8226H1ZY" : settings?.bankDetails?.gstNumber || "N/A"} • PHONE: {isPreview ? "+91 88902 77537" : settings?.phoneNumber || "N/A"}
            </Text>
            <Text style={tw("text-[7px] text-gray-400 mt-0.5 uppercase font-bold")}>
              EMAIL: {isPreview ? "CONTACT@SHAPESBYTES.IN" : settings?.email || "N/A"} • WEB: {isPreview ? "WWW.SHAPESBYTES.IN" : settings?.websiteLink || "N/A"}
            </Text>
          </View>
          <View style={tw("text-right")}>
            <Text style={[tw("text-2xl font-black uppercase tracking-tighter"), { color: brandColor }]}>
              {data?.type === "quotation" ? "Quotation" : "Reservation"}
            </Text>
            <Text style={tw("text-[8px] text-gray-400 mt-0.5 uppercase font-black")}>
              ID: <Text style={{ color: brandColor }}>{data?.bookingId || "AVH-DEMO"}</Text>
            </Text>
          </View>
        </View>

        {/* Guest Greeting Section */}
        <View style={tw("mb-2")}>
          <Text style={[tw("text-xl font-bold mb-0.5"), { color: brandColor }]}>
            Greetings, {data?.clientName || "Valued Guest"}
          </Text>
          <Text style={tw("text-[8px] text-gray-500 leading-relaxed max-w-[480px]")}>
            We are pleased to present this {data?.type} for your stay. At {propertyTitle}, we prioritize your comfort and aim to provide a seamless hospitality experience. Please find the detailed breakdown of your booking below.
          </Text>
        </View>

        {/* Information Section Header */}
        <View style={[tw("py-1.5 px-3 mb-0 rounded-t-sm"), { backgroundColor: brandColor }]}>
          <Text style={tw("text-[8px] font-bold text-white tracking-widest uppercase")}>
            {data?.type === "quotation" ? "QUOTATION" : "RESERVATION"} INFORMATION
          </Text>
        </View>

        {/* Information Grid - Parity with Modern/Classic */}
        <View style={tw("mb-2")}>
          <View style={[tw("border-t border-b py-2 flex flex-row"), { borderColor: brandColor }]}>
            <View style={tw("flex-[0.8]")}>
              <Text style={tw("text-[7px] text-gray-400 font-bold uppercase mb-1")}>Date Issued</Text>
              <Text style={[tw("text-[9px] font-black"), { color: brandColor }]}>{formatDate(createdDate)}</Text>
            </View>
            <View style={[tw("flex-[0.8] border-l pl-4"), { borderColor: brandColor }]}>
              <Text style={tw("text-[7px] text-gray-400 font-bold uppercase mb-1")}>Valid Until</Text>
              <Text style={[tw("text-[9px] font-black"), { color: brandColor }]}>{formatDate(data?.validUntil)}</Text>
            </View>
            <View style={[tw("flex-[1] border-l pl-4"), { borderColor: brandColor }]}>
              <Text style={tw("text-[7px] text-gray-400 font-bold uppercase mb-1")}>Contact No.</Text>
              <Text style={[tw("text-[9px] font-black"), { color: brandColor }]}>{clientPhone}</Text>
            </View>
            <View style={[tw("flex-[1.4] border-l pl-4"), { borderColor: brandColor }]}>
              <Text style={tw("text-[7px] text-gray-400 font-bold uppercase mb-1")}>Email Address</Text>
              <Text style={[tw("text-[9px] font-black"), { color: brandColor }]}>{isPreview ? "demo@shapesbytes.in" : data?.clientEmail || data?.email || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Stay Summary Bar */}
        <View style={tw("flex flex-row gap-4 mb-2")}>
          {[
            { label: "Arrival", value: formatDate(data?.checkIn) },
            { label: "Departure", value: formatDate(data?.checkOut) },
            { label: "Nights", value: data?.nights || "0" },
            { label: "Total Guests", value: guestCount },
          ].map((item, i) => (
            <View key={i} style={[tw("flex-1 p-1.5 px-2.5 border-l-2 bg-gray-50"), { borderLeftColor: brandColor }]}>
              <Text style={tw("text-[6px] text-gray-400 font-bold uppercase mb-1")}>{item.label}</Text>
              <Text style={[tw("text-[10px] font-black"), { color: brandColor }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Pricing Section Header */}
        <View style={[tw("py-1.5 px-3 mb-0 mt-2 rounded-t-sm"), { backgroundColor: brandColor }]}>
          <Text style={tw("text-[8px] font-bold text-white tracking-widest uppercase")}>
            Pricing and Services
          </Text>
        </View>

        {/* Pricing Table */}
        <View style={[tw("mb-3 border"), { borderColor: brandColor }]}>
          <View style={[tw("flex flex-row"), { backgroundColor: brandColor }]}>
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
            <View style={tw("w-[18%] py-2 justify-center")}><Text style={tw("text-[7px] font-black text-white text-right pr-6")}>TOTAL</Text></View>
          </View>

          {((data?.rooms || []).concat(data?.services || [])).map((item: any, i: number) => (
            <View key={i} style={[tw("flex flex-row border-b"), { borderBottomColor: brandColor, borderBottomWidth: 0.5 }]}>
              <View style={[tw("w-[8%] py-1.5 justify-center border-r"), { borderRightColor: brandColor, borderRightWidth: 0.5 }]}><Text style={[tw("text-[8px] text-center"), { color: brandColor }]}>{i + 1}</Text></View>
              <View style={[tw("flex-1 py-1.5 px-3 justify-center border-r"), { borderRightColor: brandColor, borderRightWidth: 0.5 }]}>
                {(() => {
                  let name = item.roomName || item.serviceName || "";
                  let extra = item.description || "";
                  if (!item.roomName && name.includes(" | ")) {
                    const parts = name.split(" | ");
                    name = parts[0];
                    extra = parts[1];
                  }
                  return (
                    <>
                      <Text style={[tw("text-[8px] font-bold"), { color: brandColor }]}>{name}</Text>
                      {(item.roomType || extra) && (
                        <Text style={tw("text-[7px] text-gray-400 mt-1 font-medium")}>
                          {item.roomType && item.roomType !== item.roomName ? item.roomType : (extra || "")}
                        </Text>
                      )}
                    </>
                  );
                })()}
              </View>
              <View style={[tw("w-[10%] py-1.5 justify-center border-r"), { borderRightColor: brandColor, borderRightWidth: 0.5 }]}><Text style={[tw("text-[8px] text-right pr-4"), { color: brandColor }]}>{item.qty || data?.nights}</Text></View>
              <View style={[tw("w-[15%] py-1.5 justify-center border-r"), { borderRightColor: brandColor, borderRightWidth: 0.5 }]}><Text style={[tw("text-[8px] text-right pr-4"), { color: brandColor }]}>{Number(item.rate).toFixed(2)}</Text></View>
              {hasGST && (
                <View style={[tw("w-[12%] py-1.5 justify-center border-r"), { borderRightColor: brandColor, borderRightWidth: 0.5 }]}><Text style={[tw("text-[8px] text-right pr-4"), { color: brandColor }]}>{item.gst || 0}%</Text></View>
              )}
              <View style={tw("w-[18%] py-1.5 justify-center")}><Text style={[tw("text-[8px] font-bold text-right pr-6"), { color: brandColor }]}>{Number(item.total).toFixed(2)}</Text></View>
            </View>
          ))}

          {hasGST && (
            <View style={[tw("flex flex-row border-b"), { borderBottomColor: brandColor, borderBottomWidth: 0.5 }]}>
              <View
                style={[
                  tw("w-[8%] flex-shrink-0 py-2 border-r"),
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
                  tw("w-[10%] flex-shrink-0 py-2 border-r"),
                  { borderRightColor: brandColor, borderRightWidth: 0.5 },
                ]}
              />
              <View
                style={[
                  tw("w-[15%] flex-shrink-0 py-2 border-r"),
                  { borderRightColor: brandColor, borderRightWidth: 0.5 },
                ]}
              />
              <View
                style={[
                  tw("w-[12%] flex-shrink-0 py-2 border-r justify-center"),
                  { borderRightColor: brandColor, borderRightWidth: 0.5 },
                ]}
              >
                <Text style={[tw("text-[7px] font-black text-right pr-2 uppercase"), { color: brandColor }]}>TOTAL GST</Text>
              </View>
              <View style={tw("w-[18%] flex-shrink-0 py-2 justify-center")}><Text style={[tw("text-[8px] font-black text-right pr-6"), { color: brandColor }]}>Rs. {Number(taxAmount).toLocaleString()}</Text></View>
            </View>
          )}

          {/* SUBTOTAL */}
          <View style={[tw("flex flex-row border-b"), { borderBottomColor: brandColor, borderBottomWidth: 0.5 }]}>
            <View
              style={[
                tw("w-[8%] flex-shrink-0 py-2 border-r"),
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
                tw("w-[10%] flex-shrink-0 py-2 border-r"),
                { borderRightColor: brandColor, borderRightWidth: 0.5 },
              ]}
            />
            {hasGST ? (
              <>
                <View
                  style={[
                    tw("w-[15%] flex-shrink-0 py-2 border-r"),
                    { borderRightColor: brandColor, borderRightWidth: 0.5 },
                  ]}
                />
                <View
                  style={[
                    tw("w-[12%] flex-shrink-0 py-2 border-r justify-center"),
                    { borderRightColor: brandColor, borderRightWidth: 0.5 },
                  ]}
                >
                  <Text style={[tw("text-[7px] font-black text-right pr-2 uppercase"), { color: brandColor }]}>SUBTOTAL</Text>
                </View>
              </>
            ) : (
              <View
                style={[
                  tw("w-[15%] flex-shrink-0 py-2 border-r justify-center"),
                  { borderRightColor: brandColor, borderRightWidth: 0.5 },
                ]}
              >
                <Text style={[tw("text-[7px] font-black text-right pr-2 uppercase"), { color: brandColor }]}>SUBTOTAL</Text>
              </View>
            )}
            <View style={tw("w-[18%] flex-shrink-0 py-2 justify-center")}><Text style={[tw("text-[8px] font-black text-right pr-6"), { color: brandColor }]}>Rs. {Number(subtotalAmount).toLocaleString()}</Text></View>
          </View>

          {/* ADVANCE PAID & REMAINING (Only for Reservations) */}
          {isReservation && (
            <>
              <View style={[tw("flex flex-row border-b"), { borderBottomColor: brandColor, borderBottomWidth: 0.5 }]}>
                <View
                  style={[
                    tw("w-[8%] flex-shrink-0 py-2 border-r"),
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
                    tw("w-[10%] flex-shrink-0 py-2 border-r"),
                    { borderRightColor: brandColor, borderRightWidth: 0.5 },
                  ]}
                />
                {hasGST ? (
                  <>
                    <View
                      style={[
                        tw("w-[15%] flex-shrink-0 py-2 border-r"),
                        { borderRightColor: brandColor, borderRightWidth: 0.5 },
                      ]}
                    />
                    <View
                      style={[
                        tw("w-[12%] flex-shrink-0 py-2 border-r justify-center"),
                        { borderRightColor: brandColor, borderRightWidth: 0.5 },
                      ]}
                    >
                      <Text style={[tw("text-[7px] font-black text-right pr-2 uppercase"), { color: brandColor }]}>ADVANCE PAID</Text>
                    </View>
                  </>
                ) : (
                  <View
                    style={[
                      tw("w-[15%] flex-shrink-0 py-2 border-r justify-center"),
                      { borderRightColor: brandColor, borderRightWidth: 0.5 },
                    ]}
                  >
                    <Text style={[tw("text-[7px] font-black text-right pr-2 uppercase"), { color: brandColor }]}>ADVANCE PAID</Text>
                  </View>
                )}
                <View style={tw("w-[18%] flex-shrink-0 py-2 justify-center")}><Text style={[tw("text-[8px] font-black text-right pr-6"), { color: brandColor }]}>Rs. {Number(advancePaid).toLocaleString()}</Text></View>
              </View>

              <View style={[tw("flex flex-row border-b"), { borderBottomColor: brandColor, borderBottomWidth: 0.5 }]}>
                <View
                  style={[
                    tw("w-[8%] flex-shrink-0 py-2 border-r"),
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
                    tw("w-[10%] flex-shrink-0 py-2 border-r"),
                    { borderRightColor: brandColor, borderRightWidth: 0.5 },
                  ]}
                />
                {hasGST ? (
                  <>
                    <View
                      style={[
                        tw("w-[15%] flex-shrink-0 py-2 border-r"),
                        { borderRightColor: brandColor, borderRightWidth: 0.5 },
                      ]}
                    />
                    <View
                      style={[
                        tw("w-[12%] flex-shrink-0 py-2 border-r justify-center"),
                        { borderRightColor: brandColor, borderRightWidth: 0.5 },
                      ]}
                    >
                      <Text style={[tw("text-[7px] font-black text-right pr-2 uppercase"), { color: brandColor }]}>REMAINING</Text>
                    </View>
                  </>
                ) : (
                  <View
                    style={[
                      tw("w-[15%] flex-shrink-0 py-2 border-r justify-center"),
                      { borderRightColor: brandColor, borderRightWidth: 0.5 },
                    ]}
                  >
                    <Text style={[tw("text-[7px] font-black text-right pr-2 uppercase"), { color: brandColor }]}>REMAINING</Text>
                  </View>
                )}
                <View style={tw("w-[18%] flex-shrink-0 py-2 justify-center")}><Text style={[tw("text-[8px] font-black text-right pr-6"), { color: brandColor }]}>Rs. {Number(balanceDue).toLocaleString()}</Text></View>
              </View>
            </>
          )}

          {/* GRAND TOTAL */}
          <View style={[tw("flex flex-row items-center"), { backgroundColor: brandColor }]}>
            <View style={tw("flex-1 py-3 pr-4 justify-center")}><Text style={tw("text-[8px] font-bold text-white uppercase tracking-widest text-right")}>Grand Total :</Text></View>
            <View style={tw("w-[18%] py-3 justify-center")}><Text style={tw("text-[10px] font-bold text-white text-right pr-6")}>Rs. {Number(grandTotalAmount).toLocaleString()}</Text></View>
          </View>
        </View>

        {/* Amount in words */}
        <View style={tw("flex flex-row items-center")}>
          <Text style={[tw("text-[8px] font-black uppercase"), { color: brandColor }]}>Amount in Words: Rupees</Text>
          <View style={[tw("flex-1 mx-2 border-b h-4 flex flex-row justify-center items-center"), { borderColor: brandColor, borderBottomWidth: 0.5 }]}>
            <Text style={[tw("text-[8px] italic font-medium text-center"), { color: brandColor }]}>{data?.totalInWords || toWords(grandTotalAmount)}</Text>
          </View>
          <Text style={[tw("text-[8px] font-black uppercase"), { color: brandColor }]}>Only</Text>
        </View>

        {/* Bank & Terms Section - Parity with other layouts */}
        <View style={tw("flex flex-row gap-6 items-start mt-3")}>
          {/* Bank Details */}
          <View style={[tw("w-[38%] border"), { borderColor: brandColor }]}>
            {[
              { label: "Account Name", value: isPreview ? "ShapesBytes" : settings?.bankDetails?.accountName || "N/A" },
              { label: "Bank Name", value: isPreview ? "AXIS BANK LTD" : settings?.bankDetails?.bankName || "N/A" },
              { label: "Branch", value: isPreview ? "NINE MILE ROAD RJ" : settings?.bankDetails?.branchName || "N/A" },
              { label: "Account No.", value: isPreview ? "921020057962261" : settings?.bankDetails?.accountNumber || "N/A" },
              { label: "IFSC Code", value: isPreview ? "UTIB0004728" : settings?.bankDetails?.ifscCode || "N/A" },
              { label: "Account Type", value: isPreview ? "Current Account" : settings?.bankDetails?.accountType || "N/A" },
            ].map((item, i) => (
              <View key={i} style={[tw("flex flex-row border-b last:border-b-0"), { borderBottomColor: brandColor, borderBottomWidth: 0.5 }]}>
                <View style={[tw("w-20 p-1.5 border-r bg-gray-50"), { borderRightColor: brandColor, borderRightWidth: 0.5 }]}>
                  <Text style={tw("text-[6px] font-bold text-gray-400 uppercase")}>{item.label}</Text>
                </View>
                <View style={tw("flex-1 p-1.5")}>
                  <Text style={[tw("text-[6px] font-black"), { color: brandColor }]}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Terms & Policies */}
          <View style={tw("flex-1 flex flex-row gap-6")}>
            <View style={tw("flex-1")}>
              <Text style={[tw("text-[8px] font-black uppercase tracking-widest mb-2"), { color: brandColor }]}>Payment Terms</Text>
              {(isPreview ? ["50% advance to confirm.", "50% due 48 hours before check-in.", "Full payment before check-in."] : settings?.paymentTerms || []).slice(0, 3).map((term: string, i: number) => (
                <View key={i} style={tw("flex flex-row items-start mb-1")}>
                  <Text style={tw("text-[7px] text-gray-500 mr-1")}>•</Text>
                  <Text style={tw("flex-1 text-[7px] text-gray-500 leading-tight")}>{term}</Text>
                </View>
              ))}
            </View>
            <View style={tw("flex-1")}>
              <Text style={[tw("text-[8px] font-black uppercase tracking-widest mb-2"), { color: brandColor }]}>Cancellation Policy</Text>
              {(isPreview ? ["60+ days: 100% refund.", "30-60 days: 50% refund.", "Less than 30 days: No refund."] : settings?.cancellationPolicies || []).slice(0, 3).map((policy: string, i: number) => (
                <View key={i} style={tw("flex flex-row items-start mb-1")}>
                  <Text style={tw("text-[7px] text-gray-500 mr-1")}>•</Text>
                  <Text style={tw("flex-1 text-[7px] text-gray-500 leading-tight")}>{policy}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignatureLayout;
