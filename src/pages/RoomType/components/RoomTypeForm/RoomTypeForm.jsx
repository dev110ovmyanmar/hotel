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
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButton from "../../../../component/FormButtons/FormButtons";
import {
  createRoomType,
  editRoomType,
  roomTypeDetails,
} from "../../../../api/roomApi";
import TextArea from "antd/es/input/TextArea";
import RoomTypeAmenityForm from "./RoomTypeAmenityForm";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import Loader from "../../../../component/Loader/Loader";

const onChange = (value) => {
  console.log("changed", value);
};

const RoomTypeForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
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

  const sharedProps = {
    mode: "spinner",
    min: 1,
    max: 10,
    defaultValue: 1,
    onChange,
    style: { width: 150 },
  };

  const childSharedProps = {
    mode: "spinner",
    min: 0,
    max: 10,
    defaultValue: 0,
    onChange,
    style: { width: 150 },
  };

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
      });
      setSelectedData(data);
    }
  }, [data]);

  const onFinish = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
      };

      createRoomTypes.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Room Type Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        uuid: data?.uuid,
      };

      editRoomTypes.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Room Type Updated Successfully!");
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
      render: (price) => price?.toLocaleString(),
    },
    {
      title: "Is Free",
      dataIndex: "isFree",
      key: "isFree",
      render: (_, record) => (
        <Tag color={record.isFree ? "green" : "red"}>
          {record.isFree ? "TRUE" : "FALSE"}
        </Tag>
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

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
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
              <Button
                type="primary"
                onClick={() => {
                  setMode("edit");
                }}
              >
                Edit
              </Button>
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
                label="Base Price"
                name="basePrice"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className="!w-full"
                  min={1}
                  readOnly={isView}
                  placeholder="Enter Base Price"
                  suffix="MMK"
                />
              </Form.Item>

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
            </div>

            {/* <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  label="Max Adults"
                  name="maxAdults"
                  rules={[
                    { required: true },
                    // {
                    //   type: "number",
                    //   min: 1,
                    // },
                  ]}
                >
                  <InputNumber
                    // {...sharedProps}
                    {...{
                      mode: "spinner",
                      min: 1,
                      max: 10,
                      defaultValue: 1,
                      onChange,
                      style: { width: 150 },
                    }}
                    placeholder="Outlined"
                    readOnly={isView}
                    width={20}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Max Children" name="maxChildren">
                  <InputNumber
                    {...{
                      mode: "spinner",
                      min: 0,
                      max: 10,
                      defaultValue: 0,
                      onChange,
                      style: { width: 150 },
                    }}
                    placeholder="Outlined"
                    readOnly={isView}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Max Occupancy"
                  name="maxOccupancy"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    {...{
                      mode: "spinner",
                      min: 1,
                      max: 10,
                      defaultValue: 1,
                      onChange,
                      style: { width: 150 },
                    }}
                    placeholder="Outlined"
                    readOnly={isView}
                  />
                </Form.Item>
              </Col>
            </Row> */}
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

              <Form.Item label="Max Extra Bed" name="extraBed">
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

            <Form.Item label="Description" name="description">
              <TextArea
                readOnly={isView}
                placeholder="Enter Room Description"
              />
            </Form.Item>

            {!isAdd && (
              <Card className="mt-5 shadow-sm  border border-gray-100 bg-gray-100!">
                <div className="flex justify-between items-center text-base font-semibold mb-5">
                  <span>Room Type Amenity </span>

                  {!isView && (
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
    </div>
  );
};

export default RoomTypeForm;
