import React from "react";
import { EyeOutlined, EditOutlined, DownloadOutlined } from "@ant-design/icons";

const GuestPreview = ({ onPreview, onEdit, file, size = 30 }) => {
  const isPDF = (file) => {
    if (!file) return false;
    if (typeof file === "string") {
      return file.match(/\.pdf$/i);
    }
    return file.type === "application/pdf";
  };

  const handleDownload = (e) => {
    e.stopPropagation();

    if (!file) return;

    const url = file instanceof File ? URL.createObjectURL(file) : file;

    window.open(url, "_blank");

    if (file instanceof File) {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "space-around",
      }}
    >

      <div
        onClick={(e) => {
          e.stopPropagation();
          isPDF(file) ? handleDownload(e) : onPreview?.(e);
        }}
        style={{
          width: size,
          height: size,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {isPDF(file) ? <DownloadOutlined /> : <EyeOutlined />}
      </div>

      <div
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(e);
        }}
        style={{
          width: size,
          height: size,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        <EditOutlined />
      </div>
    </div>
  );
};

export default GuestPreview;
