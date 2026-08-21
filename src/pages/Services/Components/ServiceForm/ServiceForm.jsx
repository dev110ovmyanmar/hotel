import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Drawer,
  InputNumber,
  Row,
  Col,
  Checkbox,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import { getServiceDetails, upsertService } from "../../../../api/serviceApi";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import Loader from "../../../../component/Loader/Loader";
import {
  priceFormatter,
  priceParser,
} from "../../../../component/PriceTag/PriceTag";
import usePermission from "../../../../hooks/usePermission";
import { PERMISSIONS } from "../../../../variables/permission";

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
  const usesInventory = Form.useWatch("usesInventory", form);
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.SERVICE_EDIT);

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const billingType = initData?.statuses?.billing_type;
  const serviceType = initData?.statuses?.service_type;
  const serviceStage = initData?.statuses?.service_stage;

  const billingTypesList = billingType?.map((type) => ({
    value: type.uuid,
    label: type.name,
  }));

  const servicesTypesList = serviceType?.map((service) => ({
    value: service.uuid,
    label: service.name,
  }));

  const servicesStageList =
    serviceStage?.map((stage) => ({
      value: stage.id,
      label: stage.name,
    })) || [];

  const statusOptions =
    initData?.statuses?.status
      ?.filter((item) => item.name.toLowerCase() !== "blocked")
      ?.map((item) => ({
        value: item.uuid,
        label: item.name,
      })) || [];

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
    if (!isAdd) return;
    if (usesInventory) {
      form.setFieldsValue({
        basePrice: 0,
      });
    } else {
      form.setFieldsValue({
        basePrice: null,
      });
    }
  }, [usesInventory, isAdd, form]);

  useEffect(() => {
    if (!isAdd && data) {
      const initialStages = data?.serviceStage?.ids
        ? data.serviceStage.ids
        : data?.stages?.map((stage) => stage.id) || [];

      form.setFieldsValue({
        ...data,
        billingType: data?.billingType?.uuid,
        serviceType: data?.serviceType?.uuid,
        status: data?.status?.uuid,
        isComplimentary:
          data?.isComplimentary === true || data?.isComplimentary === 1,
        usesInventory: data?.usesInventory ?? false,
        basePrice: data?.basePrice ?? null,
        stages: initialStages,
      });

      setSelectedData(data);
    }
  }, [data, form, isAdd]);
  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    const formatPayload = (formValues) => {
      const { stages, ...rest } = formValues;

      return {
        ...rest,
        serviceType: { uuid: formValues.serviceType },
        billingType: { uuid: formValues.billingType },
        status: { uuid: formValues.status },
        isComplimentary: formValues.isComplimentary === true ? 1 : 0,
        serviceStage: {
          ids: stages || [],
        },
        basePrice: formValues.basePrice,
      };
    };

    if (isAdd) {
      const createValues = formatPayload(values);
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
        ...formatPayload(values),
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
            form.setFieldsValue({ status: defaultStatus, stages: [] });
          }
        }}
        onClose={handleClose}
        size={600}
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
            onFinish={onFinish}
            initialValues={{
              isComplimentary: false,
              usesInventory: true,
              basePrice: 0,
              stages: [],
            }}
          >
            <Form.Item
              label="Service Name"
              name="name"
              rules={[{ required: true, message: "Name is Required" }]}
            >
              <Input readOnly={isView} placeholder="Enter Service Name" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-3">
              <Form.Item
                label="Service Type"
                name="serviceType"
                rules={[
                  { required: true, message: "Service Type is Required" },
                ]}
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
                rules={[
                  { required: true, message: "Billing Type is Required" },
                ]}
                getValueProps={(value) => ({
                  value: isView
                    ? billingTypesList.find((item) => item.value === value)
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
                    options={billingTypesList}
                    placeholder="Select Billing Type"
                    open={isView ? false : undefined}
                  />
                )}
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Form.Item
                label=""
                name="usesInventory"
                valuePropName="checked"
                rules={[{ required: true }]}
                className={`mt-10 ${isView ? "pointer-events-none" : ""}`}
              >
                <Checkbox
                  disabled={isEdit}
                  className={usesInventory ? "custom-disabled-checkbox" : ""}
                  style={{ marginTop: "25px" }}
                >
                  <span className="dark:text-gray-100">
                    This service can use inventory tracking
                  </span>
                </Checkbox>
              </Form.Item>

              <Form.Item
                label="Base Price"
                name="basePrice"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className="w-full!"
                  min={0}
                  readOnly={isView || (!isEdit && usesInventory)}
                  disabled={isView || (isEdit && usesInventory)}
                  placeholder="Enter Base Price"
                  suffix="MMK"
                  formatter={priceFormatter}
                  parser={priceParser}
                />
              </Form.Item>
            </div>

            <Form.Item
              label=" Available Stages"
              name="stages"
              rules={[
                {
                  required: !isView,
                  message: "Please select at least one stage",
                },
              ]}
            >
              <Checkbox.Group className="w-full" disabled={isView}>
                <div className="grid grid-cols-4 gap-2.5">
                  {servicesStageList.map((stage) => {
                    const isChecked = form
                      .getFieldValue("stages")
                      ?.includes(stage.value);

                    return (
                      <label
                        key={stage.value}
                        className={`flex items-start gap-3 p-3.5 border rounded-xl select-none transition-all duration-200
                             ${isView ? "cursor-default" : "cursor-pointer"}
                             ${
                               isChecked
                                 ? isView
                                   ? "border-blue-300 bg-blue-50/20"
                                   : "border-blue-500 bg-blue-50/40 dark:bg-black shadow-sm shadow-blue-100/50"
                                 : isView
                                   ? "border-gray-100 "
                                   : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                             }
                                `}
                      >
                        <div className="pt-0.5">
                          <Checkbox value={stage.value}  className={isChecked ? "custom-disabled-checkbox" : ""}/>
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={`text-xs  ${
                              isChecked
                                ? isView
                                  ? "text-blue-800/70 dark:text-gray-200"
                                  : "text-blue-900 dark:text-gray-100"
                                : isView
                                  ? ""
                                  : ""
                            }`}
                          >
                            {stage.label}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </Checkbox.Group>
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
