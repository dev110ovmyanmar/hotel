import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Drawer,
  Row,
  Col,
  Table,
  Card,
  Tag,
  InputNumber,
  Select,
  Divider,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButton from "../../../../component/FormButtons/FormButtons";
import {
  createRoomType,
  editRoomType,
  roomTypeDetails,
  fetchRoomTypeUpload,
  ratePlanMeta,
} from "../../../../api/roomApi";
import TextArea from "antd/es/input/TextArea";
import RoomTypeAmenityForm from "./RoomTypeAmenityForm";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import Loader from "../../../../component/Loader/Loader";
import ImageUpload from "../../../../component/ImageUpload/ImageUpload";
import PriceTag from "../../../../component/PriceTag/PriceTag";
import { PERMISSIONS } from "../../../../variables/permission";
import usePermission from "../../../../hooks/usePermission";
import { hasIn } from "lodash";
import { deleteImageUpload } from "../../../../api/deleteImageApi";
import { queryClient } from "../../../../app/queryClient";

const RoomTypeForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  imageDrawerOpen,
  setImageDrawerOpen,
  setPage,
  page,
}) => {
  const [form] = Form.useForm();
  const [roomTypeAmenityOpen, setRoomTypeAmenityOpen] = useState(false);
  const [amenityMode, setAmenityMode] = useState("add");
  const [selectedAmenity, setSelectedAmenity] = useState(null);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { hasPermission } = usePermission();

  const canEdit = hasPermission(PERMISSIONS.ROOM_TYPE_EDIT);
  const canEditOrCreateRoomTypeAmenity = hasPermission(
    PERMISSIONS.ROOM_TYPE_AMENITY,
  );

  const sharedProps = {
    mode: "spinner",
    min: 1,
    max: 15,
    defaultValue: 1,
    style: { width: 150 },
  };

  const childSharedProps = {
    mode: "spinner",
    min: 0,
    max: 10,
    defaultValue: 0,
    style: { width: 150 },
  };

  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const statuses = initData?.statuses?.status
    ?.filter((item) => {
      return item.code !== "blocked";
    })
    .map((item) => ({
      value: item.uuid,
      label: item.name,
    }));

  const { data: ratePlanMetaData } = useApiQuery({
    fetchQueryName: "ratePlanMetaData",
    fetchQueryFunction: ratePlanMeta,
  });

  const ratePlans = ratePlanMetaData?.rate_plans?.map((rate) => ({
    value: rate.uuid,
    label: rate.name,
  }));

  const createRoomTypes = useApiMutation({
    mutationFn: createRoomType,
    invalidateKeys: [["roomTypeData"]],
    shouldInvalidate: page === 1,
  });

  const editRoomTypes = useApiMutation({
    mutationFn: editRoomType,
    invalidateKeys: [["roomTypeData"]],
  });

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "roomTypeData",
    fetchQueryFunction: roomTypeDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data,
        roomNo: data?.roomNo,
        status: data?.status?.uuid,
        floorUuid: data?.floor?.uuid,
        roomTypeUuid: data?.roomType?.uuid,
      });

      setSelectedData(data);
    }
  }, [data]);

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    const formattedRatePlans = ratePlans.map((rp) => ({
      uuid: rp.value,
      price: String(values[rp.value]),
    }));

    const roomTypeCreatePayload = {
      ...values,
      basePrice: 0,
      status: { uuid: values.status },
      ratePlans: formattedRatePlans,
    };

    const roomTypeUpdatePayload = {
      ...values,
      basePrice: 0,
      status: { uuid: values.status },
    };

    if (isEdit) {
      roomTypeUpdatePayload.uuid = data?.uuid;
      editRoomTypes.mutate(roomTypeUpdatePayload, {
        onSuccess: () => {
          handleClose();
          setDrawerOpen(false);
          Toast.success("Updated Successfully!");
        },
      });
    } else {
      createRoomTypes.mutate(roomTypeCreatePayload, {
        onSuccess: () => {
          form.resetFields();
          handleClose();
          setDrawerOpen(false);
          Toast.success("Created Successfully!");
        },
      });
    }
  };

  const amenityColumns = [
    {
      title: "Name",
      dataIndex: ["amenity", "name"],
      key: "name",
    },
    {
      title: "Extra Price (MMK)",
      dataIndex: "extraPrice",
      key: "extraPrice",
      align: "end",
      render: (price) => <PriceTag value={price} />,
    },
    {
      title: "Is Free",
      dataIndex: "isFree",
      key: "isFree",
      align: "center",
      render: (text) => (
        <div className={text === true ? "text-[#389E0D]" : "text-[#CF1322]"}>
          {text === true ? "True" : "False"}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => {
            setAmenityMode("edit");
            setSelectedAmenity(record);
            setRoomTypeAmenityOpen(true);
          }}
        />
      ),
    },
  ];

  const fetchRoomTypeUploads = useApiMutation({
    mutationFn: fetchRoomTypeUpload,
    invalidateKeys: [["roomTypeData", { uuid: selectedData?.uuid }]],
  });

  const deleteRoomTypeUpload = useApiMutation({
    mutationFn: deleteImageUpload,
    invalidateKeys: [["roomTypeData", { uuid: selectedData?.uuid }]],
  });

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        afterOpenChange={(open) => {
          if (open && isAdd) {
            form.resetFields();
            const defaultStatus = statuses?.find(
              (s) => s.label === "Active",
            )?.value;
            form.setFieldsValue({ status: defaultStatus });
          }
        }}
        size={600}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Room Type Details"
                : mode === "edit"
                  ? "Edit Room Type"
                  : "Create Room Type"}
            </span>
            {isView ? (
              canEdit && (
                <Button
                  type="primary"
                  onClick={() => {
                    setMode("edit");
                  }}
                >
                  Edit
                </Button>
              )
            ) : (
              <FormButton
                onClick={() => form.submit()}
                isPending={createRoomTypes.isPending || editRoomTypes.isPending}
                mode={mode}
              />
            )}
          </div>
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <Loader />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            style={{ width: "100%" }}
            onFinish={onFinish}
            initialValues={{
              maxAdults: 1,
              maxOccupancy: 1,
              totalRooms: 1,
              rank: 1,
            }}
          >
            <Row gutter={24}>
              <Col span={16}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true }]}
                >
                  <Input readOnly={isView} placeholder="Enter Room Type Name" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Code"
                  name="code"
                  rules={[{ required: true }]}
                >
                  <Input readOnly={isView} placeholder="Enter Room Type Code" />
                </Form.Item>
              </Col>
            </Row>

            <div className="grid grid-cols-2 gap-6">
              <Form.Item
                label="Total Rooms"
                name="totalRooms"
                rules={[{ required: true }]}
              >
                <InputNumber
                  {...sharedProps}
                  disabled={isView}
                  style={{ width: "100%" }}
                  placeholder="Enter Totals Rooms"
                />
              </Form.Item>

              <Form.Item
                label="Luxury Level"
                name="rank"
                rules={[{ required: true }]}
              >
                <InputNumber
                  {...sharedProps}
                  readOnly={isView}
                  style={{ width: "100%" }}
                  placeholder="Enter Rank"
                />
              </Form.Item>
            </div>

            <Form.Item name="basePrice" hidden>
              <InputNumber readOnly={isView} />
            </Form.Item>

            <div className="grid grid-cols-2 gap-6">
              <Form.Item
                label="Max Adults"
                name="maxAdults"
                rules={[{ required: true }]}
              >
                <InputNumber
                  {...sharedProps}
                  placeholder="Outlined"
                  readOnly={isView}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item label="Max Children" name="maxChildren">
                <InputNumber
                  {...childSharedProps}
                  placeholder="Outlined"
                  readOnly={isView}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Form.Item
                label="Max Occupancy"
                name="maxOccupancy"
                rules={[{ required: true }]}
              >
                <InputNumber
                  {...sharedProps}
                  placeholder="Outlined"
                  readOnly={isView}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item label="Max Extra Bed" name="maxExtraBed">
                <InputNumber
                  {...childSharedProps}
                  placeholder="Outlined"
                  readOnly={isView}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>

            <Form.Item label="Room Size" name="areaSize">
              <Input readOnly={isView} placeholder="Enter Room Size" />
            </Form.Item>

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label="Description" name="description">
                  <TextArea
                    rows={3}
                    readOnly={isView}
                    placeholder="Enter Room Description"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Status is Required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? statuses.find((item) => item.value === value)?.label
                  : value,
              })}
            >
              {isView ? (
                <Input readOnly={isView} />
              ) : (
                <Select
                  showSearch={{
                    filterOption: (input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase()),
                  }}
                  options={statuses}
                  placeholder="Select Status"
                />
              )}
            </Form.Item>

            {isAdd && (
              <div className="border-2 px-4  py-4 rounded mb-2">
                {isAdd && (
                  <div className="mb-3">
                    <div className="mb-2">
                      <span className="text-gray-900 text-[16px] font-semibold">
                        Let's map room types to this rate plan
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-900 text-[15px] italic">
                        Map the following rate plans
                      </span>
                    </div>
                  </div>
                )}

                {ratePlans?.map(
                  (ratePlan) =>
                    isAdd && (
                      <Row
                        key={ratePlan?.value}
                        align="middle"
                        style={{ marginBottom: 16 }}
                      >
                        <Col span={1}>
                          <span className="text-red-500">*</span>
                        </Col>
                        <Col span={9}>
                          <span style={{ fontWeight: 500 }}>
                            {ratePlan?.label}
                          </span>
                        </Col>

                        <Col span={1} style={{ textAlign: "center" }}>
                          :
                        </Col>

                        <Col span={13}>
                          <Form.Item
                            name={ratePlan?.value}
                            noStyle
                            rules={[
                              { required: true, message: "Rate is required!" },
                            ]}
                          >
                            <InputNumber
                              min={0}
                              style={{ width: "100%" }}
                              placeholder="Enter Rate"
                              suffix="MMK"
                              formatter={(value) =>
                                value
                                  ? new Intl.NumberFormat("en-US").format(value)
                                  : ""
                              }
                              parser={(value) =>
                                value ? value.replace(/,/g, "") : ""
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    ),
                )}
              </div>
            )}

            {!isAdd && (
              <Card className="mt-5 shadow-sm  border border-gray-100 bg-gray-100!">
                <div className="flex justify-between items-center text-base font-semibold mb-5">
                  <span>Room Type Amenity </span>

                  {!isView && canEditOrCreateRoomTypeAmenity && (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setAmenityMode("add");
                        setSelectedAmenity(null);
                        setRoomTypeAmenityOpen(true);
                      }}
                    >
                      Add Room Type Amenity
                    </Button>
                  )}
                </div>

                {data?.roomTypeAmenities?.length > 0 ? (
                  <Table
                    columns={amenityColumns}
                    dataSource={data.roomTypeAmenities}
                    rowKey="uuid"
                    pagination={false}
                    size="small"
                    className="mb-5"
                  />
                ) : (
                  <span className="text-gray-400">
                    No room type amenity added
                  </span>
                )}
              </Card>
            )}
          </Form>
        )}
      </Drawer>

      <RoomTypeAmenityForm
        mode={amenityMode}
        open={roomTypeAmenityOpen}
        setDrawerOpen={setRoomTypeAmenityOpen}
        roomTypeUuid={selectedData?.uuid}
        selectedAmenity={selectedAmenity}
      />

      <ImageUpload
        partneruuid={selectedData?.uuid}
        agencyFileList={data?.roomTypeFiles}
        handleUploadMutation={fetchRoomTypeUploads}
        imageDrawerOpen={imageDrawerOpen}
        setImageDrawerOpen={setImageDrawerOpen}
        fileCategoryName="room_type"
        deleteMutation={deleteRoomTypeUpload}
      />
    </div>
  );
};

export default RoomTypeForm;
