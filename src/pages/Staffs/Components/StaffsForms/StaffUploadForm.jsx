import React, { useEffect, useRef, useState } from "react";
import {
  Drawer,
  Upload,
  Button,
  Row,
  Col,
  Typography,
  Input,
  Form,
  Card,
  Divider,
  Image,
  Modal,
} from "antd";
import {
  CloseOutlined,
  FilePdfOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { staffDetails, staffUpload } from "../../../../api/staffApi";
import useApiQuery from "../../../../hooks/useApiQuery";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import UploadBox from "../../../../component/UploadBox/UploadBox";
import GuestPreview from "../../../../component/GuestPreview/GuestPreview";
import Toast from "../../../../component/Toast/Toast";
import { deleteImageUpload } from "../../../../api/uploadDeleteApi";

const { Title } = Typography;

const StaffUploadForm = ({ open, onClose, selectedRow }) => {
  const [form] = Form.useForm();
  const [staffPhoto, setStaffPhoto] = useState(null);
  const [nrcFront, setNrcFront] = useState(null);
  const [nrcBack, setNrcBack] = useState(null);
  const [passport1, setPassport1] = useState(null);
  const [passport2, setPassport2] = useState(null);
  const [otherDocs, setOtherDocs] = useState([]);
  const [originalDocs, setOriginalDocs] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const uploadRefs = useRef({});
  const isFileObject = staffPhoto instanceof File;
  const profileUploadRef = useRef(null);

  const { data } = useApiQuery({
    fetchQueryName: "staffData-detail",
    fetchQueryFunction: staffDetails,
    params: { uuid: selectedRow?.uuid },
    options: { enabled: !!selectedRow?.uuid && open },
  });

  const staffsUpload = useApiMutation({
    mutationFn: staffUpload,
    invalidateKeys: [["staffData-detail", selectedRow?.uuid]],
  });

  const deleteFileMutation = useApiMutation({
    mutationFn: deleteImageUpload,
    invalidateKeys: [["staffData-detail", selectedRow?.uuid]],
  });

  const addDocument = () => {
    setOtherDocs((prev) => [
      ...prev,
      { id: Date.now(), uuid: null, file: null, name: "" },
    ]);
  };

  const removeDocument = (id) => {
    setOtherDocs((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleDeleteConfirm = (doc) => {
    Modal.confirm({
      title: "Are you sure?",
      icon:null,
      content: "This document will be permanently deleted.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",

      onOk: () => {
        if (doc.uuid) {
          deleteFileMutation.mutate(
            {
              uuid: doc.uuid,
              fileCategory: "staff_file",
            },
            {
              onSuccess: () => {
                removeDocument(doc.id);
                Toast.success("Deleted successfully!");
                setOtherDocs((prev) =>
                  prev.filter((item) => item.id !== doc.id),
                );
              },
              onError: () => {
                Toast.error("Delete failed!");
              },
            },
          );
        } else {
          setOtherDocs((prev) => prev.filter((item) => item.id !== doc.id));
        }
      },
    });
  };
  const updateDocument = (id, updates) => {
    setOtherDocs((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc)),
    );
  };

  const handleFileChange = (file, id) => {
    updateDocument(id, { file });
  };

  const handleNameChange = (e, id) => {
    updateDocument(id, { name: e.target.value });
  };

  useEffect(() => {
    if (open) {
      if (data) {
        setStaffPhoto(data?.staffFiles?.profile || null);
        setNrcFront(data?.staffFiles?.nrc?.frontFile || null);
        setNrcBack(data?.staffFiles?.nrc?.backFile || null);
        setPassport1(data?.staffFiles?.passport?.frontFile || null);
        setPassport2(data?.staffFiles?.passport?.backFile || null);

        if (data?.staffFiles?.files) {
          const formatted = data.staffFiles.files.map((f) => ({
            id: f.uuid,
            uuid: f.uuid,
            name: f.name,
            file: f.file,
          }));
          setOtherDocs(formatted);
          setOriginalDocs(formatted);
        }
      }
    } else {
      form.resetFields();
    }
  }, [data, open, form]);

  const onFinish = () => {
    const filesPayload = otherDocs
      .map((doc) => {
        const original = originalDocs.find(
          (origin) => origin.uuid === doc.uuid,
        );

        if (!original) {
          return {
            uuid: doc.uuid,
            file: doc.file,
            name: doc.name,
          };
        }

        const updatedDoc = { uuid: doc.uuid };
        let hasChanged = false;

        if (doc.file && doc.file !== original.file) {
          updatedDoc.file = doc.file;
          hasChanged = true;
        }

        if (doc.name !== original.name) {
          updatedDoc.name = doc.name;
          hasChanged = true;
        }

        return hasChanged ? updatedDoc : null;
      })
      .filter(Boolean);

    const payload = {
      uuid: selectedRow.uuid,
      profile: staffPhoto?.name ? staffPhoto : undefined,
      nrc: {
        frontFile: nrcFront?.name ? nrcFront : undefined,
        backFile: nrcBack?.name ? nrcBack : undefined,
      },
      passport: {
        frontFile: passport1?.name ? passport1 : undefined,
        backFile: passport2?.name ? passport2 : undefined,
      },
      files: filesPayload,
    };

    staffsUpload.mutate(payload, {
      onSuccess: () => {
        form.resetFields();
        onClose();
        Toast.success("Upload Successfully!");
      },
    });
  };

  const beforeUpload = (file, docId) => {
    const isValidFormat =
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "application/pdf";

    if (!isValidFormat) {
      Toast.error("Only PNG, JPG, JPEG , and PDF files are allowed!");
      return Upload.LIST_IGNORE;
    }

    handleFileChange(file, docId);

    return false;
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    const src = isFileObject ? URL.createObjectURL(staffPhoto) : staffPhoto;
    setPreviewImage(src);
    setPreviewOpen(true);
  };

  const handleEditProfile = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const uploadInstance = profileUploadRef.current;
    if (uploadInstance) {
      const input = uploadInstance.querySelector('input[type="file"]');
      if (input) {
        input.click();
      }
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose(false);
  };
  
  return (
    <Drawer
      title={`${selectedRow?.name} `}
      placement="right"
      size={550}
      onClose={handleClose}
      open={open}
      destroyOnClose
      extra={
        <FormButtons
          type="primary"
          onClick={() => form.submit()}
          isPending={staffsUpload.isPending}
        >
          Upload
        </FormButtons>
      }
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Title level={5} className="mt-[-10px]">
          Profile
        </Title>
        <div ref={profileUploadRef}>
          <Upload
            className="staff-upload"
            showUploadList={false}
            beforeUpload={(file) => {
              setStaffPhoto(file);
              return false;
            }}
          >
            <div
              style={{
                border: "1px solid #d9d9d9",
                width: 130,
                height: 130,
                margin: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                overflow: "hidden",
                position: "relative",
                background: "#f5f5f5",
                borderRadius: 5,
              }}
            >
              {staffPhoto ? (
                <>
                  <img
                    src={
                      isFileObject
                        ? URL.createObjectURL(staffPhoto)
                        : staffPhoto
                    }
                    alt="staff"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  <GuestPreview
                    onPreview={handlePreview}
                    onEdit={handleEditProfile}
                    size={32}
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

        {staffPhoto && (
          <Image
            style={{ display: "none" }}
            src={previewImage}
            preview={{
              open: previewOpen,
              onOpenChange: setPreviewOpen,
            }}
          />
        )}

        <Divider />

        {/* NRC */}
        <Title level={5} style={{ marginTop: 24 }}>
          NRC
        </Title>
        <Row gutter={16}>
          <Col span={12}>
            <UploadBox
              label="Front Photo"
              file={nrcFront}
              setFile={setNrcFront}
            />
          </Col>
          <Col span={12}>
            <UploadBox label="Back Photo" file={nrcBack} setFile={setNrcBack} />
          </Col>
        </Row>

        <Divider />

        {/* Passport */}
        <Title level={5} style={{ marginTop: 24 }}>
          Passport
        </Title>
        <Row gutter={16}>
          <Col span={12}>
            <UploadBox label="File 1" file={passport1} setFile={setPassport1} />
          </Col>
          <Col span={12}>
            <UploadBox label="File 2" file={passport2} setFile={setPassport2} />
          </Col>
        </Row>

        <Divider />

        <Title level={5} style={{ marginTop: 24 }}>
          Others
        </Title>

        {otherDocs.map((doc) => {
          const isFileObject = doc.file instanceof File;

          const handlePreviewDoc = (e) => {
            e.stopPropagation();
            const src = isFileObject ? URL.createObjectURL(doc.file) : doc.file;
            setPreviewImage(src);
            setPreviewOpen(true);
          };

          const handleEditDoc = (e) => {
            e.stopPropagation();
            const uploadInstance = uploadRefs.current[doc.id];
            if (uploadInstance) {
              const input = uploadInstance.querySelector('input[type="file"]');
              if (input) input.click();
            }
          };

          const isImage = (file) => {
            if (typeof file === "string") {
              return file.match(/\.(jpeg|jpg|png|gif|webp)$/i);
            }
            return file.type.startsWith("image/");
          };

          const isPDF = (file) => {
            if (typeof file === "string") {
              return file.match(/\.pdf$/i);
            }
            return file.type === "application/pdf";
          };

          return (
            <Card key={doc.id} style={{ marginBottom: 16 }}>
              <Row gutter={12} align="middle">
                <Col span={10} style={{ position: "relative" }}>
                  <CloseOutlined
                    onClick={() => handleDeleteConfirm(doc)}
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      fontSize: 16,
                      color: "#ff4d4f",
                      marginLeft: "430px",
                    }}
                  />
                  <div ref={(el) => (uploadRefs.current[doc.id] = el)}>
                    <Upload
                      id={`upload-doc-${doc.id}`}
                      showUploadList={false}
                      beforeUpload={(file) => beforeUpload(file, doc.id)}
                      accept="image/png,image/jpeg,application/pdf"
                    >
                      <div
                        style={{
                          border: "1px solid #d9d9d9",
                          width: "160px",
                          height: "120px",
                          display: "flex",
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 5,
                        }}
                      >
                        {doc.file ? (
                          doc.file.type === "application/pdf" ? (
                            <div style={{ textAlign: "center" }}>
                              <FilePdfOutlined
                                style={{ fontSize: 40, color: "red" }}
                              />
                              <div>PDF File</div>
                            </div>
                          ) : (
                            <>
                              {isImage(doc.file) ? (
                                <img
                                  src={
                                    isFileObject
                                      ? URL.createObjectURL(doc.file)
                                      : doc.file
                                  }
                                  style={{
                                    width: "160px",
                                    height: "120px",
                                    objectFit: "fix",
                                    backgroundColor: "#ffffff",
                                  }}
                                />
                              ) : (
                                isPDF(doc.file) && (
                                  <div
                                    style={{
                                      width: "200px",
                                      height: "130px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {/* PDF */}
                                    <img
                                      src={
                                        "data:image/png;base64,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"
                                      }
                                      alt="Example"
                                    />
                                  </div>
                                )
                              )}

                              <GuestPreview
                                file={doc.file}
                                onPreview={handlePreviewDoc}
                                onEdit={handleEditDoc}
                              />
                            </>
                          )
                        ) : (
                          <>
                            <PlusOutlined />
                            <div>Upload</div>
                          </>
                        )}
                      </div>
                    </Upload>
                  </div>
                </Col>

                <Col span={14}>
                  <Form.Item label="Name" required>
                    <Input
                      placeholder="Enter Name"
                      value={doc.name}
                      onChange={(e) => handleNameChange(e, doc.id)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          );
        })}

        <Button
          onClick={addDocument}
          icon={<PlusOutlined />}
          style={{ marginTop: 8 }}
        >
          Add Another Document
        </Button>
      </Form>
    </Drawer>
  );
};

export default StaffUploadForm;
