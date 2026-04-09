import React, { useState } from "react";
import {
    DeleteOutlined,
    EyeOutlined,
    LoadingOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { Drawer, Upload } from "antd";
import Toast from "../Toast/Toast";

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ImageUpload = ({
    partneruuid,
    agencyContractuuid,
    companyContractuuid,
    agencyFileList,
    handleUploadMutation,
    imageDrawerOpen,
    setImageDrawerOpen,
    title,
}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewType, setPreviewType] = useState('image');

    const isPDFfile = (fileUrl) => {
        return fileUrl?.toLowerCase().endsWith(".pdf");
    };


    const handlePreview = async file => {
        if (!file) {
            file = await getBase64(file);
        }

        if (isPDFfile(file)) {
            setPreviewType('pdf');
            window.open(file, "_blank");

            return
        } else {
            setPreviewType('image')
        }

        setPreviewImage(file);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: agencyFileList }) => {
        setFileList(agencyFileList);
    };

    const uploadButton = (
        <div
            id="partner-upload"
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
            }}
        >
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>{loading ? "Uploading...." : "Upload"}</div>
        </div>
    );

    const handleUpload = (values) => {
        setLoading(true);
        const modifileUploadValue = {
            file: values.file,
            ...(partneruuid && { uuid: partneruuid }),
            ...((agencyContractuuid || companyContractuuid) && {
                [agencyContractuuid ? "agencyContract" : "companyContract"]: {
                    uuid: agencyContractuuid || companyContractuuid,
                },
            }),
        };
        handleUploadMutation.mutate(modifileUploadValue, {
            onSuccess: () => {
                Toast.success("Image uploaded successfully");
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
        });
    };

    return (
        <>
            <Drawer
                size={550}
                title={
                    <div className="flex justify-between gap-4">
                        <span>{title || "Manage Files"}</span>
                    </div>
                }
                open={imageDrawerOpen}
                onClose={() => setImageDrawerOpen(false)}
            >
                {previewType === "image" &&  previewImage && (
                    <Image
                        styles={{ root: { display: "none" } }}
                        preview={{
                            open: previewOpen,
                            onOpenChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(""),
                        }}
                        src={previewImage}
                    />
                )}

                <div
                    id="partner-upload"
                    style={{
                        display: "flex",
                        gap: "20px",
                        flexWrap: "wrap",
                    }}
                >
                    {/* Upload Button */}
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        customRequest={handleUpload}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        showUploadList={false}
                    >
                        {uploadButton}
                    </Upload>

                    {/* Images */}

                    {[...(agencyFileList || [])]?.map((file) => {
                        return (
                            <div
                                key={file.uuid}
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    border: "1px dotted gray",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    position: "relative",
                                }}
                            >
                                {isPDFfile(file?.file) ? (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            background: "#f5f5f5",
                                            fontWeight: "bold",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => handlePreview(file?.file)}
                                    >
                                        PDF
                                    </div>
                                ) : (
                                    <img
                                        src={file?.file}
                                        alt="image"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            cursor: "pointer",
                                        }}
                                    />
                                )}
                                {/* <img
                                    src={file?.file}
                                    alt="image"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                    }}
                                /> */}

                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        width: "100%",
                                        background: "rgba(0,0,0,0.7)",
                                        display: "flex",
                                        justifyContent: "space-around",
                                        padding: "2px 0",
                                    }}
                                >
                                    <span
                                        style={{ color: "#fff", cursor: "pointer" }}
                                        onClick={() => handlePreview(file?.file)}
                                    >
                                        <EyeOutlined />
                                    </span>

                                    <span
                                        style={{ color: "red", cursor: "pointer" }}
                                        onClick={() => {
                                            setFileList((prev) => {
                                                return prev.filter((item) => item.uid !== file.uid);
                                            });
                                        }}
                                    >
                                        <DeleteOutlined />
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Drawer>
        </>
    );
};

export default ImageUpload;
