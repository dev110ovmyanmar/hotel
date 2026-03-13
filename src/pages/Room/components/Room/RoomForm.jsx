import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Drawer, Divider } from "antd";
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
import { EditOutlined } from "@ant-design/icons";

const RoomForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  setPage,
}) => {
  const [form] = Form.useForm();
  const [attributeOpen, setAttributeOpen] = useState(false);
  const [attributeMode, setAttributeMode] = useState("add");
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [loading, setLoading] = useState(false);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData"]);

  const statuses = initData?.statuses?.room_status?.map((status) => ({
    value: status.uuid,
    label: status.name,
  }));

  const { data: roomMetaData, isPending } = useApiQuery({
    fetchQueryName: "roomMetaData",
    fetchQueryFunction: roomMeta,
  });

  const roomType = roomMetaData?.room_types?.map((type) => ({
    value: type.uuid,
    label: type.name,
  }));

  const floors = roomMetaData?.floors?.map((floor) => ({
    value: floor.uuid,
    label: floor.name,
  }));

  const createRooms = useApiMutation({
    mutationFn: createRoom,
    invalidateKeys: [["roomData"]],
  });

  const editRooms = useApiMutation({
    mutationFn: editRoom,
    invalidateKeys: [["roomData"]],
  });

  const { data } = useApiQuery({
    fetchQueryName: "roomData",
    fetchQueryFunction: roomDetails,
    params: { uuid: selectedData?.uuid },
    options: { enabled: !!selectedData?.uuid },
  });

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
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
      const payload = {
        ...values,
        status: { uuid: values.status },
        roomType: { uuid: values.roomTypeUuid },
        floor: { uuid: values.floorUuid },
      };

      createRooms.mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries(["roomData"]);
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Room Created Successfully!");
        },
      });
    }

    if (isEdit) {
      const payload = {
        ...values,
        status: { uuid: values.status },
        roomType: { uuid: values.roomTypeUuid },
        floor: { uuid: values.floorUuid },
        uuid: data?.uuid,
      };

      editRooms.mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries(["roomData"]);
          setDrawerOpen(false);
          Toast.success("Room Updated Successfully!");
        },
      });
    }
  };

  return (
    <>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={500}
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
                loading={loading}
                mode={mode}
              />
            )}
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={isView}
        >
          <Form.Item
            label="Room No"
            name="roomNo"
            rules={[{ required: true, message: "Please enter room number" }]}
          >
            <Input placeholder="Enter Room No" />
          </Form.Item>

          <Form.Item
            label="Floor"
            name="floorUuid"
            rules={[{ required: true, message: "Please select floor" }]}
          >
            <Select options={floors} placeholder="Select Floor" />
          </Form.Item>

          <Form.Item
            label="Room Type"
            name="roomTypeUuid"
            rules={[{ required: true, message: "Please select room type" }]}
          >
            <Select options={roomType} placeholder="Select Room Type" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select options={statuses} placeholder="Select Status" />
          </Form.Item>

          <Divider />

          {!isAdd && (
            <div className="mt-4">
              <div className="flex justify-between items-center text-lg font-semibold mb-2">
                <span>Attribute Value</span>

                {!isView && (
                  <Button
                    type="primary"
                    onClick={() => {
                      setAttributeMode("add");
                      setSelectedAttribute(null);
                      setAttributeOpen(true);
                    }}
                  >
                    Add Attribute
                  </Button>
                )}
              </div>

              {data?.roomAttributeValues?.length > 0 ? (
                data.roomAttributeValues.map((attr) => (
                  <div
                    key={attr.uuid}
                    className="flex items-center justify-between mb-2 pb-1"
                  >
                    <span>
                      {attr.roomAttribute?.name} : {attr.value}
                    </span>

                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setAttributeMode("edit");
                        setSelectedAttribute(attr);
                        setAttributeOpen(true);
                      }}
                    />
                  </div>
                ))
              ) : (
                <span className="text-gray-400">No attributes added</span>
              )}
            </div>
          )}
        </Form>
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
