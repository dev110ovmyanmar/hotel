import React, { useEffect, useMemo } from "react";
import { Form, Input, Drawer, Button, InputNumber, Select } from "antd";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import Toast from "../../../component/Toast/Toast";
import useApiQuery from "../../../hooks/useApiQuery";
import { useApiMutation } from "../../../hooks/useApiMutation";
import {
  upsertRestaurantTable,
  getRestaurantTableDetail,
} from "../../../api/restaurantTableApi";
import { queryClient } from "../../../app/queryClient";
import {
  MIN_SEAT_CAPACITY,
  MAX_SEAT_CAPACITY,
} from "../../../variables/constants";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";

const RestaurantTableForm = ({
  mode,
  setMode,
  drawerOpen,
  setDrawerOpen,
  selectedRow,
  setSelectedRow,
  setPage,
  page,
}) => {
  const [form] = Form.useForm();
  const { hasPermission } = usePermission();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const canEdit = hasPermission(PERMISSIONS.RESTAURANT_TABLE_EDIT);

  // 1. API Query for Table Detail
  const { data, isLoading } = useApiQuery({
    fetchQueryName: "table-detail",
    fetchQueryFunction: getRestaurantTableDetail,
    params: { uuid: selectedRow?.uuid },
    options: { enabled: !!selectedRow?.uuid && drawerOpen },
  });

  const tableData = data;

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const tableStatusOptions = useMemo(
    () =>
      initData?.statuses?.table_status?.map((s) => ({
        value: s.uuid,
        label: s.name,
      })) || [],
    [initData],
  );

  // Find the 'Available' status UUID safely
  const availableStatusUuid = useMemo(() => {
    return tableStatusOptions.find((s) => s.label.toLowerCase() === "available")
      ?.value;
  }, [tableStatusOptions]);

  // 2. Handle Form Filling and Resetting when Drawer opens/changes
  useEffect(() => {
    if (!drawerOpen) return;

    if (isAdd) {
      form.resetFields();
      // Explicitly set the default 'Available' status when adding
      if (availableStatusUuid) {
        form.setFieldsValue({
          tableStatus: availableStatusUuid,
        });
      }
    } else if (tableData) {
      form.setFieldsValue({
        tableNo: tableData.tableNo,
        capacity: tableData.capacity,
        tableStatus: tableData.tableStatus?.uuid || tableData.tableStatus,
      });
    }
  }, [tableData, isAdd, drawerOpen, availableStatusUuid, form]);

  const upsertMutation = useApiMutation({
    mutationFn: upsertRestaurantTable,
    invalidateKeys: [["restaurant-tables"]],
    shouldInvalidate: page === 1,
  });

  const onFinish = (values) => {
    const payload = {
      tableNo: values.tableNo,
      capacity: values.capacity,
      tableStatus: values.tableStatus ? { uuid: values.tableStatus } : null,
      uuid: isEdit ? selectedRow?.uuid : null,
    };

    upsertMutation.mutate(payload, {
      onSuccess: () => {
        handleClose();
        if (isAdd) setPage(1);
        Toast.success(`Table ${isEdit ? "Updated" : "Created"} successfully.`);
      },
    });
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedRow(null);
    form.resetFields();
  };

  const sharedProps = {
    mode: "spinner",
    min: MIN_SEAT_CAPACITY,
    max: MAX_SEAT_CAPACITY,
    style: { width: "100%" },
  };

  return (
    <Drawer
      title={
        isView
          ? "Restaurant Table Details"
          : isEdit
            ? "Edit Restaurant Table"
            : "Add Restaurant Table"
      }
      size={550}
      onClose={handleClose}
      open={drawerOpen}
      extra={
        isView ? (
          canEdit && (
            <Button type="primary" onClick={() => setMode("edit")}>
              Edit
            </Button>
          )
        ) : (
          <FormButtons
            onClick={() => form.submit()}
            mode={mode}
            isPending={upsertMutation.isPending}
          />
        )
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
          onFinish={onFinish}
          className="w-full"
        >
          <div className="grid grid-cols-12 gap-x-4">
            <div className="col-span-6">
              <Form.Item
                label="Restaurant Table Number"
                name="tableNo"
                rules={[
                  { required: true, message: "Please input table number" },
                ]}
              >
                <Input readOnly={isView} placeholder="Enter Table Number" />
              </Form.Item>
            </div>

            <div className="col-span-6">
              <Form.Item
                label="Restaurant Table (Seats)"
                name="capacity"
                rules={[{ required: true, message: "Please input capacity" }]}
              >
                <InputNumber
                  {...sharedProps}
                  placeholder="Enter Seats Quantity"
                  readOnly={isView}
                />
              </Form.Item>
            </div>

            <div className="col-span-12 mt-4">
              {/* FIXED: Changed name from "status" to "tableStatus" to align with state */}
              <Form.Item
                label="Status"
                name="tableStatus"
                rules={[{ required: true, message: "Status is Required" }]}
                getValueProps={(value) => ({
                  value: isView
                    ? tableStatusOptions.find((item) => item.value === value)
                        ?.label
                    : value,
                })}
              >
                {isView ? (
                  <Input readOnly={isView} />
                ) : (
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={tableStatusOptions}
                    placeholder="Select Status"
                  />
                )}
              </Form.Item>
            </div>
          </div>
        </Form>
      )}
    </Drawer>
  );
};

export default RestaurantTableForm;
