import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Image, Drawer, AutoComplete } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { CloseOutlined } from "@ant-design/icons";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import { getServiceDetails, upsertService } from "../../../../api/serviceApi";
import FormButtons from "../../../../component/FormButtons/FormButtons";

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
  console.log(page, "page");
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const billingType = initData?.statuses?.billing_type;
  const serviceType = initData?.statuses?.service_type;
  const status = initData?.statuses?.status;

  const billingTypesList = billingType?.map((type) => ({
    value: type.uuid,
    label: type.name,
  }));

  const servicesTypesList = serviceType?.map((service) => ({
    value: service.uuid,
    label: service.name,
  }));

  const statusList = status
    ?.filter((item) => item.code !== "blocked")
    ?.map((status) => ({
      value: status.uuid,
      label: status.name,
    }));

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
      });
      setSelectedData(data);
    }
  }, [data]);

  console.log(form.getFieldValue("serviceType"), "servicetype");

  const onFinish = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
        serviceType: { uuid: values.serviceType },
        billingType: { uuid: values.billingType },
        status: { uuid: values.status },
      };

      createService.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
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
        uuid: data?.uuid,
      };

      editService.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Service Updated Successfully!");
        },
      });
    }
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={500}
        // closable={false}
        // extra={
        //   <CloseOutlined
        //     onClick={() => setDrawerOpen(false)}
        //     style={{ fontSize: 18, cursor: "pointer" }}
        //   />
        // }
        // title={
        //   mode === "view"
        //     ? "Service Details"
        //     : mode === "edit"
        //       ? "Edit Service"
        //       : "Create Service"
        // }
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
            <Input readOnly={isView} />
          </Form.Item>

          <Form.Item label="Base Price" name="basePrice" >
            <Input readOnly={isView}/>
          </Form.Item>

          <Form.Item
            label="Service Type"
            name="serviceType"
            rules={[{ required: true, message: "Service Type is Required" }]}
            getValueProps={(value) => ({
              value: isView
                ? servicesTypesList.find((item) => item.value === value)?.label
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
              <Select options={statusList} open={isView ? false : undefined} />
            )}
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea readOnly={isView} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ServiceForm;
