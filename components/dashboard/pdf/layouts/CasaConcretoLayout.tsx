import React from "react";
import { View, Text, Image, Page, Font } from "@react-pdf/renderer";

Font.register({
  family: "Sweet Sans Pro",
  fonts: [
    { src: "/CasaConcreto/sweet/SweetSansProRegular.otf" },
    { src: "/CasaConcreto/sweet/SweetSansProBold.otf", fontWeight: "bold" },
    { src: "/CasaConcreto/sweet/SweetSansProItalic.otf", fontStyle: "italic" }
  ]
});

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

const CasaConcretoLayout = ({ data, settings, tw }: LayoutProps) => {
  const isPreview = settings?.isPreview;

  // Colors from the provided CSS
  const bgMain = "#F3EFE9";
  const bgHeader = "#8a825f";
  const bgFloat = "#ffffff";
  const textDark = "#1a1a1a";
  const textMed = "#555555";
  const borderMed = "#e2e2e2";
  const borderTable = bgHeader;
  const borderLight = "#eaeaea";

  // Static logo path (white logo on the olive header, black logo on page 2 footer)
  const ccLogoSrc = "/CasaConcreto/casa-white-logo.png";
  // Static logo path for page 2
  const ccLogoBlackSrc = "/CasaConcreto/casa-black-logo.png"; 

  // Static header info (always Casa Concreto)
  const ccName = "CasaConcreto";
  const ccTagline = "Infinite Luxury";
  const ccAddress = "K.No.-1920/6, Near HP Petrol Pump, Doli, Jhanwar Rd, Luni, Jodhpur – 342001";
  const ccGSTIN = "GSTIN: 08AAJPN4600N2ZF";
  const ccState = "State: Rajasthan (Code: 08)";
  const ccPhone = "+91 82335 45060";
  const ccEmail = "info@casaconcreto.in";
  const ccWebsite = "casaconcreto.in";

  // Dynamic data
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const formatDateShort = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const formatTime = (timeStr?: string, fullIsoStr?: string, defaultTime?: string) => {
    let tStr = timeStr;
    if (!tStr && fullIsoStr && fullIsoStr.includes("T")) {
      tStr = fullIsoStr.split("T")[1].substring(0, 5);
    }
    if (!tStr) return defaultTime || "";
    try {
      const [hours, minutes] = tStr.split(":");
      if (!hours || !minutes) return defaultTime || "";
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedHours = h % 12 || 12;
      return `${formattedHours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    } catch (e) {
      return defaultTime || "";
    }
  };

  const taxAmount = data?.payment?.totalGST || data?.tax || data?.gst || 0;
  const subtotalAmount = data?.payment?.subtotal || data?.subtotal || 0;
  const grandTotalAmount = data?.payment?.grandTotal || data?.total || 0;
  const createdDate = data?.reservationDate || data?.createdAt;
  const advancePaid = data?.payment?.advancePaid || 0;
  const balanceDue = data?.payment?.pendingAmount || (grandTotalAmount - advancePaid);
  const isReservation = data?.type === "reservation";
  const hasGST = taxAmount > 0;
  const guestDisplay = typeof data?.guests === 'object' ? `${data.guests.adults || 0} Adults${data.guests.kids ? `, ${data.guests.kids} Kids` : ''}` : (data?.guests || 0);

  const items = (data?.rooms || []).concat(data?.services || []);

  // Bank details - dynamic from settings with fallback
  const bankAccName = isPreview ? "Casa Concreto" : settings?.bankDetails?.accountName || "Casa Concreto";
  const bankName = isPreview ? "HDFC Bank" : settings?.bankDetails?.bankName || "HDFC Bank";
  const bankBranch = isPreview ? "Boranada, Jodhpur" : settings?.bankDetails?.branchName || "Boranada, Jodhpur";
  const bankAccNo = isPreview ? "59222000059222" : settings?.bankDetails?.accountNumber || "59222000059222";
  const bankIFSC = isPreview ? "HDFC0003652" : settings?.bankDetails?.ifscCode || "HDFC0003652";
  const bankAccType = isPreview ? "Current Account" : settings?.bankDetails?.accountType || "Current Account";

  return (
    <>
      {/* ==================== PAGE 1 ==================== */}
      <Page size="A4" style={{ padding: 0, backgroundColor: bgMain, color: textMed, fontFamily: "Sweet Sans Pro" }}>
        <View style={tw("flex-1 relative")}>

          {/* ── HEADER WRAP ── */}
          <View style={{ backgroundColor: bgHeader, paddingTop: 25, paddingBottom: 58, borderBottomLeftRadius: 66, borderBottomRightRadius: 66 }}>
            <View style={{ paddingHorizontal: 50, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              {/* Left: Logo (aligned right towards center) */}
              <View style={{ paddingRight: 15, alignItems: "flex-end" }}>
                <Image src={ccLogoSrc} style={{ width: 85, height: 85, objectFit: "contain" }} />
              </View>
              {/* Right: Info (aligned left) */}
              <View style={{ justifyContent: "center" }}>
                <Text style={{ fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 1, lineHeight: 1 }}>{ccName}</Text>
                <Text style={{ fontSize: 14, fontStyle: "italic", color: "#f2e8d5", marginBottom: 4, lineHeight: 1 }}>{ccTagline}</Text>
                <Text style={{ fontSize: 10, color: "#f2e8d5", marginBottom: 2 }}>{ccAddress}</Text>
                <Text style={{ fontSize: 10, color: "#f2e8d5", marginBottom: 2 }}>{ccGSTIN}  ·  {ccState}</Text>
                <Text style={{ fontSize: 10, color: "#f2e8d5" }}>{ccPhone}  ·  {ccEmail}  ·  {ccWebsite}</Text>
              </View>
            </View>
          </View>

<View style={{ paddingHorizontal: 20 }}>
            {/* ── FLOATING BOX (QUOTATION) ── */}
            <View style={{
              backgroundColor: bgFloat,
              borderRadius: 16,
              paddingTop: 20,
              paddingBottom: 13,
              paddingLeft: 20,
              paddingRight: 10,
              marginTop: -46,
              flexDirection: "row"
            }}>
              {/* Left col */}
              <View style={{ width: "40%" }}>
                <Text style={{ fontSize: 22.4, fontWeight: "bold", color: textDark, letterSpacing: 0.6, lineHeight: 1 }}>
                  {data?.type === "quotation" ? "QUOTATION" : "RESERVATION"}
                </Text>
                <Text style={{ fontSize: 6.4, fontStyle: "italic", color: textMed, marginTop: 1 }}>
                  Casa Concreto · Infinite Luxury Villa · Jodhpur
                </Text>
              </View>
              {/* Right col */}
              <View style={{ width: "60%", paddingLeft: 20 }}>
                {[
                  { label: "Date", value: formatDate(createdDate) },
                  { label: "Valid Until", value: formatDate(data?.validUntil) },
                  { label: "Prepared For", value: isPreview ? "John Doe" : data?.clientName || "N/A" },
                  { label: "Contact", value: isPreview ? "+91 98765 43210" : data?.clientContact || data?.clientPhone || "N/A" },
                ].map((row, i) => (
                  <View key={i} style={{ flexDirection: "row", paddingVertical: 6, borderBottomWidth: i === 3 ? 0 : 0.6, borderBottomColor: borderMed }}>
                    <Text style={{ width: 100, fontSize: 8.4, color: textDark }}>{row.label}</Text>
                    <Text style={{ flex: 1, fontSize: 8.4, color: textDark }}>{row.value}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* ── BOOKING BAR ── */}
            <View style={{ backgroundColor: bgHeader, paddingTop: 6, paddingBottom: 2, paddingHorizontal: 26, marginTop: 10, justifyContent: "center" }}>
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold", letterSpacing: 0.4 }}>BOOKING DETAILS</Text>
            </View>

            {/* ── BOOKING GRID ── */}
            <View style={{ flexDirection: "row", marginTop: 16, marginBottom: 16 }}>
              {[
                { label: "Check-In Date", value: formatDateShort(data?.checkIn) },
                { label: "Check-Out Date", value: formatDateShort(data?.checkOut) },
                { label: "Check-In Time", value: formatTime(data?.checkInTime, data?.checkIn, "02:00 PM") },
                { label: "Check-Out Time", value: formatTime(data?.checkOutTime, data?.checkOut, "11:00 AM") },
                { label: "No. of Nights", value: data?.nights || "0" },
                { label: "No. of Guests", value: guestDisplay },
              ].map((cell, i) => (
                <View key={i} style={{ flex: 1, alignItems: "center" }}>
                  <View style={{ width: "100%", alignItems: "center", borderBottomWidth: 1.2, borderBottomColor: bgHeader, paddingBottom: 5 }}>
                    <Text style={{ fontSize: 9.6, fontWeight: "bold", color: textDark }}>{cell.label}</Text>
                  </View>
                  <Text style={{ fontSize: 10.1, color: textMed, paddingTop: 8 }}>{cell.value}</Text>
                </View>
              ))}
            </View>

            {/* ── ITEMS TABLE ── */}
            <View style={{ width: "100%", borderWidth: 1.3, borderColor: borderTable, borderBottomWidth: 0 }}>
              {/* Header Row */}
              <View style={{ flexDirection: "row", backgroundColor: "transparent", borderBottomWidth: 1.3, borderBottomColor: borderTable }}>
                <View style={{ width: "5%", paddingVertical: 6, paddingHorizontal: 5, borderRightWidth: 1.3, borderRightColor: borderTable, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 9.6, fontWeight: "bold", color: textDark }}>#</Text></View>
                <View style={{ width: hasGST ? "43%" : "56%", paddingVertical: 6, paddingHorizontal: 10, borderRightWidth: 1.3, borderRightColor: borderTable, justifyContent: "center" }}><Text style={{ fontSize: 9.6, fontWeight: "bold", color: textDark }}>Description</Text></View>
                <View style={{ width: "13%", paddingVertical: 6, paddingHorizontal: 5, borderRightWidth: 1.3, borderRightColor: borderTable, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 9.6, fontWeight: "bold", color: textDark }}>Qty / Nights</Text></View>
                <View style={{ width: "13%", paddingVertical: 6, paddingHorizontal: 5, borderRightWidth: 1.3, borderRightColor: borderTable, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 9.6, fontWeight: "bold", color: textDark }}>Rate (INR)</Text></View>
                {hasGST && <View style={{ width: "13%", paddingVertical: 6, paddingHorizontal: 5, borderRightWidth: 1.3, borderRightColor: borderTable, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 9.6, fontWeight: "bold", color: textDark }}>GST 18%</Text></View>}
                <View style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 5, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 9.6, fontWeight: "bold", color: textDark }}>Total (INR)</Text></View>
              </View>

              {/* Body Rows */}
              {items.map((item: any, i: number) => {
                let name = item.roomName || item.serviceName || "";
                let extra = item.description || "";
                if (!item.roomName && name.includes(" | ")) {
                  const parts = name.split(" | ");
                  name = parts[0];
                  extra = parts[1];
                }
                return (
                  <View key={i} style={{ flexDirection: "row", borderBottomWidth: 1.3, borderBottomColor: borderTable }}>
                    <View style={{ width: "5%", paddingVertical: 6, paddingHorizontal: 5, borderRightWidth: 1.3, borderRightColor: borderTable, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 8.5, color: textDark, fontWeight: "bold" }}>{i + 1}</Text></View>
                    <View style={{ width: hasGST ? "43%" : "56%", paddingVertical: 6, paddingHorizontal: 10, borderRightWidth: 1.3, borderRightColor: borderTable, justifyContent: "center" }}>
                      <Text style={{ fontSize: 8.5, color: textDark, fontWeight: "bold", marginBottom: 2 }}>{name}</Text>
                      {(item.roomType || extra) && (
                        <Text style={{ fontSize: 6.6, color: "#888" }}>{item.roomType && item.roomType !== item.roomName ? item.roomType : (extra || "")}</Text>
                      )}
                    </View>
                    <View style={{ width: "13%", paddingVertical: 6, paddingHorizontal: 5, borderRightWidth: 1.3, borderRightColor: borderTable, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 8.5, color: textMed }}>{item.qty || data?.nights || ""}</Text></View>
                    <View style={{ width: "13%", paddingVertical: 6, paddingHorizontal: 5, borderRightWidth: 1.3, borderRightColor: borderTable, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 8.5, color: textMed }}>{item.rate ? Number(item.rate).toLocaleString('en-IN') : ""}</Text></View>
                    {hasGST && <View style={{ width: "13%", paddingVertical: 6, paddingHorizontal: 5, borderRightWidth: 1.3, borderRightColor: borderTable, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 8.5, color: textMed }}>{item.gst ? `${item.gst}%` : ""}</Text></View>}
                    <View style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 5, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 8.5, color: textMed }}>{item.total ? Number(item.total).toLocaleString('en-IN') : ""}</Text></View>
                  </View>
                );
              })}

              {/* Subtotal */}
              <View style={{ flexDirection: "row", borderBottomWidth: 1.3, borderBottomColor: borderTable }}>
                <View style={{ width: "5%", borderRightWidth: 1.3, borderRightColor: borderTable }} />
                <View style={{ width: hasGST ? "43%" : "56%", borderRightWidth: 1.3, borderRightColor: borderTable }} />
                <View style={{ width: "13%", paddingVertical: 3, paddingHorizontal: 2, borderRightWidth: 1.3, borderRightColor: borderTable, justifyContent: "center" }}>
                  <Text style={{ fontSize: 5.2, color: textDark }}>{hasGST ? "Subtotal (excl. GST)" : "Subtotal"}</Text>
                </View>
                <View style={{ width: "13%", borderRightWidth: 1.3, borderRightColor: borderTable }} />
                {hasGST && <View style={{ width: "13%", borderRightWidth: 1.3, borderRightColor: borderTable }} />}
                <View style={{ flex: 1, paddingVertical: 3, paddingHorizontal: 5, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 8.3, color: textMed }}>{subtotalAmount ? Number(subtotalAmount).toLocaleString('en-IN') : ""}</Text>
                </View>
              </View>

              {/* Tax */}
              {hasGST && (
                <View style={{ flexDirection: "row", borderBottomWidth: 1.3, borderBottomColor: borderTable }}>
                  <View style={{ width: "5%", borderRightWidth: 1.3, borderRightColor: borderTable }} />
                  <View style={{ width: "43%", borderRightWidth: 1.3, borderRightColor: borderTable }} />
                  <View style={{ width: "13%", paddingVertical: 3, paddingHorizontal: 2, borderRightWidth: 1.3, borderRightColor: borderTable, justifyContent: "center" }}>
                    <Text style={{ fontSize: 5.2, color: textDark }}>Total GST @ 18%</Text>
                  </View>
                  <View style={{ width: "13%", borderRightWidth: 1.3, borderRightColor: borderTable }} />
                  <View style={{ width: "13%", borderRightWidth: 1.3, borderRightColor: borderTable }} />
                  <View style={{ flex: 1, paddingVertical: 3, paddingHorizontal: 5, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 8.3, color: textMed }}>{taxAmount ? Number(taxAmount).toLocaleString('en-IN') : ""}</Text>
                  </View>
                </View>
              )}

              {/* Advance Paid & Remaining */}
              {isReservation && (
                <>
                  <View style={{ flexDirection: "row", borderBottomWidth: 1.3, borderBottomColor: borderTable }}>
                    <View style={{ width: "5%", borderRightWidth: 1.3, borderRightColor: borderTable }} />
                    <View style={{ width: hasGST ? "43%" : "56%", borderRightWidth: 1.3, borderRightColor: borderTable }} />
                    <View style={{ width: "13%", paddingVertical: 3, paddingHorizontal: 2, borderRightWidth: 1.3, borderRightColor: borderTable, justifyContent: "center" }}>
                      <Text style={{ fontSize: 5.2, color: textDark }}>Advance Paid</Text>
                    </View>
                    <View style={{ width: "13%", borderRightWidth: 1.3, borderRightColor: borderTable }} />
                    {hasGST && <View style={{ width: "13%", borderRightWidth: 1.3, borderRightColor: borderTable }} />}
                    <View style={{ flex: 1, paddingVertical: 3, paddingHorizontal: 5, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: 8.3, color: textMed }}>{advancePaid ? Number(advancePaid).toLocaleString('en-IN') : "0"}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", borderBottomWidth: 1.3, borderBottomColor: borderTable }}>
                    <View style={{ width: "5%", borderRightWidth: 1.3, borderRightColor: borderTable }} />
                    <View style={{ width: hasGST ? "43%" : "56%", borderRightWidth: 1.3, borderRightColor: borderTable }} />
                    <View style={{ width: "13%", paddingVertical: 3, paddingHorizontal: 2, borderRightWidth: 1.3, borderRightColor: borderTable, justifyContent: "center" }}>
                      <Text style={{ fontSize: 5.2, color: textDark }}>Remaining</Text>
                    </View>
                    <View style={{ width: "13%", borderRightWidth: 1.3, borderRightColor: borderTable }} />
                    {hasGST && <View style={{ width: "13%", borderRightWidth: 1.3, borderRightColor: borderTable }} />}
                    <View style={{ flex: 1, paddingVertical: 3, paddingHorizontal: 5, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: 8.3, color: textMed }}>{balanceDue ? Number(balanceDue).toLocaleString('en-IN') : "0"}</Text>
                    </View>
                  </View>
                </>
              )}

              {/* Grand Total Row */}
              <View style={{ flexDirection: "row", backgroundColor: bgHeader }}>
                <View style={{ width: "5%" }} />
                <View style={{ width: hasGST ? "43%" : "56%" }} />
                <View style={{ flex: 1, paddingTop: 6, paddingBottom: 4, paddingHorizontal: 10, justifyContent: "center" }}>
                  <Text style={{ color: "#f5f2eb", fontSize: 10.5 }}>
                    {hasGST ? "GRAND TOTAL (inclusive of 18% GST) :   " : "GRAND TOTAL :   "}
                    {Number(grandTotalAmount).toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            </View>

            {/* ── AMOUNT IN WORDS ── */}
            <View style={{ paddingTop: 20, paddingBottom: 6, flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 9, fontWeight: "bold", color: textDark }}>Amount in Words:   Rupees </Text>
              <View style={{ flex: 1, borderBottomWidth: 0.6, borderBottomColor: textDark, marginHorizontal: 3, alignItems: "center" }}>
                <Text style={{ fontSize: 9, color: textMed, position: "relative", top: 2 }}>{data?.totalInWords || toWords(grandTotalAmount).replace("Rupees ", "").replace("Only", "").trim()}</Text>
              </View>
              <Text style={{ fontSize: 9, fontWeight: "bold", color: textDark }}> Only</Text>
            </View>

            {/* ── FOOTER: BANK & POLICY ── */}
            <View style={{ flexDirection: "row", marginTop: 33 }}>
              {/* Left: Bank Table */}
              <View style={{ width: "49%", borderWidth: 1.2, borderColor: bgHeader}}>
                {[
                  { label: "Account Name", value: bankAccName },
                  { label: "Bank Name", value: bankName },
                  { label: "Branch", value: bankBranch },
                  { label: "Account No.", value: bankAccNo },
                  { label: "IFSC Code", value: bankIFSC },
                  { label: "Account Type", value: bankAccType },
                ].map((row, i) => (
                  <View key={i} style={{ flexDirection: "row", flex: 1, borderBottomWidth: i === 5 ? 0 : 1.2, borderBottomColor: bgHeader }}>
                    <View style={{ width: "40%", paddingVertical: 4, paddingHorizontal: 8, borderRightWidth: 1.2, borderRightColor: bgHeader, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: 9.6, fontWeight: "bold", color: textDark }}>{row.label}</Text>
                    </View>
                    <View style={{ flex: 1, paddingVertical: 4, paddingHorizontal: 12, justifyContent: "center" }}>
                      <Text style={{ fontSize: 9.6, fontWeight: "bold", color: textDark }}>{row.value}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={{ width: "2%" }} />

              {/* Right: Policy Box */}
              <View style={{ width: "49%", borderWidth: 1.2, borderColor: bgHeader, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18 }}>
                <Text style={{ fontSize: 11, fontWeight: "bold", color: textDark, marginBottom: 6 }}>Payment Terms</Text>
                {(settings?.paymentTerms && settings.paymentTerms.length > 0
                  ? settings.paymentTerms
                  : [
                      "50% advance to confirm the booking.",
                      "Remaining 50% due 48 hours before check-in.",
                      "Full payment required before check-in.",
                      "Damage deposit: ₹10,000 (refundable at check-out after inspection).",
                      "Accepted: bank transfer or cash.",
                    ]
                ).slice(0, 5).map((term: string, i: number) => (
                  <Text key={i} style={{ fontSize: 6.2, color: textDark, lineHeight: 1.15, marginBottom: 1 }}>{term}</Text>
                ))}
                
                <Text style={{ fontSize: 11, fontWeight: "bold", color: textDark, marginTop: 14, marginBottom: 6 }}>Cancellation Policy</Text>
                {(settings?.cancellationPolicies && settings.cancellationPolicies.length > 0
                  ? settings.cancellationPolicies
                  : [
                      "60+ days before check-in: 100% refund.",
                      "30-60 days before check-in: 50% refund.",
                      "Less than 30 hours: No refund.",
                    ]
                ).slice(0, 3).map((policy: string, i: number) => (
                  <Text key={i} style={{ fontSize: 6.2, color: textDark, lineHeight: 1.15, marginBottom: 1 }}>{policy}</Text>
                ))}
              </View>
            </View>

          </View>
        </View>
      </Page>

      {/* ==================== PAGE 2 — STATIC TERMS & CONDITIONS ==================== */}
      <Page size="A4" style={{ padding: 0, backgroundColor: bgMain, color: textMed, fontFamily: "Sweet Sans Pro" }}>
        <View style={{ paddingTop: 42, paddingHorizontal: 20 }}>
          
          <View style={{ backgroundColor: bgHeader, paddingTop: 10, paddingBottom: 6, paddingHorizontal: 26, marginBottom: 20, justifyContent: "center" }}>
            <Text style={{ color: "#fff", fontSize: 14.9, fontWeight: "bold" }}>Terms & Conditions</Text>
          </View>

          {/* ROW 1: Box 1 and Box 3 (EQUAL HEIGHT) */}
          <View style={{ flexDirection: "row" }}>
            
            {/* Box 1 */}
            <View style={{ width: "49%", borderWidth: 1.2, borderColor: bgHeader, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18 }}>
              <Text style={{ fontSize: 11, fontWeight: "bold", color: textDark, marginBottom: 6 }}>General House Rules</Text>
              {[
                "Valid Government-issued Id Required For All Guests At Check-in.",
                "No Illegal Activities Permitted On The Premises.",
                "No Smoking Indoors; Designated Outdoor Areas Only.",
                "Alcohol To Be Consumed In Common Areas — Not In Bedrooms.",
                "Park In The Designated Driveway Only.",
                "Additional Guests Must Be Pre-approved By The Property.",
                "Noise To Be Kept To A Minimum After 10:00 Pm.",
                "Cctv Operates In All External Areas For Security.",
                "Staff Reside On The Property Premises."
              ].map((rule, i) => (
                <View key={i} style={{ flexDirection: "row", marginBottom: 1.5 }}>
                  <Text style={{ color: bgHeader, fontSize: 6.8, marginRight: 5 }}>•</Text>
                  <Text style={{ fontSize: 6.8, color: textDark, lineHeight: 1.15 }}>{rule}</Text>
                </View>
              ))}

              <Text style={{ fontSize: 11, fontWeight: "bold", color: textDark, marginTop: 14, marginBottom: 6 }}>Swimming Pool Rules</Text>
              {[
                "Pool open 7:00 AM – 9:00 PM for villa guests only.",
                "Children under 14 must be supervised by an adult at all times.",
                "No running, diving or alcohol in the pool area.",
                "Shower before entering the pool; wear appropriate swimwear.",
                "No food or drinks inside the pool.",
                "No lifeguard on duty — swim at your own risk."
              ].map((rule, i) => (
                <View key={i} style={{ flexDirection: "row", marginBottom: 1.5 }}>
                  <Text style={{ color: bgHeader, fontSize: 6.8, marginRight: 5 }}>•</Text>
                  <Text style={{ fontSize: 6.8, color: textDark, lineHeight: 1.15 }}>{rule}</Text>
                </View>
              ))}

              <Text style={{ fontSize: 11, fontWeight: "bold", color: textDark, marginTop: 14, marginBottom: 6 }}>Sustainability</Text>
              {[
                "Casa Concreto avoids all single-use plastics.",
                "Filtered water provided in reusable glass or steel bottles throughout your stay."
              ].map((rule, i) => (
                <View key={i} style={{ flexDirection: "row", marginBottom: 1.5 }}>
                  <Text style={{ color: bgHeader, fontSize: 6.8, marginRight: 5 }}>•</Text>
                  <Text style={{ fontSize: 6.8, color: textDark, lineHeight: 1.15 }}>{rule}</Text>
                </View>
              ))}
            </View>

            <View style={{ width: "2%" }} />

            {/* Box 3 */}
            <View style={{ width: "49%", borderWidth: 1.2, borderColor: bgHeader, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18 }}>
              <Text style={{ fontSize: 11, fontWeight: "bold", color: textDark, marginBottom: 6 }}>Dining at Casa Concreto</Text>
              {[
                "Professional kitchen & chefs on-site. Guests are not permitted inside the kitchen.",
                "Casa Concreto is a strictly vegetarian property.",
                "Special dietary needs must be communicated at least 24 hours in advance.",
                "Next-day menu preferences must be submitted by 8:00 PM the preceding evening."
              ].map((rule, i) => (
                <View key={i} style={{ flexDirection: "row", marginBottom: 1.5 }}>
                  <Text style={{ color: bgHeader, fontSize: 6.8, marginRight: 5 }}>•</Text>
                  <Text style={{ fontSize: 6.8, color: textDark, lineHeight: 1.15 }}>{rule}</Text>
                </View>
              ))}

              <Text style={{ fontSize: 11, fontWeight: "bold", color: textDark, marginTop: 14, marginBottom: 6 }}>Pet-Friendly Policy</Text>
              {[
                "Pets welcome — please notify the property at time of booking.",
                "Pets must be kept away from the kitchen and swimming pool.",
                "Pets must be supervised and housebroken at all times.",
                "Owners are responsible for cleaning up after their pets."
              ].map((rule, i) => (
                <View key={i} style={{ flexDirection: "row", marginBottom: 1.5 }}>
                  <Text style={{ color: bgHeader, fontSize: 6.8, marginRight: 5 }}>•</Text>
                  <Text style={{ fontSize: 6.8, color: textDark, lineHeight: 1.15 }}>{rule}</Text>
                </View>
              ))}

              <Text style={{ fontSize: 11, fontWeight: "bold", color: textDark, marginTop: 14, marginBottom: 6 }}>Note</Text>
              <Text style={{ fontSize: 6.8, color: textDark, lineHeight: 1.15, marginBottom: 1.5 }}>1. Standard occupancy per room is 2 guests.</Text>
              <Text style={{ fontSize: 6.8, color: textDark, lineHeight: 1.15, marginLeft: 11, marginBottom: 1.5 }}>    (1 extra bed can be added per room at ₹2000 plus taxes.)</Text>
              <Text style={{ fontSize: 6.8, color: textDark, lineHeight: 1.15, marginBottom: 1.5 }}>2. Above quotation is based on Indian food, if you choose</Text>
              <Text style={{ fontSize: 6.8, color: textDark, lineHeight: 1.15, marginLeft: 11, marginBottom: 1.5 }}>    different option, charges will be different.</Text>
              <Text style={{ fontSize: 6.8, color: textDark, lineHeight: 1.15, marginBottom: 1.5 }}>3. Early check-in or late check-out is subject to availability</Text>
              <Text style={{ fontSize: 6.8, color: textDark, lineHeight: 1.15, marginLeft: 11, marginBottom: 1.5 }}>    and will be chargeable.</Text>
              <Text style={{ fontSize: 6.8, color: textDark, lineHeight: 1.15, marginBottom: 1.5 }}>4. Charges for food for kids are as follows-</Text>
              
              <View style={{ width: "90%", marginLeft: 14, marginTop: 3 }}>
                {[
                  { age: "Upto 5 years", price: "Nil" },
                  { age: "5-12 years", price: "Half Price" },
                  { age: "Above 12 years", price: "Full Price" },
                ].map((row, i) => (
                  <View key={i} style={{ flexDirection: "row", borderBottomWidth: i === 2 ? 0 : 0.6, borderBottomColor: bgHeader, paddingVertical: 2 }}>
                    <View style={{ width: "50%", borderRightWidth: 0.6, borderRightColor: bgHeader, paddingLeft: 6 }}>
                      <Text style={{ fontSize: 6.8, color: textDark }}>{row.age}</Text>
                    </View>
                    <View style={{ paddingLeft: 13 }}>
                      <Text style={{ fontSize: 6.8, color: textDark }}>{row.price}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

          </View>

          {/* ROW 2: Acceptance Box and Logo Area */}
          <View style={{ flexDirection: "row", marginTop: 6 }}>
            {/* Box 2 (Acceptance Box) */}
            <View style={{ width: "49%", borderWidth: 1.2, borderColor: bgHeader, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18 }}>
              <Text style={{ fontSize: 11, fontWeight: "bold", color: textDark, marginBottom: 10 }}>Acceptance & Authorisation</Text>
              <Text style={{ fontSize: 6.8, color: textDark, lineHeight: 1.15 }}>By signing below, the guest confirms acceptance of</Text>
              <Text style={{ fontSize: 6.8, color: textDark, lineHeight: 1.15 }}>this quotation and all terms & conditions stated above.</Text>
              <View style={{ borderBottomWidth: 0.8, borderBottomColor: textDark, width: "100%", marginTop: 26 }} />
              <Text style={{ fontSize: 6.8, color: textDark, marginTop: 5 }}>Guest Signature & Date</Text>
            </View>

            <View style={{ width: "2%" }} />

            {/* Logo Area */}
            <View style={{ width: "49%", paddingLeft: "4%" }}>
              <Image src={ccLogoBlackSrc} style={{ width: 65, height: 65, objectFit: "contain", marginBottom: 2 }} />
              <Text style={{ fontSize: 7.2, fontWeight: "bold", color: textDark, lineHeight: 1.1 }}>CasaConcreto</Text>
              <Text style={{ fontSize: 4.8, color: textDark, marginBottom: 3, letterSpacing: 0.6, lineHeight: 1.1 }}>Infinite Luxury</Text>
              <Text style={{ fontSize: 6.8, color: textDark, lineHeight: 1.1 }}>Thank you for choosing Casa Concreto.</Text>
              <Text style={{ fontSize: 6.8, color: textDark, lineHeight: 1.1 }}>We look forward to welcoming you.</Text>
              <Text style={{ fontSize: 6.8, color: textDark, fontWeight: "bold", marginTop: 5, lineHeight: 1.1 }}>casaconcreto.in  •  +91 82335 45060</Text>
            </View>
          </View>

        </View>
      </Page>
    </>
  );
};

export default CasaConcretoLayout;