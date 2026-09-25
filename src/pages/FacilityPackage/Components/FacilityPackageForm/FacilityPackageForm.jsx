import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Image,
  Drawer,
  AutoComplete,
  InputNumber,
  TimePicker,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import {
  facilityMeta,
  getFacilityPackageDetails,
  upsertFacilityPackage,
} from "../../../../api/facilityPackageApi";
import Loader from "../../../../component/Loader/Loader";
import usePermission from "../../../../hooks/usePermission";
import { PERMISSIONS } from "../../../../variables/permission";
import dayjs from "dayjs";
import Status from "../../../../component/Status/Status";
import PriceInput from "../../../../component/PriceInput/PriceInput";

const FacilityPackageForm = ({
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
  const canEdit = hasPermission(PERMISSIONS.FACILITY_PACKAGE_EDIT);

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const status = initData?.statuses?.status;
  const pricingType = initData?.statuses?.facility_pricing_type;

  const pricingTypesList = pricingType?.map((type) => ({
    value: type.uuid,
    label: type.name,
  }));

  const statusList = status
    ?.filter((item) => item.code !== "blocked")
    ?.map((status) => ({
      value: status.uuid,
      label: status.name,
    }));

  const { data: facilityMetaData } = useApiQuery({
    fetchQueryName: "facilityMetaData",
    fetchQueryFunction: facilityMeta,
  });

  const facilityList = facilityMetaData?.facilities?.map((facilitiy) => ({
    value: facilitiy.uuid,
    label: facilitiy.name,
  }));

  const createFacility = useApiMutation({
    mutationFn: upsertFacilityPackage,
    invalidateKeys: [["facility-packages"]],
    shouldInvalidate: page === 1,
  });

  const editFacility = useApiMutation({
    mutationFn: upsertFacilityPackage,
    invalidateKeys: [["facility-packages"]],
  });

  const { data, isFetching, error } = useApiQuery({
    fetchQueryName: "facility-package-details",
    fetchQueryFunction: getFacilityPackageDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data,
        facility: data?.facility.uuid,
        pricingType: data?.pricingType?.uuid,
        includedHours: data.includedHours
          ? dayjs(data.includedHours, "HH:mm")
          : null,
      });
      setSelectedData(data);
    }
  }, [data]);

  useEffect(() => {
    if (isAdd) {
      form.setFieldsValue({
        status: {
          uuid: status?.find((item) => item?.code === "active")?.uuid,
        },
      });
    }
  });

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
        facility: { uuid: values.facility },
        pricingType: { uuid: values.pricingType },
        includedHours: values.includedHours
          ? values.includedHours.format("HH:mm:ss")
          : null,
        basePrice: Number(values.basePrice),
        extraPaxPrice: Number(values.extraPaxPrice),
        extraHourPrice: Number(values.extraHourPrice),
      };

      createFacility.mutate(createValues, {
        onSuccess: () => {
          {
            //   title: "Extra Hour Price (MMK)",
            //   dataIndex: "extraHourPri{
            //   title: "Extra Hour Price (MMK)",
            //   dataIndex: "extraHourPrice",
            //   key: "extraHourPrice",
            //   align: "end",
            //   render: (text) => <PriceTag value={text} />,
            // },
            // {
            //   title: "Extra Pax Price (MMK)",
            //   dataIndex: "extraPaxPrice",
            //   key: "extraPaxPrice",
            //   align: "end",
            //   render: (text) => <PriceTag value={text} />,
            // },ce",
            //   key: "extraHourPrice",{
            //   title: "Extra Hour Price (MMK)",
            //   dataIndex: "extraHourPrice",
            //   key: "extraHourPrice",
            //   align: "end",
            //   render: (text) => <PriceTag value={text} />,
            // },
            // {
            //   title: "Extra Pax Price (MMK)",
            //   dataIndex: "extraPaxPrice",
            //   key: "extraPaxPrice",
            //   align: "end",
            //   render: (text) => <PriceTag value={text} />,
            // },
            //   align: "end",
            //   render: (text) => <PriceTag value={text} />,
            // },
            // {
            //   title: "Extra Pax Price (MMK)",
            //   dataIndex: "extraPaxPrice",
            //   key: "extraPaxPrice",
            //   align: "end",
            //   render: (text) => <PriceTag value={text} />,
            // },
            form.resetFields();
            handleClose();
            setDrawerOpen(false);
            setPage(1);
            Toast.success("Package Created Successfully!");
          }
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        facility: { uuid: values.facility },
        pricingType: { uuid: values.pricingType },
        includedHours: values.includedHours
          ? values.includedHours.format("HH:mm:ss")
          : null,
        basePrice: Number(values.basePrice),
        extraPaxPrice: Number(values.extraPaxPrice),
        extraHourPrice: Number(values.extraHourPrice),
        uuid: data?.uuid,
      };

      editFacility.mutate(editValues, {
        onSuccess: () => {
          handleClose();
          setDrawerOpen(false);
          Toast.success("Package Updated Successfully!");
        },
      });
    }
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
                isPending={createFacility.isPending || editFacility.isPending}
                mode={mode}
              />
            )}
          </div>
        }
      >
        {isFetching ? (
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
              label="Facility Name"
              name="facility"
              rules={[{ required: true, message: "Facility Name is Required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? facilityList.find((item) => item.value === value)?.label
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
                  options={facilityList}
                  placeholder="Select Facility"
                />
              )}
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Included Pax"
                name="includedPax"
                rules={[
                  { required: true, message: "Included Pax is Required" },
                ]}
                className="minus-icon"
              >
                <InputNumber
                  className="!w-full"
                  min={0}
                  readOnly={isView}
                  placeholder="Enter Included Pax"
                  {...{
                    mode: "spinner",
                    min: 0,
                    max: 24,
                    style: { width: "100%" },
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Included Hours"
                name="includedHours"
                rules={[
                  { required: true, message: "Included Hours is Required" },
                ]}
                getValueProps={(value) => ({
                  value: isView
                    ? value?.format("HH:mm") || ""
                    : value,
                })}
              >
                {isView ? (
                  <Input readOnly />
                ) : (
                  <TimePicker
                    style={{ width: "100%" }}
                    format="HH:mm"
                  />
                )}
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Pricing Type"
                name="pricingType"
                rules={[
                  { required: true, message: "Pricing Type is Required" },
                ]}
                getValueProps={(value) => ({
                  value: isView
                    ? pricingTypesList.find((item) => item.value === value)
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
                    options={pricingTypesList}
                    placeholder="Select Pricing Type"
                  />
                )}
              </Form.Item>

              <Form.Item
                label="Base Price"
                name="basePrice"
                rules={[{ required: true, message: "Base Price is Required" }]}
                getValueProps={(value) => ({ value: value !== null && value !== undefined ? String(value) : "" })}
              >
                <PriceInput
                  min={0}
                  readOnly={isView}
                  placeholder="Enter Base Price"
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Extra Pax Price"
                name="extraPaxPrice"
                rules={[
                  { required: true, message: "ExtraPax Price is Required" },
                ]}
                getValueProps={(value) => ({ value: value !== null && value !== undefined ? String(value) : "" })}
              >
                <PriceInput
                  min={0}
                  readOnly={isView}
                  placeholder="Enter Extra Pax Price"
                />
              </Form.Item>

              <Form.Item
                label="Extra Hour Price"
                name="extraHourPrice"
                rules={[
                  { required: true, message: "Extra Hour Price is Required" },
                ]}
                getValueProps={(value) => ({ value: value !== null && value !== undefined ? String(value) : "" })}
              >
                <PriceInput
                  min={0}
                  readOnly={isView}
                  placeholder="Enter Extra Hour Price"
                />
              </Form.Item>
            </div>
            <Status isView={isView} statusValue={status} />

            <Form.Item
              label="Remark"
              name="remark"
            >
              <Input.TextArea readOnly={isView} placeholder="Enter Remark" />
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default FacilityPackageForm;
