import React, { useState } from 'react';
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import Toast from '../Toast/Toast';

const getBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

const ImageUpload = ({
    partneruuid,
    agencyFileList,
    handleUploadMutation

}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    const handlePreview = async file => {
        if (!file) {
            file = await getBase64(file);
        }
        setPreviewImage(file);
        setPreviewOpen(true);
    };


    const handleChange = ({ fileList: agencyFileList }) => {
        setFileList(agencyFileList);
    };

    const uploadButton = (
        <div
            id='partner-upload'
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
            }}
        >
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleUpload = (values) => {
        const modifileUploadValue = {
            uuid: partneruuid,
            file: values.file,
        }
        handleUploadMutation.mutate(modifileUploadValue, {
            onSuccess: () => {
                Toast.success("Image uploaded successfully");
            }
        })
    };

    return (
        <>
            {previewImage && (
                <Image
                    styles={{ root: { display: 'none' } }}
                    preview={{
                        open: previewOpen,
                        onOpenChange: visible => setPreviewOpen(visible),
                        afterOpenChange: visible => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}

            <div
                id='partner-upload'
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
                {[...(agencyFileList || [])]?.map(file => {
                    return <div
                        key={file.uid}
                        style={{
                            width: "150px",
                            height: "150px",
                            border: "1px dotted gray",
                            borderRadius: "8px",
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        <img
                            src={file?.file || URL.createObjectURL(file?.file)}
                            alt=""
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                cursor: "pointer",
                            }}
                        />

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
                                    setFileList(prev => {
                                        return prev.filter(item => item.uid !== file.uid)
                                    }
                                    );
                                }}

                            >
                                <DeleteOutlined />
                            </span>
                        </div>
                    </div>
                })}

            </div>
        </>
    );
};

export default ImageUpload;