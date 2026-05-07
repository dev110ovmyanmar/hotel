import React, { useEffect } from "react";
import { Form, Input, Button, Select, Drawer, InputNumber, Switch } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import { getServiceDetails, upsertService } from "../../../../api/serviceApi";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import Loader from "../../../../component/Loader/Loader";

const ServiceForm = ({
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

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const billingType = initData?.statuses?.billing_type;
  const serviceType = initData?.statuses?.service_type;

  const billingTypesList = billingType?.map((type) => ({
    value: type.uuid,
    label: type.name,
  }));

  const servicesTypesList = serviceType?.map((service) => ({
    value: service.uuid,
    label: service.name,
  }));

  const statusOptions =
    initData?.statuses?.status
      ?.filter((item) => item.name.toLowerCase() !== "blocked")
      ?.map((item) => ({
        value: item.uuid,
        label: item.name,
      })) || [];

  console.log("StatusOptions", statusOptions);

  const createService = useApiMutation({
    mutationFn: upsertService,
    invalidateKeys: [["services"]],
    shouldInvalidate: page === 1,
  });

  const editService = useApiMutation({
    mutationFn: upsertService,
    invalidateKeys: [["services"]],
  });

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "service-details",
    fetchQueryFunction: getServiceDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data,
        billingType: data?.billingType?.uuid,
        serviceType: data?.serviceType?.uuid,
        status: data?.status?.uuid,
        isComplimentary: data?.isComplimentary === true ? 1 : 0,
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
        serviceType: { uuid: values.serviceType },
        billingType: { uuid: values.billingType },
        status: { uuid: values.status },
        isComplimentary: values.isComplimentary === true ? 1 : 0,
      };

      createService.mutate(createValues, {
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
        ...values, // merge new form values
        serviceType: { uuid: values.serviceType },
        billingType: { uuid: values.billingType },
        status: { uuid: values.status },
        isComplimentary: values.isComplimentary === true ? 1 : 0,
        uuid: data?.uuid,
      };

      editService.mutate(editValues, {
        onSuccess: () => {
          handleClose();
          setDrawerOpen(false);
          Toast.success("Service Updated Successfully!");
        },
      });
    }
  };

  useEffect(() => {
    if (isAdd) {
      form.setFieldsValue({
        status: statusOptions?.find((item) => item.label === "Active").value,
      });
    }
  }, [isAdd]);

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
                ? "Service Details"
                : mode === "edit"
                  ? "Edit Service"
                  : "Create Service"}
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
                isPending={createService.isPending || editService.isPending}
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
              <Input readOnly={isView} placeholder="Enter Service Name" />
            </Form.Item>

            <Form.Item label="Base Price" name="basePrice">
              <InputNumber
                className="w-full!"
                min={0}
                readOnly={isView}
                placeholder="Enter Base Price"
                suffix="MMK"
              />
            </Form.Item>

            <Form.Item
              label="Service Type"
              name="serviceType"
              rules={[{ required: true, message: "Service Type is Required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? servicesTypesList.find((item) => item.value === value)
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
                  options={servicesTypesList}
                  placeholder="Select Service Type"
                />
              )}
            </Form.Item>

            <Form.Item
              label="Billing Type"
              name="billingType"
              rules={[{ required: true, message: "Billing Type is Required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? billingTypesList.find((item) => item.value === value)?.label
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
                  options={billingTypesList}
                  placeholder="Select Billing Type"
                  open={isView ? false : undefined}
                />
              )}
            </Form.Item>

            <Form.Item label="Status" name="status" rules={[{ required: true }]}
              getValueProps={(value) => ({
                value: isView
                  ? statusOptions.find((item) => item.value === value)?.label
                  : value,
              })}>
              {
                isView ?
                  <Input readOnly={isView} />
                  :
                  <Select
                    options={statusOptions}
                    open={isView ? false : undefined}
                  />
              }
            </Form.Item>

            <Form.Item
              label="Is Complimentary"
              name="isComplimentary"
              valuePropName="checked"
            >
              <Switch readOnly={isView} disabled={isView} />
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

export default ServiceForm;
