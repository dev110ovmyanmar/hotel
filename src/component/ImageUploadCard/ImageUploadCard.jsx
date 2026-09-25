import { Image, Upload } from "antd";
import { PlusOutlined, LoadingOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import Toast from "../Toast/Toast";
import usePermission from "../../hooks/usePermission";
import { PERMISSIONS } from "../../variables/permission";

const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

const ImageUploadCard = ({
  label,
  type,
  property,
  uploadMutation,
  imageUrl,
  smallSizes
}) => {
  const { hasPermission } = usePermission();
  const canEditPayment = hasPermission(PERMISSIONS.PAYMENT_EDIT);

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const inputRef = useRef();

  const handlePreview = async file => {
    console.log(file, "fileInPreview");
    if (!file) {
      file = await getBase64(file);
    }
    setPreview(file);
    setPreviewOpen(true);
  };

  const inputRefClick = () => {
    inputRef.current?.click();
  }

  const beforeUpload = (file) => {
    const isValidFormat =
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg";

    if (!isValidFormat) {
      Toast.error("Only PNG, JPG, and JPEG files are allowed!");
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleUpload = ({ file, onSuccess, onError }) => {
    setLoading(true);

    const payload = {
      uuid: property?.uuid,
      file,
      ...(type && type !== "property_icon" ? { name: type } : {}),
    };

    uploadMutation.mutate(payload, {
      onSuccess: () => {
        // setPreview(URL.createObjectURL(file));
        Toast.success(`${label} uploaded successfully`);
        onSuccess("ok");
      },
      onError: () => {
        Toast.error(`${label} upload failed`);
        onError();
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <div id={smallSizes ? "upload smallSizes" : "upload"} className="text-center mb-10"  >
      <p className="text-[15px] font-medium inline">{label}</p>

      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        accept="image/png,image/jpeg"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            handleUpload({ file })
          }
        }}
      />

      {imageUrl && (
        <Image
          styles={{ root: { display: 'none' } }}
          preview={{
            open: previewOpen,
            onOpenChange: visible => setPreviewOpen(visible),
            afterOpenChange: visible => !visible && setPreview(''),
          }}
          src={imageUrl}
        />
      )}

      <Upload
        openFileDialogOnClick={false}
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
        accept="image/png,image/jpeg"
        disabled={loading}

      >
        {loading ? (
          <div>
            <LoadingOutlined style={{ fontSize: 24 }} />
            <div style={{ marginTop: 8 }}>Uploading...</div>
          </div>
        ) : imageUrl ? (
          <div className="relative m-0 p-0 w-full h-full">
            <div
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "space-around",
                padding: "5px 0",

              }}
            >
              <span
                style={{ color: "#fff", cursor: "pointer" }}
                onClick={() => handlePreview(imageUrl)}
              >
                <EyeOutlined />
              </span>

              {
                canEditPayment &&
                <span
                  style={{ color: "orange", cursor: "pointer" }}
                  onClick={inputRefClick}

                >
                  <EditOutlined />
                </span>
              }

            </div>

            <img
              src={imageUrl}
              alt={label}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

        ) : (
          <div onClick={inputRefClick}>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )
        }
      </Upload >
      {/* </div> */}
    </div >
  );
};

export default ImageUploadCard;