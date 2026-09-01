import React from "react";
import dayjs from "dayjs";
import PriceTag from "../../../../../component/PriceTag/PriceTag";

// ── Design Tokens ──────────────────────────────────────────────────────────
const FONT_BODY = "'Inter', 'Helvetica Neue', 'Arial', sans-serif";
const FONT_MONO = "'DM Mono', 'Courier New', monospace";
const FONT_LABEL = "'Inter', 'Helvetica Neue', 'Arial', sans-serif";

const INK = "#000000";
const INK_SOFT = "#000000";
const INK_MUTED = "#000000";

const BLUE = "#1e3a8a";
const BLUE_LIGHT = "#eff6ff";

const RULE = "#dbe4f0";
const WHITE = "#ffffff";
const ROW_ALT = "#f8fafc";

// ── Main Component ────────────────────────────────────────────────────────
const FolioInvoicePrint = React.forwardRef(({ printData, adminName, hideLetterhead, propertyData }, ref) => {
  if (!printData) return null;

  const propertyImage = propertyData?.propertyFiles?.find(
    (file) => file?.name === "email_photo",
  )?.file;

  // Extract fields directly from API response
  const foliosList = printData.data || [];
  const guestName = printData.folio?.guest?.name || printData.guest || "—";
  const guestPhone = printData.folio?.guest?.phone || "—";
  const reservationNo = printData.folio?.folioNo || "—";
  const tourCode = printData.tourCode || null;
  const sourceType = printData.sourceType;
  const sourceName = printData.sourceName;
  const checkinDate = printData.checkinDate;
  const checkoutDate = printData.checkoutDate;

  let grandDebit = 0, grandCredit = 0;
  foliosList.forEach((line) => {
      const amt = Number(line.grandTotal) || 0;
      if (line.postingType === "debit" && !line.voidedAt) grandDebit += amt;
      else if (line.postingType === "credit" && !line.voidedAt) grandCredit += amt;
    });

  const allLines = foliosList;

  const showFolioColumn = !!printData;

  const cols = showFolioColumn
    ? [
      { name: "Date", width: "8%", align: "center" },
      { name: "Folio", width: "10%", align: "center" },
      { name: "Ref#", width: "6%", align: "center" },
      { name: "Description", width: "26%", align: "left" },
      { name: "Room", width: "11%", align: "center" },
      { name: "Debit", width: "13%", align: "right" },
      { name: "Credit", width: "13%", align: "right" },
    ]
    : [];

  return (
    <>
      <div
        ref={ref}
        id="folio-invoice-print"
        style={{
          fontFamily: FONT_BODY,
          fontSize: "15px",
          color: INK,
          background: WHITE,
          padding: "0",
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;700&display=swap');

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

        .fi-table-row:hover td { background: #f0f4fa !important; }
      `}</style>

        <div style={{ padding: "24px 28px", marginBottom: "0" }}>

          {/* ══ HEADER ══════════════════════════════════════════════ */}
          {!hideLetterhead && (
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "0" }}>
              <tbody>
                <tr>
                  {/* LEFT: Logo + Property */}
                  <td style={{ verticalAlign: "top", width: "55%", padding: "0 0 28px 0", borderBottom: `1.5px solid ${BLUE}` }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                      {propertyImage ? (
                        <img
                          src={propertyImage}
                          alt="Property Logo"
                          style={{ width: "60px", height: "60px", objectFit: "contain", flexShrink: 0 }}
                        />
                      ) : (
                        <div style={{
                          width: "48px", height: "48px", flexShrink: 0,
                          border: `1.5px solid ${BLUE}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "10px", color: INK, letterSpacing: "1px",
                          fontFamily: FONT_LABEL, fontWeight: "700", textTransform: "uppercase",
                        }}>
                          LOGO
                        </div>
                      )}
                      <div>
                        <div style={{
                          fontFamily: FONT_LABEL,
                          fontWeight: "700",
                          fontSize: "15px",
                          letterSpacing: "3px",
                          textTransform: "uppercase",
                          color: INK,
                          lineHeight: "1.2",
                          marginBottom: "6px",
                        }}>
                          {propertyData?.name || ""}
                        </div>
                        <div style={{ fontSize: "14px", color: INK_SOFT, lineHeight: "1.65", fontFamily: FONT_LABEL, fontWeight: "500" }}>
                          {propertyData?.address || ""}
                        </div>
                        <div style={{ fontSize: "14px", color: INK_SOFT, lineHeight: "1.65", fontFamily: FONT_LABEL, fontWeight: "500" }}>
                          {propertyData?.phone || ""}&ensp;·&ensp;{propertyData?.email || ""}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* RIGHT: INVOICE label */}
                  <td style={{ verticalAlign: "bottom", textAlign: "right", width: "45%", padding: "0 0 28px 0", borderBottom: `1.5px solid ${BLUE}` }}>
                    <div style={{
                      fontFamily: FONT_BODY,
                      fontWeight: "600",
                      fontSize: "24px",
                      letterSpacing: "6px",
                      textTransform: "uppercase",
                      color: INK,
                      lineHeight: "1",
                      marginBottom: "10px",
                    }}>
                      Invoice
                    </div>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: "14px", color: INK_SOFT }}>
                      <span style={{ color: INK_MUTED, marginRight: "6px" }}>Date</span>
                      <strong style={{ color: INK }}>{dayjs().format("DD MMM YYYY")}</strong>
                    </div>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: "14px", color: INK_SOFT }}>
                      <span style={{ color: INK_MUTED, marginRight: "6px" }}>Booking Ref</span>
                      <strong style={{ color: INK }}>{reservationNo}</strong>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {/* ══ GUEST + STAY INFO ════════════════════════════════════ */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "28px", marginBottom: "28px" }}>
            <tbody>
              <tr>
                {/* BILL TO */}
                <td style={{ verticalAlign: "top", width: "50%", paddingRight: "32px" }}>
                  <div style={{
                    fontFamily: FONT_LABEL,
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: INK,
                    marginBottom: "14px",
                  }}>
                    Bill To
                  </div>
                  <BillRow label="Guest" value={<strong style={{ color: INK, fontWeight: "600" }}>{guestName}</strong>} />
                  <BillRow label="Phone" value={guestPhone} />
                  <BillRow label="Company" value={sourceType === "company" ? sourceName || "—" : "—"} />
                  <BillRow label="Tour Code" value={tourCode || "—"} />
                </td>

                {/* STAY GRID */}
                <td style={{ verticalAlign: "top", width: "50%", paddingLeft: "32px", borderLeft: `1px solid ${RULE}` }}>
                  <div style={{
                    fontFamily: FONT_LABEL,
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: INK,
                    marginBottom: "14px",
                  }}>
                    Stay Details
                  </div>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    rowGap: "12px",
                    columnGap: "24px"
                  }}>
                    <StayCell label="Arrival" value={
                      checkinDate ? dayjs(checkinDate).format("DD MMM YYYY") : "—"
                    } />
                    <StayCell label="Departure" value={
                      checkoutDate ? dayjs(checkoutDate).format("DD MMM YYYY") : "—"
                    } />

                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ══ FOLIO LABEL ══════════════════════════════════════════ */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${RULE}`,
            borderBottom: `1px solid ${RULE}`,
            padding: "10px 0",
            marginBottom: "0",
          }}>
            <div style={{
              fontFamily: FONT_LABEL,
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: INK,
            }}>
              {foliosList.length > 1 ? " " : `Folio Transactions \u00a0\u00b7\u00a0 ${foliosList[0]?.folioNo || "#1"}`}
            </div>
          </div>

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
                    fontWeight: "700",
                    fontSize: "11px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    color: INK,
                    borderBottom: `1.5px solid ${BLUE}`,
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
                  const isEven = idx % 2 === 0;

                  return (
                    <tr
                      key={line.id || idx}
                      className="fi-table-row"

                      style={{ background: isEven ? WHITE : ROW_ALT }}
                    >
                      <td style={td("center", true)}>{line.postedAt ? dayjs(line.postedAt).format("DD/MM/YY") : "—"}</td>
                      {showFolioColumn && (
                        <td style={{ ...td("center", false), color: INK_MUTED }}>{line?.folioId}</td>
                      )}
                      <td style={{ ...td("center", true), color: INK_MUTED }}>{line?.refNo}</td>
                      <td style={{ ...td("left"), color: INK }}>{line.descriptionSnapshot || "—"}</td>
                      <td style={{ ...td("center", true), color: INK }}>{line?.roomNo || "—"}</td>
                      <td style={{ ...td("right", true), textAlign: "right", fontFamily: FONT_MONO, fontSize: "13.5px", fontWeight: "500", color: INK }}>
                        {isDebit ? <PriceTag value={amt} /> : <PriceTag value={0} />}
                      </td>
                      <td style={{ ...td("right", true), textAlign: "right", fontFamily: FONT_MONO, fontSize: "13.5px", fontWeight: "500", color: INK }}>
                        {isCredit ? <PriceTag value={amt} /> : <PriceTag value={0} />}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* ══ GRAND TOTAL ════════════════════════════════════════════ */}
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", fontSize: "13px", borderTop: `1.5px solid ${BLUE}` }}>
            <colgroup>
              {cols.map((col, idx) => (
                <col key={idx} style={{ width: col.width }} />
              ))}
            </colgroup>
            <tbody>
              <tr>
                {cols.map((col, i) => {
                  if (col.name === "Debit") {
                    return (
                      <td key={i} style={{ padding: "12px 8px 12px 8px", fontFamily: FONT_MONO, fontSize: "14.5px", fontWeight: "500", color: INK, textAlign: "right", whiteSpace: "nowrap", borderBottom: "none", borderLeft: "none", borderRight: "none" }}>
                        <PriceTag value={grandDebit} />
                      </td>
                    );
                  }
                  if (col.name === "Credit") {
                    return (
                      <td key={i} style={{ padding: "12px 8px 12px 8px", fontFamily: FONT_MONO, fontSize: "14px", fontWeight: "500", color: INK, textAlign: "right", whiteSpace: "nowrap", borderBottom: "none", borderLeft: "none", borderRight: "none" }}>
                        <PriceTag value={grandCredit} />
                      </td>
                    );
                  }
                  return <td key={i} style={{ padding: 0, borderBottom: "none", borderLeft: "none", borderRight: "none" }} />;
                })}
              </tr>
            </tbody>
          </table>

          {/* ══ FOOTER ══════════════════════════════════════════════ */}
          <div style={{ marginTop: "36px" }}>
            <div style={{ height: "1px", background: RULE, marginBottom: "24px" }} />
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: "bottom", width: "55%", padding: 0 }}>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: "13.5px", color: INK_SOFT, lineHeight: "1.7", fontWeight: "500" }}>
                      <span style={{ color: INK, fontWeight: "700" }}>Thank you</span> for choosing Azura.
                      We look forward to welcoming you back.
                    </div>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: "13px", color: INK_MUTED, marginTop: "4px", fontWeight: "500" }}>
                      Enquiries: {propertyData?.phone || ""} &ensp;·&ensp;{propertyData?.email || ""}
                    </div>
                  </td>
                  <td style={{ width: "10%", padding: 0 }} />
                  <td style={{ verticalAlign: "bottom", textAlign: "center", width: "35%", padding: "0 0 0 16px" }}>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: "9px", fontWeight: "700", letterSpacing: "2px", color: INK }}>
                      Printed By
                    </div>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: INK }}>
                      {adminName}
                    </div>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: "12px", color: INK_MUTED, marginTop: "3px" }}>
                      {propertyData?.name || ""}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{
              textAlign: "center",
              marginTop: "20px",
              fontFamily: FONT_LABEL,
              fontSize: "11px",
              fontWeight: "500",
              color: INK_MUTED,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              borderTop: `1px solid ${RULE}`,
              paddingTop: "10px",
            }}>
              Document generated {dayjs().format("DD MMM YYYY [at] HH:mm")}
            </div>
          </div>
        </div>
      </div>

    </>
  );
});

FolioInvoicePrint.displayName = "FolioInvoicePrint";

// ── Sub-components ────────────────────────────────────────────────────────

const BillRow = ({ label, value }) => (
  <div style={{ display: "flex", marginBottom: "7px", fontSize: "15px", lineHeight: "1.5" }}>
    <span style={{ width: "150px", flexShrink: 0, fontFamily: FONT_LABEL, fontSize: "13px", color: INK_MUTED, fontWeight: "600", paddingTop: "1px" }}>
      {label}
    </span>
    <span style={{ color: INK_SOFT, fontFamily: FONT_LABEL, fontSize: "14px", fontWeight: "500" }}>{value}</span>
  </div>
);

const StayCell = ({ label, value }) => (
  <div style={{ padding: "4px 0" }}>
    <div style={{ fontFamily: FONT_LABEL, fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: INK_MUTED, marginBottom: "3px" }}>
      {label}
    </div>
    <div style={{ fontFamily: FONT_LABEL, fontSize: "15px", fontWeight: "700", color: INK }}>
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
  fontSize: "13.5px",
  fontFamily: FONT_LABEL,
  fontWeight: "300",
  borderBottom: `1px solid ${RULE}`,
  borderTop: "none",
  borderLeft: "none",
  borderRight: "none",
  overflow: "hidden",
});

export default FolioInvoicePrint;

