import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Drawer, Table, Card } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import FormButton from "../../../../component/FormButtons/FormButtons";
import {
  createRoom,
  editRoom,
  roomDetails,
  roomMeta,
} from "../../../../api/roomApi";
import RoomAttributesForm from "./RoomAttributesForm";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { PERMISSIONS } from "../../../../variables/permission";
import usePermission from "../../../../hooks/usePermission";
import Loader from "../../../../component/Loader/Loader";

const RoomForm = ({
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
  const { hasPermission } = usePermission();
  const [attributeOpen, setAttributeOpen] = useState(false);
  const [attributeMode, setAttributeMode] = useState("add");
  const [selectedAttribute, setSelectedAttribute] = useState(null);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const statuses = initData?.statuses?.room_status?.map((status) => ({
    value: status.uuid,
    label: status.name,
  }));

  const { data: roomMetaData } = useApiQuery({
    fetchQueryName: "roomMetaData",
    fetchQueryFunction: roomMeta,
  });

  const roomType = roomMetaData?.room_types?.map((type) => ({
    value: type.uuid,
    // label: `${type.name} (${type.availableRooms}/${type.totalRooms})`,
    label: `${type.name} (${type.createdRooms}/${type.totalRooms})`,
  }));

  const floors = roomMetaData?.floors?.map((floor) => ({
    value: floor.uuid,
    label: `${floor.name} (${floor.floorNo})`,
  }));

  const createRooms = useApiMutation({
    mutationFn: createRoom,
    invalidateKeys: [["roomData"]],
    shouldInvalidate: page === 1,
  });

  const editRooms = useApiMutation({
    mutationFn: editRoom,
    invalidateKeys: [["roomData"]],
  });

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "roomData",
    fetchQueryFunction: roomDetails,
    params: { uuid: selectedData?.uuid },
    options: { enabled: !!selectedData?.uuid },
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

  const onFinish = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
        status: { uuid: values.status },
        roomType: { uuid: values.roomTypeUuid },
        floor: { uuid: values.floorUuid },
      };

      createRooms.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Room Created Successfully!");
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...values,
        status: { uuid: values.status },
        roomType: { uuid: values.roomTypeUuid },
        floor: { uuid: values.floorUuid },
        uuid: data?.uuid,
      };

      editRooms.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Room Updated Successfully!");
        },
      });
    }
  };

  const attributeColumns = [
    {
      title: "Name",
      dataIndex: ["roomAttribute", "name"],
      key: "name",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_, record) =>
        hasPermission(PERMISSIONS.ROOM_ATTRIBUTE_VALUE_EDIT) && (
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setAttributeMode("edit");
              setSelectedAttribute(record);
              setAttributeOpen(true);
            }}
          />
        ),
    },
  ];

  return (
    <>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={600}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Room Details"
                : mode === "edit"
                  ? "Edit Room"
                  : "Create Room"}
            </span>

            {isView ? (
              <Button type="primary" onClick={() => setMode("edit")}>
                Edit
              </Button>
            ) : (
              <FormButton
                onClick={() => form.submit()}
                isPending={createRooms.isPending || editRooms.isPending}
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
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Room No"
              name="roomNo"
              rules={[{ required: true, message: "Please enter room number" }]}
            >
              <Input placeholder="Enter Room Number" readOnly={isView} />
            </Form.Item>

            <Form.Item
              label="Floor"
              name="floorUuid"
              rules={[{ required: true, message: "Floor is Required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? floors.find((item) => item.value === value)?.label
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
                  options={floors}
                  placeholder="Select Floor"
                />
              )}
            </Form.Item>

            <Form.Item
              label="Room Type"
              name="roomTypeUuid"
              rules={[{ required: true, message: "Room Type is Required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? roomType.find((item) => item.value === value)?.label
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
                  options={roomType}
                  placeholder="Select Room Type"
                />
              )}
            </Form.Item>

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

            {!isAdd && (
              <Card className="mt-5 shadow-sm  border border-gray-100 bg-gray-100!">
                <div className="flex justify-between text-base items-center font-semibold mb-2">
                  <span>Room Attribute Value</span>

                  {!isView && (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setAttributeMode("add");
                        setSelectedAttribute(null);
                        setAttributeOpen(true);
                      }}
                      permission={PERMISSIONS.ROOM_ATTRIBUTE_VALUE_CREATE}
                    >
                      Add Room Attribute
                    </Button>
                  )}
                </div>

                {data?.roomAttributeValues?.length > 0 ? (
                  <Table
                    columns={attributeColumns}
                    dataSource={data.roomAttributeValues}
                    rowKey="uuid"
                    pagination={false}
                    size="small"
                    className="mt-5"
                  />
                ) : (
                  <span className="text-gray-400">No attributes added</span>
                )}
              </Card>
            )}
          </Form>
        )}
      </Drawer>

      <RoomAttributesForm
        mode={attributeMode}
        open={attributeOpen}
        setDrawerOpen={setAttributeOpen}
        roomUuid={selectedData?.uuid}
        selectedAttribute={selectedAttribute}
      />
    </>
  );
};

export default RoomForm;
