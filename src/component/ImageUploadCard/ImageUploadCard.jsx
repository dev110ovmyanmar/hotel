// import { Upload, message } from "antd";
// import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
// import { useEffect, useState } from "react";
// import Toast from "../Toast/Toast";

// const ImageUploadCard = ({
//   label,
//   type,
//   property,
//   uploadMutation,
//   imageUrl,
// }) => {
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Sync preview with API image
//   useEffect(() => {
//     if (imageUrl) {
//       setPreview(imageUrl);
//     }
//   }, [imageUrl]);

//   const uploadFile = (file) => {
//     const payload = {
//       uuid: property?.uuid,
//       file,
//       ...(type && type !== "property_icon" ? { name: type } : {}),
//     };

//     uploadMutation.mutate(payload, {
//       onSuccess: () => {
//         setPreview(URL.createObjectURL(file));
//         Toast.success(`${label} uploaded successfully`);
//       },
//       onError: () => {
//         Toast.error(`${label} upload failed`);
//       },
//       onSettled: () => {
//         setLoading(false);
//       },
//     });
//   };

//   const handleUpload = ({ file, onSuccess, onError }) => {
//     setLoading(true);

//     uploadFile(file);

//     // Antd requires these callbacks
//     setTimeout(() => {
//       onSuccess("ok");
//     }, 0);
//   };

//   return (
//     <div id="upload">
//       <p className="mb-2 text-[15px] font-medium text-center">{label}</p>

//       <Upload
//         listType="picture-card"
//         showUploadList={false}
//         customRequest={handleUpload}
//         disabled={loading}
//       >
//         {preview ? (
//           <img
//             src={preview}
//             alt={label}
//             style={{
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//             }}
//           />
//         ) : (
//           <div>
//             {loading ? <LoadingOutlined /> : <PlusOutlined />}
//             <div style={{ marginTop: 8 }}>
//               {loading ? "Uploading..." : "Upload"}
//             </div>
//           </div>
//         )}
//       </Upload>
//     </div>
//   );
// };

// export default ImageUploadCard;

// import { Upload } from "antd";
// import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
// import { useEffect, useState } from "react";
// import Toast from "../Toast/Toast";

// const ImageUploadCard = ({
//   label,
//   type,
//   property,
//   uploadMutation,
//   imageUrl,
// }) => {
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (imageUrl) {
//       setPreview(imageUrl);
//     }
//   }, [imageUrl]);

//   const handleUpload = async ({ file, onSuccess, onError }) => {
//     setLoading(true);

//     const payload = {
//       uuid: property?.uuid,
//       file,
//       ...(type && type !== "property_icon" ? { name: type } : {}),
//     };

//     uploadMutation.mutate(payload, {
//       onSuccess: () => {
//         setPreview(URL.createObjectURL(file));
//         Toast.success(`${label} uploaded successfully`);
//         onSuccess("ok");
//       },
//       onError: () => {
//         Toast.error(`${label} upload failed`);
//         onError();
//       },
//       onSettled: () => {
//         setLoading(false);
//       },
//     });
//   };

//   return (
//     <div id="upload">
//       <p className="mb-2 text-[15px] font-medium text-center">{label}</p>

//       <Upload
//         listType="picture-card"
//         showUploadList={false}
//         customRequest={handleUpload}
//         disabled={loading}
//       >
//         {preview ? (
//           <img
//             src={preview}
//             alt={label}
//             style={{
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//               opacity: loading ? 0.6 : 1,
//             }}
//           />
//         ) : (
//           <div>
//             {loading ? <LoadingOutlined /> : <PlusOutlined />}
//             <div style={{ marginTop: 8 }}>
//               {loading ? "Uploading..." : "Upload"}
//             </div>
//           </div>
//         )}
//       </Upload>
//     </div>
//   );
// };

// export default ImageUploadCard;

import { Upload } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Toast from "../Toast/Toast";

const ImageUploadCard = ({
  label,
  type,
  property,
  uploadMutation,
  imageUrl,
}) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- Sync Preview ---------------- */

  useEffect(() => {
    if (imageUrl) {
      setPreview(imageUrl);
    }
  }, [imageUrl]);

  /* ---------------- File Validation ---------------- */

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

  /* ---------------- Upload ---------------- */

  const handleUpload = ({ file, onSuccess, onError }) => {
    setLoading(true);

    const payload = {
      uuid: property?.uuid,
      file,
      ...(type && type !== "property_icon" ? { name: type } : {}),
    };

    uploadMutation.mutate(payload, {
      onSuccess: () => {
        setPreview(URL.createObjectURL(file));
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

  /* ---------------- UI ---------------- */

  return (
    <div id="upload" style={{ textAlign: "center" }}>
      <p className="mb-2 text-[15px] font-medium">{label}</p>

      <Upload
        listType="picture-card"
        showUploadList={false}
        customRequest={handleUpload}
        beforeUpload={beforeUpload}
        accept="image/png,image/jpeg"
        disabled={loading}
      >
        {loading ? (
          <div>
            <LoadingOutlined style={{ fontSize: 24 }} />
            <div style={{ marginTop: 8 }}>Uploading...</div>
          </div>
        ) : preview ? (
          <img
            src={preview}
            alt={label}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
    </div>
  );
};

export default ImageUploadCard;