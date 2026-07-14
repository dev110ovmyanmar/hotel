import React, { useEffect } from "react";
import { Form, Input, Button, Select, Drawer, InputNumber, Modal } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import {
  createServicePackage,
  updateServicePackage,
  getServicePackageDetails,
} from "../../../../api/servicePackageApi";
import { getServiceMeta } from "../../../../api/serviceInventoryApi";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import Loader from "../../../../component/Loader/Loader";
import { priceFormatter, priceParser } from "../../../../component/PriceTag/PriceTag";
import usePermission from "../../../../hooks/usePermission";
import { PERMISSIONS } from "../../../../variables/permission";

const ServicePackageForm = ({
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

  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.SERVICE_INVENTORY_EDIT);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const {
    data: serviceData,
    isLoading: serviceLoading,
    error: serviceError,
  } = useApiQuery({
    fetchQueryName: "services",
    fetchQueryFunction: getServiceMeta,
  });

  const statusOptions =
    initData?.statuses?.status
      ?.filter((item) => item.name.toLowerCase() !== "blocked")
      ?.map((item) => ({
        value: item.uuid,
        label: item.name,
      })) || [];

  const serviceLists = serviceData?.services?.map((service) => ({
    value: service?.uuid,
    label: service?.name,
  }));

  const createServicePackageMutation = useApiMutation({
    mutationFn: createServicePackage,
    invalidateKeys: [["service-packages"]],
    shouldInvalidate: page === 1,
  });

  const editServicePackageMutation = useApiMutation({
    mutationFn: updateServicePackage,
    invalidateKeys: [["service-packages"]],
  });

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "service-package-details",
    fetchQueryFunction: getServicePackageDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data,
        service: data?.service?.uuid,
        name: data?.name,
        description: data?.description,
        basePrice: data?.basePrice,
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

  const executeEditMutation = (payload) => {
    editServicePackageMutation.mutate(payload, {
      onSuccess: () => {
        handleClose();
        setDrawerOpen(false);
        Toast.success("Service Packages Updated Successfully!");
      },
    });
  };

  const onFinish = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
        name: values.name,
        service: { uuid: values.service },
        basePrice: values.basePrice,
        description: values.description,
        status: { uuid: values.status },
      };

      createServicePackageMutation.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          handleClose();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Service Packages Created Successfully!");
        },
      });
    }

    if (isEdit) {
      const originalServiceUuid = data?.service?.uuid;
      const originalPrice = data?.basePrice;

      const currentServiceUuid = values.service;
      const currentPrice = values.basePrice;

      const finalValues = {
        ...values,
        name: values.name,
        service: { uuid: values.service },
        basePrice: currentPrice,
        description: values.description,
        uuid: data?.uuid,
        status: { uuid: values.status },
      };

      const serviceChanged = originalServiceUuid !== currentServiceUuid;
      const priceUnchanged = originalPrice === currentPrice;

      // Only show alert if service was changed AND price was left untouched
      if (serviceChanged && priceUnchanged) {
        Modal.confirm({
          title: "Service Changed",
          icon: null,
          content:
            "You updated the service. Did you remember to change the Base Price in the form to your desired value?",
          okText: "Yes, Save Anyway",
          cancelText: "Go Back to Form",
          onOk: () => {
            executeEditMutation(finalValues);
          },
        });
      } else {
        // If service didn't change OR they already modified the price, save directly
        executeEditMutation(finalValues);
      }
    }
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        afterOpenChange={(open) => {
          if (open && isAdd) {
            form.resetFields();
            const defaultStatus = statusOptions?.find(
              (s) => s.label.toLowerCase() === "active",
            )?.value;
            form.setFieldsValue({ status: defaultStatus });
          }
        }}
        onClose={handleClose}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Package Details"
                : mode === "edit"
                  ? "Edit Package"
                  : "Create Package"}
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
                isPending={
                  createServicePackageMutation.isPending ||
                  editServicePackageMutation.isPending
                }
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
              <Input readOnly={isView} placeholder="Enter Package Name" />
            </Form.Item>

            <Form.Item
              label="Service"
              name="service"
              rules={[{ required: true, message: "Service is Required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? serviceLists.find((item) => item.value === value)?.label
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
                  options={serviceLists}
                  placeholder="Select Service"
                />
              )}
            </Form.Item>

            <Form.Item
              label="Base Price"
              name="basePrice"
              rules={[{ required: true, message: "Base Price is Required" }]}
            >
              <InputNumber
                className="w-full!"
                min={0}
                readOnly={isView}
                placeholder="Enter Base Price"
                suffix="MMK"
                formatter={priceFormatter}
                parser={priceParser}
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <Input.TextArea
                readOnly={isView}
                rows={3}
                placeholder="Enter Description"
              />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true }]}
              getValueProps={(value) => ({
                value: isView
                  ? statusOptions.find((item) => item.value === value)?.label
                  : value,
              })}
            >
              {isView ? (
                <Input readOnly={isView} />
              ) : (
                <Select
                  options={statusOptions}
                  open={isView ? false : undefined}
                />
              )}
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default ServicePackageForm;
