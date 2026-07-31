import React from "react";
import dayjs from "dayjs";

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

// ── Number Formatter ──────────────────────────────────────────────────────
const fmt = (num, decimals = 0) =>
  Number(num || 0).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

// ── Main Component ────────────────────────────────────────────────────────
const FolioInvoicePrint = React.forwardRef(({ folios, folio, reservation, propertyImage, adminName, hideLetterhead }, ref) => {
  if (!reservation) return null;

  console.log("FolioList", folios);
  console.log("Folio", folio);

  const foliosList = folios
    ? Array.isArray(folios) ? folios : [folios]
    : folio ? [folio] : [];
  if (foliosList.length === 0) return null;

  const pax = (reservation.adults || 0) + (reservation.children || 0);

  let grandDebit = 0, grandCredit = 0;
  foliosList.forEach((f) =>
    (f.folioLines || []).forEach((line) => {
      const amt = Number(line.grandTotal) || 0;
      if (line.postingType === "debit") grandDebit += amt;
      else if (line.postingType === "credit") grandCredit += amt;
    })
  );
  console.log("Folios", folios);
  const grandBalance = grandDebit - grandCredit;

  const currency = foliosList[0]?.currency?.code || "MMK";
  const property = foliosList[0]?.property;

  const allLines = foliosList.flatMap((f, fIdx) => {
    const folParts = (f.folioNo || "").split("-");
    const folIdx = folParts.length > 3 ? folParts[folParts.length - 1] : (fIdx + 1);
    return (f.folioLines || []).map(line => ({
      ...line,
      _folIdx: folIdx,
      _folioNo: f.folioNo || "—",
      _folioId: f.id || "-",
    }));
  }).sort((a, b) => {
    if (!a.postedAt) return 1;
    if (!b.postedAt) return -1;
    return new Date(a.postedAt) - new Date(b.postedAt);
  });

  const showFolioColumn = !!folios;

  const cols = showFolioColumn
    ? [
      { name: "Date", width: "10%", align: "center" },
      { name: "Folio", width: "12%", align: "center" },
      { name: "Ref#", width: "8%", align: "center" },
      { name: "Description", width: "35%", align: "left" },
      { name: "Debit", width: "15%", align: "right" },
      { name: "Credit", width: "15%", align: "right" },
      { name: "Balance", width: "15%", align: "right" },
    ]
    : [
      { name: "Date", width: "10%", align: "center" },
      { name: "Ref#", width: "8%", align: "center" },
      { name: "Description", width: "42%", align: "left" },
      { name: "Debit", width: "15%", align: "right" },
      { name: "Credit", width: "15%", align: "right" },
      { name: "Balance", width: "15%", align: "right" },
    ];

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
          maxWidth: "900px",
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
          @page { size: A4 portrait; margin: 10mm 14mm; }
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

        <div style={{ padding: "36px 40px", marginBottom: "0" }}>

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
                          {property?.name || "AZURA BEACH RESORT CHAUNG THA"}
                        </div>
                        <div style={{ fontSize: "14px", color: INK_SOFT, lineHeight: "1.65", fontFamily: FONT_LABEL, fontWeight: "500" }}>
                          {property?.address || "Chaung Tha Beach, Pathein Township, Ayeyarwady Region, Myanmar"}
                        </div>
                        <div style={{ fontSize: "14px", color: INK_SOFT, lineHeight: "1.65", fontFamily: FONT_LABEL, fontWeight: "500" }}>
                          {property?.phone || "+959 977990001"}&ensp;·&ensp;{property?.email || "info.ct@azura-hotels.com"}
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
                      <strong style={{ color: INK }}>{reservation.reservationNo}</strong>
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
                  <BillRow label="Guest" value={<strong style={{ color: INK, fontWeight: "600" }}>{reservation.guest?.name || "—"}</strong>} />
                  <BillRow label="Phone" value={reservation.guest?.phone || "—"} />
                  <BillRow label="Company" value={reservation.sourceType?.code === "company" ? reservation.source?.name || "—" : "—"} />
                  <BillRow label="Tour Code" value={reservation.tourCode || "—"} />
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
                  }}>Nights
                    <StayCell label="Arrival" value={
                      reservation.actualCheckin
                        ? dayjs(reservation.actualCheckin).format("DD MMM YYYY")
                        : reservation.plannedCheckin
                          ? dayjs(reservation.plannedCheckin).format("DD MMM YYYY")
                          : "—"
                    } />
                    <StayCell label="Departure" value={
                      reservation.actualCheckout
                        ? dayjs(reservation.actualCheckout).format("DD MMM YYYY")
                        : reservation.plannedCheckout
                          ? dayjs(reservation.plannedCheckout).format("DD MMM YYYY")
                          : "—"
                    } />

                    {/* This wrapper forces Nights, Pax, and Rooms into a single row spanning both grid columns */}
                    <div style={{
                      gridColumn: "span 2",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      columnGap: "24px"
                    }}>
                      <StayCell label="Nights" value={reservation.totalNight ?? "—"} />
                      <StayCell label="Pax" value={pax} />
                      <StayCell label="Rooms" value={reservation.totalRooms ?? "—"} />
                    </div>
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
                  const folIdx = line._folIdx;
                  const refVal = "-";
                  const amt = Number(line.grandTotal) || 0;
                  const isDebit = line.postingType === "debit";
                  const isCredit = line.postingType === "credit";
                  const balance = isDebit ? amt : isCredit ? -amt : 0;
                  const isEven = idx % 2 === 0;

                  return (
                    <tr
                      key={line.id || idx}
                      className="fi-table-row"

                      style={{ background: isEven ? WHITE : ROW_ALT }}
                    >
                      <td style={td("center", true)}>{line.postedAt ? dayjs(line.postedAt).format("DD/MM/YY") : "—"}</td>
                      {showFolioColumn && (
                        <td style={{ ...td("center", false), color: INK_MUTED }}>{line._folioId}</td>
                      )}
                      <td style={{ ...td("center", true), color: INK_MUTED }}>{refVal}</td>
                      <td style={{ ...td("left"), color: INK, fontWeight: "600" }}>{line.descriptionSnapshot || "—"}</td>
                      <td style={{ ...td("right", true), textAlign: "right", fontFamily: FONT_MONO, fontSize: "13.5px", fontWeight: "500", color: INK }}>
                        {isDebit ? fmt(amt) : "0"}
                      </td>
                      <td style={{ ...td("right", true), textAlign: "right", fontFamily: FONT_MONO, fontSize: "13.5px", fontWeight: "500", color: INK }}>
                        {isCredit ? fmt(amt) : "0"}
                      </td>
                      <td style={{ ...td("right", true), textAlign: "right", fontFamily: FONT_MONO, fontSize: "13.5px", fontWeight: "500", color: INK }}>
                        {fmt(balance)}
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
                      <td key={i} style={{ padding: "12px 0 12px 6px", fontFamily: FONT_MONO, fontSize: "14.5px", fontWeight: "500", color: INK, textAlign: "right", whiteSpace: "nowrap", borderBottom: "none", borderLeft: "none", borderRight: "none" }}>
                        {fmt(grandDebit)}
                        {/* {currency} */}
                      </td>
                    );
                  }
                  if (col.name === "Credit") {
                    return (
                      <td key={i} style={{ padding: "12px 0 12px 6px", fontFamily: FONT_MONO, fontSize: "14.5px", fontWeight: "500", color: INK, textAlign: "right", whiteSpace: "nowrap", borderBottom: "none", borderLeft: "none", borderRight: "none" }}>
                        {fmt(grandCredit)}
                        {/* {currency} */}
                      </td>
                    );
                  }
                  if (col.name === "Balance") {
                    return (
                      <td key={i} style={{ padding: "12px 0 12px 6px", fontFamily: FONT_MONO, fontSize: "16px", fontWeight: "500", color: INK, textAlign: "right", whiteSpace: "nowrap", borderBottom: "none", borderLeft: "none", borderRight: "none" }}>
                        {fmt(grandBalance)}
                        {/* {currency} */}
                      </td>
                    );
                  }
                  return <td key={i} style={{ padding: 0, borderBottom: "none", borderLeft: "none", borderRight: "none" }} />;
                })}
              </tr>
              <tr>
                {cols.map((col, i) => {
                  if (col.name === "Description") {
                    return (
                      <td key={i} style={{ padding: "8px 6px", fontFamily: FONT_LABEL, fontSize: "14px", fontWeight: "700", color: INK, textAlign: "left", whiteSpace: "nowrap", borderBottom: "none", borderLeft: "none", borderRight: "none" }}>
                        Balance
                      </td>
                    );
                  }
                  if (col.name === "Balance") {
                    return (
                      <td key={i} style={{ padding: "8px 0 8px 6px", fontFamily: FONT_MONO, fontSize: "16px", fontWeight: "700", color: INK, textAlign: "right", whiteSpace: "nowrap", borderTop: `1.5px solid ${BLUE}`, borderBottom: "none", borderLeft: "none", borderRight: "none", background: BLUE_LIGHT }}>
                        {fmt(grandBalance)} {currency}
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
                      <span style={{ color: INK, fontWeight: "700" }}>Thank you</span> for choosing {property?.name || ""}.
                      We look forward to welcoming you back.
                    </div>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: "13px", color: INK_MUTED, marginTop: "4px", fontWeight: "500" }}>
                      Enquiries: {property?.email || ""}
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
                      {property?.name || ""}
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
  padding: "10px 6px",
  textAlign: align,
  color: INK_SOFT,
  verticalAlign: "middle",
  whiteSpace: noWrap ? "nowrap" : "normal",
  wordBreak: "normal",
  lineHeight: "1.4",
  fontSize: "13.5px",
  fontFamily: FONT_LABEL,
  fontWeight: "500",
  borderBottom: `1px solid ${RULE}`,
  borderTop: "none",
  borderLeft: "none",
  borderRight: "none",
});

export default FolioInvoicePrint;

