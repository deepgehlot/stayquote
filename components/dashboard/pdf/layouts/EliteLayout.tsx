import React from "react";
import { View, Text, Image, Svg, Polygon, Path } from "@react-pdf/renderer";

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

const EliteLayout = ({ data, settings, tw }: LayoutProps) => {
  const isPreview = settings?.isPreview;
  const brandColor = settings?.pdf?.color || settings?.pdfConfig?.color || "#ea580c";
  const darkColor = "#2b3445"; // The dark navy from the image

  const propertyTitle = isPreview ? "SHAPESBYTES" : settings?.title || "COMPANY";
  const tagline = isPreview ? "123, DEMO BUSINESS PARK, SECTOR 5, JODHPUR" : settings?.address || "Company Tagline Here";
  
  const gst = isPreview ? "08ABWFA8226H1ZY" : settings?.bankDetails?.gstNumber;
  const phone = isPreview ? "+91 88902 77537" : settings?.phoneNumber;
  const email = isPreview ? "CONTACT@SHAPESBYTES.IN" : settings?.email;
  const website = isPreview ? "WWW.SHAPESBYTES.IN" : settings?.websiteLink;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  // Data Normalization
  const guestCount = typeof data?.guests === 'object' ? (Number(data.guests.adults || 0) + Number(data.guests.kids || 0)) : (data?.guests || 0);
  const formattedGuests = isPreview 
    ? "02 Adults, 01 Kids" 
    : typeof data?.guests === 'object' 
      ? `${data.guests.adults || 0} Adults${data.guests.kids ? `, ${data.guests.kids} Kids` : ""}`
      : `${data?.guests || 0} Guests`;
  const taxAmount = data?.payment?.totalGST || data?.tax || data?.gst || 0;
  const subtotalAmount = data?.payment?.subtotal || data?.subtotal || 0;
  const grandTotalAmount = data?.payment?.grandTotal || data?.total || 0;
  const createdDate = data?.reservationDate || data?.createdAt;
  const advancePaid = data?.payment?.advancePaid || 0;
  const balanceDue = data?.payment?.pendingAmount || (grandTotalAmount - advancePaid);
  const isReservation = data?.type === "reservation";
  const hasGST = taxAmount > 0;

  return (
    <View style={tw("flex-1 bg-white relative")}>
      {/* Top Header Section with Angled Polygons */}
      <View style={tw("relative h-[120px] w-full")}>
        <Svg height="120" width="100%" style={tw("absolute top-0 left-0 right-0")}>
          {/* Dark shape */}
          <Polygon points="0,0 260,0 200,120 0,120" fill={darkColor} />
          {/* Accent shapes */}
          <Polygon points="260,0 290,0 230,120 200,120" fill={brandColor} opacity={0.5} />
          <Polygon points="290,0 340,0 280,120 230,120" fill={brandColor} />
        </Svg>
        
        <View style={tw("absolute inset-0 flex flex-row items-start px-10 pt-8")}>
          {/* Left Logo & Name */}
          <View style={tw("flex-1 flex flex-row items-center gap-3")}>
            {(settings?.profilePicture || settings?.logo) ? (
              <Image
                src={settings.profilePicture || settings.logo}
                style={tw("w-10 h-10 rounded-full object-cover")}
              />
            ) : (
               <View style={[tw("w-10 h-10 rounded-full flex items-center justify-center"), { backgroundColor: brandColor }]}>
                 <Text style={[tw("text-white text-lg font-bold"), { textAlign: "center", width: "100%", lineHeight: 1.2, marginTop: 1 }]}>
                   {propertyTitle.charAt(0)}
                 </Text>
               </View>
            )}
            <View style={[tw("space-y-0.5 mt-0.5"), { width: 170 }]}>
              <Text style={tw("text-white text-[16px] font-black uppercase tracking-wider leading-none mb-1")}>{propertyTitle}</Text>
              {phone && (
                <Text style={tw("text-gray-300 text-[5px] uppercase leading-none pt-0.5")}>
                  Phone: {phone}
                </Text>
              )}
              {email && (
                <Text style={tw("text-gray-300 text-[5px] uppercase leading-none pt-0.5")}>
                  Email: {email}
                </Text>
              )}
              {website && (
                <Text style={tw("text-gray-300 text-[5px] uppercase leading-none pt-0.5")}>
                  Website: {website}
                </Text>
              )}
              <Text style={tw("text-gray-300 text-[5px] uppercase leading-tight mt-0.5")}>Address: {tagline}</Text>
            </View>
          </View>

          {/* Right RESERVATION */}
          <View style={tw("items-end")}>
            <Text style={[tw("text-3xl font-black tracking-widest uppercase mb-2 leading-none"), { color: brandColor }]}>
              {data?.type === "quotation" ? "QUOTATION" : "RESERVATION"}
            </Text>
            <View style={tw("flex flex-row gap-2 mt-1")}>
              <View style={tw("space-y-1")}>
                <Text style={tw("text-[7px] font-bold text-gray-800")}>{data?.type === "quotation" ? "Quotation" : "Reservation"} Number:</Text>
                <Text style={tw("text-[7px] font-bold text-gray-800")}>{data?.type === "quotation" ? "Quotation" : "Reservation"} Date:</Text>
                {data?.type === "quotation" && <Text style={tw("text-[7px] font-bold text-gray-800")}>Valid Until:</Text>}
              </View>
              <View style={tw("space-y-1")}>
                <Text style={tw("text-[7px] text-gray-600")}>#{data?.bookingId || "123456"}</Text>
                <Text style={tw("text-[7px] text-gray-600")}>{formatDate(createdDate)}</Text>
                {data?.type === "quotation" && <Text style={tw("text-[7px] text-gray-600")}>{formatDate(data?.validUntil)}</Text>}
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Invoice To & From Section */}
      <View style={tw("px-10 mt-6 flex flex-row justify-between mb-8")}>
        {/* Invoice To */}
        <View style={tw("w-[40%]")}>
          <Text style={[tw("text-[8px] font-bold mb-2 uppercase"), { color: brandColor }]}>
            PREPARED FOR:
          </Text>
          <Text style={tw("text-lg font-black text-gray-800 mb-1")}>{isPreview ? "Jhone Doe." : data?.clientName || "N/A"}</Text>
          <Text style={tw("text-[7px] text-gray-600 mb-0.5")}>Email: {isPreview ? "jhone.doe@email.com" : data?.clientEmail || data?.email || "N/A"}</Text>
          <Text style={tw("text-[7px] text-gray-600 mb-0.5")}>Phone: {isPreview ? "+91 88902 77537" : data?.clientContact || data?.clientPhone || data?.phone || "N/A"}</Text>
          <Text style={tw("text-[7px] text-gray-600")}>Guests: {formattedGuests}</Text>
        </View>

        {/* Stay Details */}
        <View style={tw("w-[50%] justify-end pb-2")}>
          <Text style={[tw("text-[8px] font-bold mb-2"), { color: brandColor }]}>
            Stay Details:
          </Text>
          <View style={tw("flex flex-row gap-2")}>
            {[
              { label: "Check In", value: formatDate(data?.checkIn) },
              { label: "Check Out", value: formatDate(data?.checkOut) },
              { label: "Nights", value: data?.nights || "0" },
            ].map((item, i) => (
              <View key={i} style={tw("flex-1 bg-gray-50/80 p-3 rounded-xl border border-gray-100")}>
                <Text style={tw("text-[5px] text-gray-500 font-black uppercase tracking-widest mb-1")}>{item.label}</Text>
                <Text style={[tw("text-[8px] font-black"), { color: brandColor }]}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Table Area */}
      <View style={tw("px-10 mb-4")}>
        {/* Table Header */}
        <View style={tw("flex flex-row w-full mb-0")}>
          <View style={[tw("w-[10%] py-2.5 px-3"), { backgroundColor: brandColor }]}><Text style={tw("text-white text-[7px] font-bold uppercase")}>ITEM</Text></View>
          <View style={[tw("w-[1px]"), { backgroundColor: '#ffffff' }]} />
          <View style={[tw("flex-1 py-2.5 px-3"), { backgroundColor: brandColor }]}><Text style={tw("text-white text-[7px] font-bold uppercase")}>DESCRIPTION</Text></View>
          <View style={[tw("w-[1px]"), { backgroundColor: '#ffffff' }]} />
          <View style={[tw("w-[12%] py-2.5 px-3"), { backgroundColor: darkColor }]}><Text style={tw("text-white text-[7px] font-bold uppercase text-center")}>QTY</Text></View>
          <View style={[tw("w-[1px]"), { backgroundColor: '#ffffff' }]} />
          <View style={[tw("w-[18%] py-2.5 px-3"), { backgroundColor: darkColor }]}><Text style={tw("text-white text-[7px] font-bold uppercase text-center")}>RATE</Text></View>
          {hasGST && (
            <>
              <View style={[tw("w-[1px]"), { backgroundColor: '#ffffff' }]} />
              <View style={[tw("w-[12%] py-2.5 px-3"), { backgroundColor: darkColor }]}><Text style={tw("text-white text-[7px] font-bold uppercase text-center")}>GST</Text></View>
            </>
          )}
          <View style={[tw("w-[1px]"), { backgroundColor: '#ffffff' }]} />
          <View style={[tw("w-[18%] py-2.5 px-3"), { backgroundColor: darkColor }]}><Text style={tw("text-white text-[7px] font-bold uppercase text-center")}>AMOUNT</Text></View>
        </View>

        {/* Table Body */}
        {((data?.rooms || []).concat(data?.services || [])).map((item: any, i: number) => (
          <View key={i} style={tw(`flex flex-row items-center border-b border-white ${i % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100/50'}`)}>
            <View style={tw("w-[10%] py-1.5 px-3")}><Text style={tw("text-[8px] font-black text-gray-800 text-center")}>{String(i + 1).padStart(2, '0')}</Text></View>
            <View style={[tw("w-[1px] h-full"), { backgroundColor: '#ffffff' }]} />
            <View style={tw("flex-1 py-1.5 px-3")}>
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
                    <Text style={tw("text-[8px] font-black text-gray-800 mb-0.5")}>{name}</Text>
                    {(item.roomType || extra) && (
                      <Text style={tw("text-[6px] text-gray-500")}>
                        {item.roomType && item.roomType !== item.roomName ? item.roomType : (extra || "")}
                      </Text>
                    )}
                  </>
                );
              })()}
            </View>
            <View style={[tw("w-[1px] h-full"), { backgroundColor: '#ffffff' }]} />
            <View style={tw("w-[12%] py-1.5 px-3")}><Text style={tw("text-[8px] font-black text-gray-800 text-center")}>{item.qty || data?.nights}</Text></View>
            <View style={[tw("w-[1px] h-full"), { backgroundColor: '#ffffff' }]} />
            <View style={tw("w-[18%] py-1.5 px-3")}><Text style={tw("text-[8px] font-black text-gray-800 text-center")}>{Number(item.rate).toFixed(2)}</Text></View>
            {hasGST && (
              <>
                <View style={[tw("w-[1px] h-full"), { backgroundColor: '#ffffff' }]} />
                <View style={tw("w-[12%] py-1.5 px-3")}><Text style={tw("text-[8px] font-black text-gray-800 text-center")}>{item.gst || 0}%</Text></View>
              </>
            )}
            <View style={[tw("w-[1px] h-full"), { backgroundColor: '#ffffff' }]} />
            <View style={tw("w-[18%] py-1.5 px-3")}><Text style={tw("text-[8px] font-black text-gray-800 text-center")}>{Number(item.total).toFixed(2)}</Text></View>
          </View>
        ))}
      </View>

      {/* Totals Section */}
      <View style={tw("px-10 flex flex-row justify-end mt-4")}>
        <View style={tw("w-[40%]")}>
          <View style={tw("flex flex-row justify-between mb-2 px-2")}>
            <Text style={tw("text-[8px] font-bold text-gray-800")}>Subtotal:</Text>
            <Text style={tw("text-[8px] font-bold text-gray-800")}>{Number(subtotalAmount).toFixed(2)}</Text>
          </View>
          {hasGST && (
            <View style={tw("flex flex-row justify-between mb-2 px-2")}>
              <Text style={tw("text-[8px] font-bold text-gray-800")}>Tax (GST):</Text>
              <Text style={tw("text-[8px] font-bold text-gray-800")}>{Number(taxAmount).toFixed(2)}</Text>
            </View>
          )}

          {isReservation ? (
            <>
              <View style={tw("flex flex-row justify-between mb-2 px-2")}>
                <Text style={tw("text-[8px] font-bold text-gray-800")}>Advance Paid:</Text>
                <Text style={tw("text-[8px] font-bold text-gray-800")}>{Number(advancePaid).toFixed(2)}</Text>
              </View>
              <View style={tw("flex flex-row justify-between mb-4 px-2")}>
                <Text style={tw("text-[8px] font-bold text-gray-800")}>Balance Due:</Text>
                <Text style={tw("text-[8px] font-bold text-gray-800")}>{Number(balanceDue).toFixed(2)}</Text>
              </View>
              <View style={[tw("flex flex-row justify-between px-4 py-3"), { backgroundColor: brandColor }]}>
                <Text style={tw("text-[10px] font-bold text-white")}>Grand Total:</Text>
                <Text style={tw("text-[10px] font-bold text-white")}>{Number(grandTotalAmount).toFixed(2)}</Text>
              </View>
            </>
          ) : (
            <View style={[tw("flex flex-row justify-between px-4 py-3 mt-2"), { backgroundColor: brandColor }]}>
              <Text style={tw("text-[10px] font-bold text-white")}>Total:</Text>
              <Text style={tw("text-[10px] font-bold text-white")}>{Number(grandTotalAmount).toFixed(2)}</Text>
            </View>
          )}

          {/* Amount in words */}
          <View style={tw("mt-2 px-2")}>
            <Text style={tw("text-[6px] text-gray-500 italic text-right")}>
              Amount in words: {toWords(grandTotalAmount)} Rupees Only
            </Text>
          </View>
        </View>
      </View>

      {/* Payment Method / Bank Details */}
      <View style={tw("px-10 mt-6")}>
        <Text style={[tw("text-[8px] font-bold mb-3 uppercase"), { color: brandColor }]}>Payment Details</Text>
        <View style={tw("border border-gray-200 flex flex-row flex-wrap rounded-sm overflow-hidden")}>
          
          <View style={[tw("w-[20%] py-2 px-3 border-b border-r border-white justify-center"), { backgroundColor: brandColor }]}>
            <Text style={tw("text-[6px] font-bold text-white uppercase")}>Account Name</Text>
          </View>
          <View style={tw("w-[30%] py-2 px-3 border-b border-r border-gray-200 bg-gray-50 justify-center")}>
            <Text style={tw("text-[7px] font-bold text-gray-800")}>{isPreview ? "Jhone Doe." : settings?.bankDetails?.accountName || "N/A"}</Text>
          </View>

          <View style={[tw("w-[20%] py-2 px-3 border-b border-r border-white justify-center"), { backgroundColor: brandColor }]}>
            <Text style={tw("text-[6px] font-bold text-white uppercase")}>Account No</Text>
          </View>
          <View style={tw("w-[30%] py-2 px-3 border-b border-gray-200 bg-gray-50 justify-center")}>
            <Text style={tw("text-[7px] font-bold text-gray-800")}>{isPreview ? "1234 5678 910" : settings?.bankDetails?.accountNumber || "N/A"}</Text>
          </View>

          <View style={[tw("w-[20%] py-2 px-3 border-b border-r border-white justify-center"), { backgroundColor: brandColor }]}>
            <Text style={tw("text-[6px] font-bold text-white uppercase")}>Bank Name</Text>
          </View>
          <View style={tw("w-[30%] py-2 px-3 border-b border-r border-gray-200 bg-gray-50 justify-center")}>
            <Text style={tw("text-[7px] font-bold text-gray-800")}>{isPreview ? "XYZ Bank" : settings?.bankDetails?.bankName || "N/A"}</Text>
          </View>

          <View style={[tw("w-[20%] py-2 px-3 border-b border-r border-white justify-center"), { backgroundColor: brandColor }]}>
            <Text style={tw("text-[6px] font-bold text-white uppercase")}>IFSC Code</Text>
          </View>
          <View style={tw("w-[30%] py-2 px-3 border-b border-gray-200 bg-gray-50 justify-center")}>
            <Text style={tw("text-[7px] font-bold text-gray-800")}>{isPreview ? "XYZ0001234" : settings?.bankDetails?.ifscCode || "N/A"}</Text>
          </View>

          <View style={[tw("w-[20%] py-2 px-3 border-b border-r border-white justify-center"), { backgroundColor: brandColor }]}>
            <Text style={tw("text-[6px] font-bold text-white uppercase")}>Branch Name</Text>
          </View>
          <View style={tw("w-[30%] py-2 px-3 border-b border-r border-gray-200 bg-gray-50 justify-center")}>
            <Text style={tw("text-[7px] font-bold text-gray-800")}>{isPreview ? "Main Branch" : settings?.bankDetails?.branchName || "N/A"}</Text>
          </View>

          <View style={[tw("w-[20%] py-2 px-3 border-b border-r border-white justify-center"), { backgroundColor: brandColor }]}>
            <Text style={tw("text-[6px] font-bold text-white uppercase")}>Account Type</Text>
          </View>
          <View style={tw("w-[30%] py-2 px-3 border-b border-gray-200 bg-gray-50 justify-center")}>
            <Text style={tw("text-[7px] font-bold text-gray-800")}>{isPreview ? "Current" : settings?.bankDetails?.accountType || "N/A"}</Text>
          </View>

          <View style={[tw("w-[20%] py-2 px-3 border-r border-white justify-center"), { backgroundColor: brandColor }]}>
            <Text style={tw("text-[6px] font-bold text-white uppercase")}>GSTIN</Text>
          </View>
          <View style={tw("w-[30%] py-2 px-3 border-r border-gray-200 bg-gray-50 justify-center")}>
            <Text style={tw("text-[7px] font-bold text-gray-800")}>{gst || "N/A"}</Text>
          </View>

          <View style={[tw("w-[20%] py-2 px-3 border-r border-white justify-center"), { backgroundColor: brandColor }]}>
            <Text style={tw("text-[6px] font-bold text-white uppercase")}>UPI ID</Text>
          </View>
          <View style={tw("w-[30%] py-2 px-3 bg-gray-50 justify-center")}>
            <Text style={tw("text-[7px] font-bold text-gray-800")}>{isPreview ? "demo@upi" : settings?.bankDetails?.upiId || "N/A"}</Text>
          </View>

        </View>
      </View>

      {/* Terms & Conditions */}
      <View style={tw("px-10 flex flex-row mt-8 mb-16")}>
        {/* Payment Terms & Policies */}
        <View style={tw("w-1/2 pr-4")}>
          <Text style={[tw("text-[7px] font-bold mb-2 uppercase"), { color: brandColor }]}>PAYMENT TERMS & POLICIES</Text>
          <View style={tw("space-y-1")}>
            {(isPreview ? ["Lorem ipsum dolor sit amet, consectetur adipiscing elit.","Lorem ipsum dolor sit amet, consectetur adipiscing elit.","Lorem ipsum dolor sit amet, consectetur adipiscing elit."] : settings?.paymentTerms || []).map((term: string, i: number) => (
              <View key={i} style={tw("flex flex-row items-start mb-0.5")}>
                <Text style={tw("text-[6px] text-gray-500 mr-1")}>•</Text>
                <Text style={tw("flex-1 text-[6px] text-gray-500 leading-relaxed")}>{term}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Cancellation Policies */}
        <View style={tw("w-1/2 pl-4 border-l border-gray-100")}>
          <Text style={[tw("text-[7px] font-bold mb-2 uppercase"), { color: brandColor }]}>CANCELLATION POLICY</Text>
          <View style={tw("space-y-1")}>
            {(isPreview ? ["Nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum.","Nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum.","Nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum."] : settings?.cancellationPolicies || []).map((policy: string, i: number) => (
              <View key={i} style={tw("flex flex-row items-start mb-0.5")}>
                <Text style={tw("text-[6px] text-gray-500 mr-1")}>•</Text>
                <Text style={tw("flex-1 text-[6px] text-gray-500 leading-relaxed")}>{policy}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Absolute Footer */}
      <View style={[tw("absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center px-10"), { backgroundColor: darkColor }]}>
        <Text style={tw("text-[9px] text-white font-bold uppercase tracking-widest text-center")}>
          Thank you for choosing {propertyTitle} for your stay.
        </Text>
      </View>
    </View>
  );
};

export default EliteLayout;
