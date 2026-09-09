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
import { roomAndRoomTypeDarkMode } from "../../../../utils";

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

  const canEdit = hasPermission(PERMISSIONS.ROOM_EDIT);
  const canCreateAttribute = hasPermission(
    PERMISSIONS.ROOM_ATTRIBUTE_VALUE_CREATE,
  );

  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  // const statuses = initData?.statuses?.room_status?.map((status) => ({
  //   value: status.uuid,
  //   label: status.name,
  // }));

  const { data: roomMetaData } = useApiQuery({
    fetchQueryName: "roomMetaData",
    fetchQueryFunction: roomMeta,
  });

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "roomData",
    fetchQueryFunction: roomDetails,
    params: { uuid: selectedData?.uuid },
    options: { enabled: !!selectedData?.uuid },
  });

  const currentStatus = data?.status?.code?.toLowerCase();

  const allowedStatuses = isAdd
    ? ["available"]
    : ["available", "out_of_order", "out_of_service"].includes(currentStatus)
      ? ["available", "out_of_order", "out_of_service"]
      : currentStatus === "occupied"
        ? ["occupied"]
        : [currentStatus];

  const statuses = initData?.statuses?.room_status?.map((status) => ({
    value: status.uuid,
    label: status.name,
    disabled: !allowedStatuses.includes(status.code?.toLowerCase()),
  }));

  const roomType = roomMetaData?.room_types?.map((type) => ({
    value: type.uuid,
    // label: `${type.name} (Remaining: ${type.remainingRooms}, Total: ${type.totalRooms})`,
    label: type.name,
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

  useEffect(() => {
    if (isAdd && statuses?.length > 0) {
      const availableStatus = statuses.find(
        (s) => s.label.toLowerCase() === "available",
      );

      if (availableStatus) {
        form.setFieldsValue({
          status: availableStatus.value,
        });
      }
    }
  }, [statuses, isAdd]);

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

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
          handleClose();
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
          handleClose();
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
        onClose={handleClose}
        size={550}
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
              canEdit && (
                <Button type="primary" onClick={() => setMode("edit")}>
                  Edit
                </Button>
              )
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
              <Card
                className={`mt-5 shadow-sm  border border-gray-100 bg-gray-100! ${roomAndRoomTypeDarkMode}`}
              >
                <div className="flex justify-between text-sm items-center font-semibold mb-2">
                  <span>Room Attributes already exits for this room</span>

                  {!isView && canCreateAttribute && (
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
        <RoomAttributesForm
          mode={attributeMode}
          open={attributeOpen}
          setDrawerOpen={setAttributeOpen}
          roomUuid={selectedData?.uuid}
          selectedAttribute={selectedAttribute}
        />
      </Drawer>
    </>
  );
};

export default RoomForm;
