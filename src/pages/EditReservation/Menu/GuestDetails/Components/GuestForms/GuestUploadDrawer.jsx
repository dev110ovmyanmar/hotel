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
import { deleteImageUpload } from "../../../../../../api/uploadDeleteApi";
import UploadBox from "../../../../../../component/UploadBox/UploadBox";
import GuestPreview from "../../../../../../component/GuestPreview/GuestPreview";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import Toast from "../../../../../../component/Toast/Toast";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import { getGuestDetail, guestUpload } from "../../../../../../api/guestApi";

const { Title } = Typography;

const GuestUploadDrawer = ({ open, onClose, selectedRow }) => {
  const [form] = Form.useForm();
  const [guestPhoto, setGuestPhoto] = useState(null);
  const [nrcFront, setNrcFront] = useState(null);
  const [nrcBack, setNrcBack] = useState(null);
  const [passport1, setPassport1] = useState(null);
  const [passport2, setPassport2] = useState(null);
  const [otherDocs, setOtherDocs] = useState([]);
  const [originalDocs, setOriginalDocs] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const uploadRefs = useRef({});
  const profileUploadRef = useRef(null);
  const isFileObject = guestPhoto instanceof File;

  const { data } = useApiQuery({
    fetchQueryName: ["reservation-guests"],
    fetchQueryFunction: getGuestDetail,
    params: { uuid: selectedRow?.guest?.uuid },
    options: { enabled: !!selectedRow?.guest?.uuid },
  });

  const guestsUpload = useApiMutation({
    mutationFn: guestUpload,
    invalidateKeys: [["reservation-guest"]],
  });

  const deleteFileMutation = useApiMutation({
    mutationFn: deleteImageUpload,
    invalidateKeys: [["reservation-guest"]],
  });

  useEffect(() => {
    if (open && data) {
      setGuestPhoto(data?.guestFiles?.profile || null);
      setNrcFront(data?.guestFiles?.nrc?.frontFile || null);
      setNrcBack(data?.guestFiles?.nrc?.backFile || null);
      setPassport1(data?.guestFiles?.passport?.frontFile || null);
      setPassport2(data?.guestFiles?.passport?.backFile || null);

      if (data?.guestFiles?.files) {
        const formatted = data.guestFiles.files.map((f) => ({
          id: f.uuid,
          uuid: f.uuid,
          name: f.name,
          file: f.file,
        }));
        setOtherDocs(formatted);
        setOriginalDocs(formatted);
      }
    } else if (!open) {
      form.resetFields();
      setGuestPhoto(null);
      setNrcFront(null);
      setNrcBack(null);
      setPassport1(null);
      setPassport2(null);
      setOtherDocs([]);
    }
  }, [data, open, form]);

  const addDocument = () => {
    setOtherDocs((prev) => [
      ...prev,
      { id: Date.now(), uuid: null, file: null, name: "" },
    ]);
  };

  const removeDocument = (id) => {
    setOtherDocs((prev) => prev.filter((doc) => doc.id !== id));
  };

  const updateDocument = (id, updates) => {
    setOtherDocs((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc)),
    );
  };

  const handleDeleteConfirm = (doc) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This document will be permanently deleted.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        if (doc.uuid) {
          deleteFileMutation.mutate(
            { uuid: doc.uuid, fileCategory: "guest_file" },
            {
              onSuccess: () => {
                removeDocument(doc.id);
                Toast.success("Deleted successfully!");
              },
              onError: () => Toast.error("Delete failed!"),
            },
          );
        } else {
          removeDocument(doc.id);
        }
      },
    });
  };

  const onFinish = () => {
    const filesPayload = otherDocs
      .map((doc) => {
        const original = originalDocs.find(
          (origin) => origin.uuid === doc.uuid,
        );
        if (!original)
          return { uuid: doc.uuid, file: doc.file, name: doc.name };

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
      uuid: selectedRow?.guest?.uuid,
      profile: guestPhoto?.name ? guestPhoto : undefined,
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

    guestsUpload.mutate(payload, {
      onSuccess: () => {
        form.resetFields();
        onClose();
        Toast.success("Updated Successfully!");
      },
    });
  };

  const beforeUpload = (file, docId) => {
    const isValidFormat = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ].includes(file.type);
    if (!isValidFormat) {
      Toast.error("Only PNG, JPG, JPEG, and PDF files are allowed!");
      return Upload.LIST_IGNORE;
    }
    updateDocument(docId, { file });
    return false;
  };

  return (
    <Drawer
      title={`${selectedRow?.guest?.name || selectedRow?.name || "Upload Files"}`}
      placement="right"
      width={550}
      onClose={onClose}
      open={open}
      destroyOnClose
      extra={
        <FormButtons
          type="primary"
          onClick={() => form.submit()}
          isPending={guestsUpload.isPending}
        >
          Update
        </FormButtons>
      }
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Title level={5} style={{ marginTop: 0 }}>
          Profile
        </Title>
        <div ref={profileUploadRef}>
          <Upload
            className="guest-upload"
            showUploadList={false}
            beforeUpload={(file) => {
              setGuestPhoto(file);
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
              {guestPhoto ? (
                <>
                  <img
                    src={
                      isFileObject
                        ? URL.createObjectURL(guestPhoto)
                        : guestPhoto
                    }
                    alt="guest"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <GuestPreview
                    onPreview={(e) => {
                      e.stopPropagation();
                      setPreviewImage(
                        isFileObject
                          ? URL.createObjectURL(guestPhoto)
                          : guestPhoto,
                      );
                      setPreviewOpen(true);
                    }}
                    onEdit={(e) => {
                      e.stopPropagation();
                      profileUploadRef.current
                        ?.querySelector('input[type="file"]')
                        ?.click();
                    }}
                    size={32}
                  />
                </>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <PlusOutlined style={{ fontSize: 24, color: "#999" }} />
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                    Upload
                  </div>
                </div>
              )}
            </div>
          </Upload>
        </div>

        <Image
          style={{ display: "none" }}
          src={previewImage}
          preview={{ open: previewOpen, onOpenChange: setPreviewOpen }}
        />
        <Divider />

        <Title level={5}>NRC</Title>
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

        <Title level={5}>Passport</Title>
        <Row gutter={16}>
          <Col span={12}>
            <UploadBox label="File 1" file={passport1} setFile={setPassport1} />
          </Col>
          <Col span={12}>
            <UploadBox label="File 2" file={passport2} setFile={setPassport2} />
          </Col>
        </Row>
        <Divider />

        <Title level={5}>Others</Title>
        {otherDocs.map((doc) => {
          const isDocFileObject = doc.file instanceof File;
          return (
            <Card
              key={doc.id}
              style={{ marginBottom: 16 }}
              bodyStyle={{ padding: 12 }}
            >
              <Row gutter={12} align="middle" style={{ position: "relative" }}>
                <CloseOutlined
                  onClick={() => handleDeleteConfirm(doc)}
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: -4,
                    right: 0,
                    fontSize: 16,
                    color: "#ff4d4f",
                    zIndex: 10,
                  }}
                />
                <Col span={10}>
                  <div ref={(el) => (uploadRefs.current[doc.id] = el)}>
                    <Upload
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
                          background: "#fafafa",
                        }}
                      >
                        {doc.file ? (
                          (!isDocFileObject &&
                            typeof doc.file === "string" &&
                            doc.file.match(/\.pdf$/i)) ||
                          (isDocFileObject &&
                            doc.file.type === "application/pdf") ? (
                            <div style={{ textAlign: "center" }}>
                              <FilePdfOutlined
                                style={{ fontSize: 40, color: "red" }}
                              />
                              <div style={{ fontSize: 12 }}>PDF File</div>
                            </div>
                          ) : (
                            <img
                              src={
                                isDocFileObject
                                  ? URL.createObjectURL(doc.file)
                                  : doc.file
                              }
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              alt="doc"
                            />
                          )
                        ) : (
                          <div style={{ textAlign: "center" }}>
                            <PlusOutlined />
                            <div>Upload</div>
                          </div>
                        )}
                      </div>
                    </Upload>
                  </div>
                </Col>
                <Col span={14}>
                  <Form.Item label="Name" style={{ margin: 0 }} required>
                    <Input
                      placeholder="Enter Name"
                      value={doc.name}
                      onChange={(e) =>
                        updateDocument(doc.id, { name: e.target.value })
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          );
        })}
        <Button
          type="dashed"
          onClick={addDocument}
          icon={<PlusOutlined />}
          block
          style={{ marginTop: 8 }}
        >
          Add Another Document
        </Button>
      </Form>
    </Drawer>
  );
};

export default GuestUploadDrawer;
