import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Image,
  Drawer,
  AutoComplete,
  Switch,
  InputNumber,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import { getServiceDetails, upsertService } from "../../../../api/serviceApi";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import {
  getAvailabilityCalendarDetails,
  updateAvailabilityCalendar,
} from "../../../../api/availabilityCalendarApi";
import {
  MAX_AVAILABILITY_ROOM,
  MIN_AVAILABILITY_ROOM,
} from "../../../../variables/constants";

const RoomInventoryForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  page,
  setPage,
}) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const updateRoomInventory = useApiMutation({
    mutationFn: updateAvailabilityCalendar,
    invalidateKeys: [["availabilty-calendars"]],
  });

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "availabilty-calendar-details",
    fetchQueryFunction: getAvailabilityCalendarDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data,
        name: data?.roomType?.name,
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
    if (isEdit) {
      const editValues = {
        ...values,
        uuid: data?.uuid,
        availableRooms: values.availableRooms,
      };

      updateRoomInventory.mutate(editValues, {
        onSuccess: () => {
          handleClose();
          setDrawerOpen(false);
          Toast.success("Room Inventory Updated Successfully!");
        },
      });
    }
  };

  const sharedProps = {
    mode: "spinner",
    min: MIN_AVAILABILITY_ROOM,
    max: MAX_AVAILABILITY_ROOM,
    style: { width: "100%" },
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Room Inventory Details"
                : mode === "edit"
                  ? "Edit Room Inventory"
                  : ""}
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
              <FormButtons
                onClick={() => form.submit()}
                isPending={updateRoomInventory.isPending}
                mode={mode}
              />
            )}
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          style={{ width: "100%" }}
          onFinish={onFinish}
        >
          <Form.Item label="Room Type" name="name">
            <Input readOnly={!isAdd}/>
          </Form.Item>

          <div className="grid grid-cols-2 gap-6">
            <Form.Item
              label="Aavailable Rooms"
              name="availableRooms"
              rules={[
                { required: true, message: "Available Rooms is Required" },
              ]}
              className="minus-icon"
            >
              <InputNumber
                {...sharedProps}
                placeholder="Outlined"
                readOnly={isView}
              />
            </Form.Item>

            <Form.Item
              label="Sold Rooms"
              name="soldRooms"
              dependencies={["availableRooms"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const availableRooms = getFieldValue("availableRooms");

                    if (value === undefined || value <= availableRooms) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error(
                        "Sold rooms cannot be greater than available rooms",
                      ),
                    );
                  },
                }),
              ]}
            >
              <InputNumber {...sharedProps} readOnly={true} />
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

export default RoomInventoryForm;
