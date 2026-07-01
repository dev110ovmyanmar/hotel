import React, { useEffect } from "react";
import { Form, Input, Button, Select, Drawer, InputNumber } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import {
  getFacilityDetails,
  upsertFacility,
} from "../../../../api/facilityApi";
import Loader from "../../../../component/Loader/Loader";
import usePermission from "../../../../hooks/usePermission";
import { PERMISSIONS } from "../../../../variables/permission";

const FacilityForm = ({
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

  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.FACILITY_EDIT);

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const status = initData?.statuses?.status;

  const facilityType = initData?.statuses?.facility_type;

  const facilityTypesList = facilityType?.map((type) => ({
    value: type.uuid,
    label: type.name,
  }));

  const statusList = status
    ?.filter((item) => item.code !== "blocked")
    ?.map((status) => ({
      value: status.uuid,
      label: status.name,
    }));

  const createFacility = useApiMutation({
    mutationFn: upsertFacility,
    invalidateKeys: [["facilities"]],
    shouldInvalidate: page === 1,
  });

  const editFacility = useApiMutation({
    mutationFn: upsertFacility,
    invalidateKeys: [["facilities"]],
  });

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "facility-details",
    fetchQueryFunction: getFacilityDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data,
        facilityType: data?.facilityType.uuid,
        status: data?.status?.uuid,
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
    if (isAdd) {
      const createValues = {
        ...values,
        facilityType: { uuid: values.facilityType },
        status: { uuid: values.status },
      };

      createFacility.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          handleClose();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Service Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        facilityType: { uuid: values.facilityType },
        status: { uuid: values.status },
        uuid: data?.uuid,
      };

      editFacility.mutate(editValues, {
        onSuccess: () => {
          handleClose();
          setDrawerOpen(false);
          Toast.success("facility Updated Successfully!");
        },
      });
    }
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        afterOpenChange={(open) => {
          if (open && isAdd) {
            form.resetFields();
            const defaultStatus = status?.find((s) => s.code === 'active')?.uuid;
            form.setFieldsValue({ status: defaultStatus });
          }
        }}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Facility Details"
                : mode === "edit"
                  ? "Edit Facility"
                  : "Create Facility"}
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
              <FormButtons
                onClick={() => form.submit()}
                isPending={createFacility.isPending || editFacility.isPending}
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
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Name is Required" }]}
            >
              <Input readOnly={isView} placeholder="Enter Facility Name" />
            </Form.Item>

            <Form.Item 
              label="Capacity" 
              name="capacity" 
              readOnly={isView}
              rules={[{ required: true, message: "Capacity is Required" }]}
            >
              {/* <Input placeholder="Enter Capacity" /> */}
              <InputNumber
                // type="number"
                mode="spinner"
                placeholder="Enter Capacity"
                disabled={isView}
                style={{width:"100%"}}
                min={1}
              />
            </Form.Item>

            <Form.Item
              label="Facility Type"
              name="facilityType"
              rules={[{ required: true, message: "Facility Type is Required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? facilityTypesList.find((item) => item.value === value)
                    ?.label
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
                  options={facilityTypesList}
                  placeholder="Select Facility Type"
                />
              )}
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Status is Required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? statusList.find((item) => item.value === value)?.label
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
                  options={statusList}
                  placeholder="Select Status"
                />
              )}
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Input.TextArea
                readOnly={isView}
                rows={3}
                placeholder="Enter Description"
              />
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default FacilityForm;
