import React from "react";
import dayjs from "dayjs";
import PriceTag from "../../../../../component/PriceTag/PriceTag";
import { capitalizeAllLetter } from "../.././../../../utils/Utils";
import { Flex } from "antd";

// ── Design Tokens ──────────────────────────────────────────────────────────
const FONT_BODY = "'Arial', 'Helvetica', sans-serif";
const FONT_MONO = "'Courier New', monospace";
const FONT_LABEL = "'Arial', 'Helvetica', sans-serif";

const INK = "#1a1a1a";
const INK_SOFT = "#333333";
const INK_MUTED = "#666666";

const BLUE = "#2c3e50";
const BLUE_LIGHT = "#f5f6fa";

const RULE = "#cccccc";
const WHITE = "#ffffff";

// ── Main Component ────────────────────────────────────────────────────────
const FolioInvoicePrint = React.forwardRef(({ printData, adminName, adminRole, hideLetterhead, propertyData }, ref) => {
  if (!printData) return null;

  const propertyImage = propertyData?.propertyFiles?.find(
    (file) => file?.name === "email_photo",
  )?.file;

  // Extract fields directly from API response
  const foliosList = printData.data || [];
  const folioNo = printData.folio?.folioNo || "-";
  const isfolioExist = printData.folio != null ? true : false;
  const guestName = printData.folio?.guest?.name || printData.guest || "—";
  const guestPhone = printData.folio?.guest?.phone || "—";
  const tourCode = printData.tourCode || null;
  const sourceType = printData.sourceType;
  const sourceName = printData.sourceName;
  const bookingRef = printData.refNo || "—";
  const checkinDate = printData.checkinDate;
  const checkoutDate = printData.checkoutDate;

  const reservationNo = printData.reservationNo || "—";
  const creditTotal = printData.creditTotal || 0;
  const debitTotal = printData.debitTotal || 0;
  const balanceTotal = printData.balanceTotal || 0;
  const taxTotal = printData.taxTotal || 0;
  const subTotal = printData.subTotal || 0;
  const grandTotal = printData.grandTotal || 0;

  const allLines = foliosList;

  const showFolioColumn = !!printData;

  const cols = showFolioColumn
    ? [
      { name: "Date", width: "12%", align: "center" },
      { name: "Ref#", width: "8%", align: "center" },
      { name: "Description", width: "34%", align: "left" },
      { name: "Room", width: "12%", align: "center" },
      { name: "Debit", width: "17%", align: "right" },
      { name: "Credit", width: "17%", align: "right" },
    ]
    : [];

  return (
    <>
      <div
        ref={ref}
        id="folio-invoice-print"
        style={{
          fontFamily: FONT_BODY,
          fontSize: "14px",
          color: INK,
          background: WHITE,
          padding: "0",
          maxWidth: "1000px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <style>{`
        @media screen {
          #native-print-container {
            display: none !important;
          }
        }

        @media print {
          @page { size: A4 portrait; margin: 8mm 10mm; }
          body > *:not(#native-print-container) {
            display: none !important;
          }
          #native-print-container {
            display: block !important;
            position: static !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          .folio-page-break { page-break-before: always; }
          table { border-collapse: collapse !important; width: 100% !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }

        .fi-table-row:hover td { background: #f5f6fa !important; }
      `}</style>

        <div style={{ padding: "24px 28px", marginBottom: "0" }}>

          {/* ══ HEADER ══════════════════════════════════════════════ */}
          {/* {!hideLetterhead && */}
          {/* ( */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "0" }}>
            <tbody>
              <tr>
                {/* LEFT: Logo + Property */}
                <td style={{ verticalAlign: "top", width: "55%", padding: "0 0 5px 0" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                    {propertyImage ? (
                      <img
                        src={propertyImage}
                        alt="Property Logo"
                        style={{ width: "50px", height: "50px", objectFit: "contain", flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{
                        width: "44px", height: "44px", flexShrink: 0,
                        border: `1px solid ${RULE}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "10px", color: INK_MUTED,
                        fontFamily: FONT_LABEL, fontWeight: "400",
                      }}>
                        LOGO
                      </div>
                    )}
                    <div>
                      <div style={{
                        fontFamily: FONT_LABEL,
                        fontWeight: "700",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        color: INK,
                        lineHeight: "1.3",
                      }}>
                        {propertyData?.name || ""}
                      </div>
                      <div style={{ fontSize: "12px", color: INK_SOFT, lineHeight: "1.6", fontFamily: FONT_LABEL, fontWeight: "400" }}>
                        {propertyData?.address || ""}
                      </div>
                      <div style={{ fontSize: "12px", color: INK_SOFT, lineHeight: "1.6", fontFamily: FONT_LABEL, fontWeight: "400" }}>
                        {propertyData?.phone || ""} | {propertyData?.email || ""}
                      </div>
                    </div>
                  </div>
                </td>

                {/* RIGHT: INVOICE label */}
                <td style={{ verticalAlign: "top", textAlign: "right", width: "45%", padding: "0 0 24px 0" }}>
                  <div style={{
                    fontFamily: FONT_BODY,
                    fontWeight: "600",
                    fontSize: "22px",
                    textTransform: "uppercase",
                    color: INK,
                    lineHeight: "1",
                  }}>
                    Invoice
                  </div>
                  {
                    isfolioExist && (
                          <div style={{ display: Flex,fontFamily: FONT_LABEL, fontSize: "12px", fontWeight: "300", textTransform: "uppercase", color: INK }}>
                            Folio #&ensp;
                            <span style={{fontWeight: "600"}}>{folioNo}</span>
                          </div>
                    )
                  }
                </td>
              </tr>
            </tbody>
          </table>
          {/* ) */}
          {/* } */}

          {/* ══ GUEST + STAY INFO ════════════════════════════════════ */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 0, marginBottom: "5px", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "50%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "25%" }} />
            </colgroup>
            <tbody>
              <tr>
                {/* Guest Info - spans 1 column */}
                <td style={{ verticalAlign: "top", paddingRight: "10px", paddingLeft: "10px", paddingTop: "10px", borderTop: `1px solid ${RULE}`, borderLeft: `1px solid ${RULE}` }}>
                  {
                    (sourceType !== "company" && sourceType !== "agency") ? (
                      <BillRow label="Guest" value={<strong style={{ color: INK, fontWeight: "600" }}>{guestName}</strong>} />
                    ) : null
                  }
                  {
                    (sourceType === "company" || sourceType === "agency") && (
                      <BillRow label="Guest" value={<strong style={{ color: INK, fontWeight: "600" }}>{sourceName}</strong>} />
                    )
                  }
                  {
                    sourceType === "agency" && (
                      <BillRow label="Agency" value={<strong style={{ color: INK, fontWeight: "600" }}>{capitalizeAllLetter(sourceName)}</strong>} />
                    )
                  }
                  {
                    sourceType === "company" && (
                      <BillRow label="Company" value={<strong style={{ color: INK, fontWeight: "600" }}>{capitalizeAllLetter(sourceName)}</strong>} />
                    )
                  }
                </td>

                {/* Res No */}
                <td style={{ verticalAlign: "top", paddingLeft: "10px", paddingTop: "10px", borderTop: `1px solid ${RULE}`, borderLeft: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}` }}>
                  <StayCell label="Res No" value={reservationNo || "—"} />
                </td>

                {/* Printed Date */}
                <td style={{ verticalAlign: "top", paddingLeft: "10px", paddingTop: "10px", borderTop: `1px solid ${RULE}`, borderLeft: `1px solid ${RULE}`, borderRight: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}` }}>
                  <StayCell label="Printed Date" value={dayjs().format("DD/MM/YYYY")} />
                </td>
              </tr>
              <tr>
                {/* Booking Ref and Tour Code - spans 1 column */}
                <td style={{ verticalAlign: "top", paddingRight: "10px", paddingLeft: "10px", borderBottom: `1px solid ${RULE}`, borderLeft: `1px solid ${RULE}` }}>
                  <BillRow label="Booking Ref" value={<strong>{bookingRef}</strong> || "—"} />
                  <BillRow label="Tour Code" value={<strong>{tourCode}</strong> || "—"} />
                </td>

                {/* Arrival */}
                <td style={{ verticalAlign: "top", paddingLeft: "10px", borderBottom: `1px solid ${RULE}`, borderLeft: `1px solid ${RULE}` }}>
                  <StayCell label="Arrival" value={checkinDate ? dayjs(checkinDate).format("DD/MM/YYYY") : "—"} />
                </td>

                {/* Departure */}
                <td style={{ verticalAlign: "top", paddingLeft: "10px", borderBottom: `1px solid ${RULE}`, borderLeft: `1px solid ${RULE}`, borderRight: `1px solid ${RULE}` }}>
                  <StayCell label="Departure" value={checkoutDate ? dayjs(checkoutDate).format("DD/MM/YYYY") : "—"} />
                </td>
              </tr>
            </tbody>
          </table>

          {/* ══ TRANSACTIONS TABLE ═══════════════════════════════════ */}
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", fontSize: "13px" }}>
            <colgroup>
              {cols.map((col, idx) => (
                <col key={idx} style={{ width: col.width }} />
              ))}
            </colgroup>
            <thead>
              <tr style={{ background: BLUE_LIGHT }}>
                {cols.map(({ name, align }, i) => (
                  <th key={i} style={{
                    padding: "10px 4px",
                    textAlign: align,
                    fontFamily: FONT_LABEL,
                    fontWeight: "600",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    color: INK,
                    borderBottom: `1px solid ${RULE}`,
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                    whiteSpace: "nowrap",
                  }}>
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allLines.length === 0 ? (
                <tr>
                  <td colSpan={cols.length} style={{
                    padding: "32px",
                    textAlign: "center",
                    color: INK_MUTED,
                    fontStyle: "italic",
                    borderBottom: `1px solid ${RULE}`,
                  }}>
                    No transaction lines recorded.
                  </td>
                </tr>
              ) : (
                allLines.map((line, idx) => {
                  const amt = Number(line.grandTotal) || 0;
                  const isDebit = line.postingType === "debit";
                  const isCredit = line.postingType === "credit";

                  return (
                    <tr
                      key={line.id || idx}
                      className="fi-table-row"
                      style={{ background: WHITE }}
                    >
                      <td style={td("center", true)}>{line.chargeDate ? dayjs(line.chargeDate).format("DD/MM/YYYY") : "—"}</td>
                      <td style={{ ...td("center", true), color: INK_MUTED }}>{line?.refNo}</td>
                      <td style={{ ...td("left"), color: INK }}>{line.descriptionSnapshot || "—"}</td>
                      <td style={{ ...td("center", true), color: INK }}>{line?.roomNo || "—"}</td>
                      <td style={{ ...td("right", true), textAlign: "right", fontFamily: FONT_MONO, fontSize: "13px", fontWeight: "400", color: INK }}>
                        {isDebit ? <PriceTag value={amt} /> : <PriceTag value={0} />}
                      </td>
                      <td style={{ ...td("right", true), textAlign: "right", fontFamily: FONT_MONO, fontSize: "13px", fontWeight: "400", color: INK }}>
                        {isCredit ? <PriceTag value={amt} /> : <PriceTag value={0} />}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* ══ GRAND TOTAL ════════════════════════════════════════════ */}
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", fontSize: "13px", borderTop: `1px solid ${RULE}` }}>
            <colgroup>
              {cols.map((col, idx) => (
                <col key={idx} style={{ width: col.width }} />
              ))}
            </colgroup>
            <tbody>
              <tr>
                {cols.map((col, i) => {
                  if (col.name === "Room") {
                    return (
                      <td key={i} style={{ padding: "6px 8px", fontFamily: FONT_LABEL, fontSize: "13px", fontWeight: "600", color: INK, textAlign: "left", whiteSpace: "nowrap", borderBottom: "none", borderLeft: "none", borderRight: "none" }}>
                        Total
                      </td>
                    );
                  }
                  if (col.name === "Debit") {
                    return (
                      <td key={i} style={{ padding: "6px 8px", fontFamily: FONT_MONO, fontSize: "13px", fontWeight: "500", color: INK, textAlign: "right", whiteSpace: "nowrap", borderBottom: "none", borderLeft: "none", borderRight: "none" }}>
                        <PriceTag value={debitTotal} />
                      </td>
                    );
                  }
                  if (col.name === "Credit") {
                    return (
                      <td key={i} style={{ padding: "6px 8px", fontFamily: FONT_MONO, fontSize: "13px", fontWeight: "500", color: INK, textAlign: "right", whiteSpace: "nowrap", borderBottom: "none", borderLeft: "none", borderRight: "none" }}>
                        <PriceTag value={creditTotal} />
                      </td>
                    );
                  }
                  return <td key={i} style={{ padding: 0, borderBottom: "none", borderLeft: "none", borderRight: "none" }} />;
                })}
              </tr>
              <tr>
                {cols.map((col, i) => {
                  if (col.name === "Room") {
                    return (
                      <td key={i} style={{ padding: "6px 8px", fontFamily: FONT_LABEL, fontSize: "13px", fontWeight: "600", color: INK, textAlign: "left", whiteSpace: "nowrap", borderBottom: "none", borderLeft: "none", borderRight: "none" }}>
                        Balance
                      </td>
                    );
                  }
                  if (col.name === "Debit" && debitTotal > creditTotal) {
                    return (
                      <td key={i} style={{ padding: "6px 8px", fontFamily: FONT_MONO, fontSize: "13px", fontWeight: "500", color: INK, textAlign: "right", whiteSpace: "nowrap", borderBottom: "none", borderLeft: "none", borderRight: "none" }}>
                        <PriceTag value={balanceTotal} />
                      </td>
                    );
                  }
                  if (col.name === "Credit" && debitTotal <= creditTotal) {
                    return (
                      <td key={i} style={{ padding: "6px 8px", fontFamily: FONT_MONO, fontSize: "13px", fontWeight: "500", color: INK, textAlign: "right", whiteSpace: "nowrap", borderBottom: "none", borderLeft: "none", borderRight: "none" }}>
                        <PriceTag value={balanceTotal} />
                      </td>
                    );
                  }
                  return <td key={i} style={{ padding: 0, borderBottom: "none", borderLeft: "none", borderRight: "none" }} />;
                })}
              </tr>

            </tbody>
          </table>

          {/* ══ SUMMARY BOX ════════════════════════════════════════════ */}
          <div style={{ marginTop: "5px", width: "300px", marginLeft: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${RULE}` }}>
              <tbody>
                <tr>
                  <td style={{ padding: "5px 5px", fontFamily: FONT_LABEL, fontSize: "12px", fontWeight: "500", color: INK, borderBottom: `1px solid ${RULE}`, borderRight: `1px solid ${RULE}`, width: "50%" }}>
                    Sub Total
                  </td>
                  <td style={{ padding: "5px 5px", fontFamily: FONT_MONO, fontSize: "13px", fontWeight: "500", color: INK, textAlign: "right", borderBottom: `1px solid ${RULE}` }}>
                    <PriceTag value={subTotal} /> MMK
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px 5px", fontFamily: FONT_LABEL, fontSize: "12px", fontWeight: "500", color: INK, borderBottom: `1px solid ${RULE}`, borderRight: `1px solid ${RULE}` }}>
                    Tax
                  </td>
                  <td style={{ padding: "5px 5px", fontFamily: FONT_MONO, fontSize: "13px", fontWeight: "500", color: INK, textAlign: "right", borderBottom: `1px solid ${RULE}` }}>
                    <PriceTag value={taxTotal} /> MMK
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px 5px", fontFamily: FONT_LABEL, fontSize: "13px", fontWeight: "700", color: INK, borderRight: `1px solid ${RULE}` }}>
                    Grand Total
                  </td>
                  <td style={{ padding: "5px 5px", fontFamily: FONT_MONO, fontSize: "14px", fontWeight: "700", color: INK, textAlign: "right" }}>
                    <PriceTag value={grandTotal} /> MMK
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ══ SIGNATURES ════════════════════════════════════════════ */}
          <div style={{ marginTop: "25px", display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "30%" }}>
              <div style={{ height: "1px", background: INK_MUTED , marginBottom: "5px" , fontWeight: "200"}} />
              <div style={{ fontFamily: FONT_LABEL, fontSize: "12px", fontWeight: "600", color: INK, marginBottom: "20px" }}>
                Cashier Signature
              </div>
            </div>
            <div style={{ width: "30%" }}>
              <div style={{ height: "1px", background: INK_MUTED , marginBottom: "5px", fontWeight: "200" }} />
              <div style={{ fontFamily: FONT_LABEL, fontSize: "12px", fontWeight: "600", color: INK, marginBottom: "20px" }}>
                Client Signature
              </div>
              {/* <div style={{ height: "1px", background: INK_MUTED , marginBottom: "5px", fontWeight: "200" }} /> */}
            </div>
          </div>

          {/* ══ FOOTER ══════════════════════════════════════════════ */}
          <div style={{ marginTop: "15px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: "bottom", width: "55%", padding: 0 }}>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: "12px", color: INK_SOFT, lineHeight: "1.7", fontWeight: "400", whiteSpace: "nowrap" }}>
                      <span style={{ color: INK, fontWeight: "600" }}>Thank you</span> for choosing {propertyData?.name || ""}.
                      We look forward to welcoming you back.
                    </div>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: "11px", color: INK_MUTED, marginTop: "4px", fontWeight: "400" }}>
                      Enquiries: {propertyData?.phone || ""} | {propertyData?.email || ""}
                    </div>
                  </td>
                  <td style={{ width: "10%", padding: 0 }} />
                  <td style={{ verticalAlign: "bottom", textAlign: "center", width: "35%", padding: "0 0 0 16px" }}>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: "9px", fontWeight: "600", letterSpacing: "1px", color: INK }}>
                      Printed By
                    </div>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: "11px", fontWeight: "600", textTransform: "uppercase", color: INK }}>
                      {adminName}
                    </div>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: "11px", color: INK_MUTED, marginTop: "3px" }}>
                      {adminRole || ""}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </>
  );
});

FolioInvoicePrint.displayName = "FolioInvoicePrint";

// ── Sub-components ────────────────────────────────────────────────────────

const BillRow = ({ label, value }) => (
  <div style={{ display: "flex", marginBottom: "6px", fontSize: "13px", lineHeight: "1.5" }}>
    <span style={{ width: "140px", flexShrink: 0, fontFamily: FONT_LABEL, fontSize: "12px", color: INK_MUTED, fontWeight: "500", paddingTop: "1px" }}>
      {label}
    </span>
    <span style={{ color: INK_SOFT, fontFamily: FONT_LABEL, fontSize: "13px", fontWeight: "500" }}>{value}</span>
  </div>
);

const StayCell = ({ label, value }) => (
  <div style={{ padding: "8px 12px" }}>
    <div style={{ fontFamily: FONT_LABEL, fontSize: "12px", fontWeight: "500", color: INK_MUTED, marginBottom: "3px" }}>
      {label}
    </div>
    <div style={{ fontFamily: FONT_LABEL, fontSize: "13px", fontWeight: "600", color: INK }}>
      {value}
    </div>
  </div>
);

const td = (align, noWrap = false) => ({
  padding: "10px 8px",
  textAlign: align,
  color: INK_SOFT,
  verticalAlign: "middle",
  whiteSpace: noWrap ? "nowrap" : "normal",
  wordBreak: "normal",
  lineHeight: "1.4",
  fontSize: "13px",
  fontFamily: FONT_LABEL,
  fontWeight: "400",
  borderBottom: `1px solid ${RULE}`,
  borderTop: "none",
  borderLeft: "none",
  borderRight: "none",
  overflow: "hidden",
});

export default FolioInvoicePrint;

