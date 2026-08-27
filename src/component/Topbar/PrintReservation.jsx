import React, { useEffect, useRef } from "react";

const generateContent = (data) => `
  <div class="page-wrapper">

    <div class="logo-container">
      <div class="logo-text-main">A Z U R A</div>
      <div class="logo-text-sub">Beach Resort • Chaung Tha</div>
    </div>

    <div class="form-border">
      <div class="form-title">Guest Registration Form</div>

      ${renderRow("Name", data?.guest?.fullName)}
      ${renderRow("Arrival Date", data?.checkinDate, "Departure Date", data?.checkoutDate)}
      ${renderRow("No of Night", data?.totalNight, "No of Pax", data?.noOfPax)}
      ${renderRow("Adult", data?.adults, "Child", data?.children)}
      ${renderRow("Room Type", data?.roomType?.name, "Room No", data?.room?.roomNo)}
      ${renderRow("Room Rate", data?.ratePlan?.name)}
      ${renderRow("Passport", data?.guest?.passport, "Travel Type", data?.travelType)}
      ${renderRow("NRC", data?.guest?.nrcNo, "Source Type", data?.reservation?.sourceType?.name)}
      ${renderRow("License", data?.license, "HK Receive Name", data?.hkReceiveName)}
      ${renderRow("Smart Card", data?.smartCard, "HK Receive Time", data?.hkReceiveTime)}
      ${renderRow("Mobile Phone", data?.guest?.phone, "FO Name", data?.foName)}
      ${renderRow("More Information", data?.moreInformation)}
      ${renderRow("Mobile Banking Transfer", data?.mobileTransferAmount, "Cash", data?.cashAmount)}

      <div class="policy-section">
        <div>
          <b>Payment Policy</b>
          <div>50% Deposit shall be settled upon confirmation.</div>
          <div>Deposit is Non-Refundable.</div>
          <div>Balance shall be settled upon check in.</div>

          <b style="margin-top:10px; display:block;">Cancellation Policy</b>
          <div>30% charge before 3 days.</div>
          <div>100% charge within 3 days.</div>
        </div>

        <div>
         ${data?.guest?.fullName
            ? `<div class="signature-name">${data.guest.fullName}</div>`
            : ""
          }

          <div>Guest's Signature</div>
          <div class="signature-line"></div>
        </div>
      </div>
    </div>
  </div>
`;

const styles = `
{
    box-sizing: border-box;
  }
  body { 
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; 
    color: #222; 
    margin: 10px; 
    padding: 0;
    font-size: 14px;
    background-color: #fff;
  }
  
  /* Force full page configurations on system printer layout */
  @page { 
    size: A4 portrait; 
    margin: 0mm 5mm 0mm 5mm; 
  }
  
  @media print {
    html, body {
      width: 200mm;
      height: 280mm;
    }
    .form-border {
      border: 1px solid #a0aec0 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }

  /* Document layout stylings matching image_0a1fa0.png */
  .page-wrapper {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 5px;
  }
  .logo-container {
    text-align: center;
    margin-bottom: 25px;
    margin-top: 10px;
  }
  .logo-text-main {
    font-size: 36px;
    font-weight: bold;
    letter-spacing: 6px;
    color: #2d3748;
    margin: 0;
    font-family: "Times New Roman", Times, serif;
  }
  .logo-text-sub {
    font-size: 11px;
    letter-spacing: 3px;
    color: #4a5568;
    text-transform: uppercase;
    margin-top: -2px;
    font-weight: 500;
  }
  .form-border {
    border: 1px solid #cbd5e0;
    padding: 30px 24px;
    border-radius: 4px;
    height: auto;
  }
  .form-title {
    text-align: center;
    font-size:20px;
    font-weight: bold;
    color: #4a5160;
    margin-bottom: 30px;
  }
  .row {
    display: flex;
    margin-bottom: 18px;
    align-items: flex-end;
    width: 100%;
  }
  .col {
    flex: 1;
    display: flex;
    align-items: flex-end;
    padding-right: 20px;
  }
  .col:last-child {
    padding-right: 0;
  }
  .label {
    font-weight: 500;
    color: #2d3748;
    white-space: nowrap;
    margin-right: 10px;
    font-size: 14px;
  }
  .line-fill {
    flex-grow: 1;
    border-bottom: 1px solid #a0aec0;
    padding-bottom: 2px;
    font-size: 14px;
    color: #000;
    min-height: 22px;
    padding-left: 5px;
  }
  .policy-section {
    margin-top: 45px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
  }
  .policies {
    width: 58%;
    font-size: 12.5px;
    color: #2d3748;
    line-height: 1.6;
  }
  .policy-title {
    font-weight: bold;
    text-decoration: underline;
    margin-top: 15px;
    margin-bottom: 4px;
    color: #1a202c;
    
  }
  .policy-title:first-child {
    margin-top: 0;
  }
  .signature-area {
    width: 38%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    text-align: center;
    align-self: stretch;
  }
  .signature-label {
    font-weight: 500;
    color: #2d3748;
    margin-top: 15px;
    margin-bottom: 80px; /* Generates space for physical pen signature */
  }
  .signature-line {
    border-top: 1px solid #1a202c;
    width: 100%;
  }
`;

const renderRow = (label1, value1, label2, value2) => {
  if (!label2) {
    return `
      <div class="row">
        <div class="col" style="width:100%">
          <span class="label">${label1}</span>
          <div class="line-fill">${value1 || ""}</div>
        </div>
      </div>
    `;
  }

  return `
    <div class="row">
      <div class="col">
        <span class="label">${label1}</span>
        <div class="line-fill">${value1 || ""}</div>
      </div>
      <div class="col">
        <span class="label">${label2}</span>
        <div class="line-fill">${value2 || ""}</div>
      </div>
    </div>
  `;
};

const PrintReservation = ({ open, onClose, data }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;

    doc.open();
    doc.write("");
    doc.close();

    const styleTag = doc.createElement("style");
    styleTag.innerHTML = styles;
    doc.head.appendChild(styleTag);

    doc.body.innerHTML = generateContent(data);

    const timer = setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      onClose?.();
    }, 300);

    return () => clearTimeout(timer);
  }, [open, data, onClose]);

  return (
    <iframe
      ref={iframeRef}
      title="print-frame"
      style={{ width: 0, height: 0, border: "none", position: "absolute" }}
    />
  );
};

export default PrintReservation;
