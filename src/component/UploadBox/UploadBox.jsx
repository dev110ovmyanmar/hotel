import React, { useState, useRef } from "react";
import { Upload, Typography, Image } from "antd";
import GuestPreview from "../GuestPreview/GuestPreview";
import { PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

const UploadBox = ({ label, file, setFile }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const uploadRef = useRef(null);
  const isFileObject = file instanceof File;

  const handlePreview = (e) => {
    e.stopPropagation();
    const src = isFileObject ? URL.createObjectURL(file) : file;
    setPreviewImage(src);
    setPreviewOpen(true);
  };

  const handleEdit = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    // Locate the hidden input inside the Ant Design Upload component and click it
    const input = uploadRef.current?.querySelector('input[type="file"]');
    if (input) {
      input.click();
    }
  };

  return (
    <>
      <div ref={uploadRef}>
        {" "}
        <Upload
          id={`upload-${label}`}
          className="custom-upload"
          showUploadList={false}
          beforeUpload={(f) => {
            setFile(f);
            return false;
          }}
        >
          <div
            style={{
              position: "relative",
              border: "1px solid #d9d9d9",
              borderRadius: 5,
              width: "230px",
              height: "170px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            {file ? (
              <>
                <img
                  src={isFileObject ? URL.createObjectURL(file) : file}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <GuestPreview
                  onPreview={handlePreview}
                  onEdit={handleEdit}
                  size={30}
                />
              </>
            ) : (
              <>
                <PlusOutlined style={{ fontSize: 24, color: "#999" }} />
                <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                  Upload
                </div>
              </>
            )}
          </div>
        </Upload>
      </div>

      <Text type="secondary">{label}</Text>

      {file && (
        <Image
          style={{ display: "none" }}
          src={previewImage}
          preview={{
            open: previewOpen,
            onOpenChange: setPreviewOpen,
          }}
        />
      )}
    </>
  );
};

export default UploadBox;
