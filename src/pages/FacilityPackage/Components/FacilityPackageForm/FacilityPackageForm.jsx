import React, { useEffect } from "react";
import { Form, Input, Button, Select, Image, Drawer, AutoComplete } from "antd";
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

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const status = initData?.statuses?.status;
  const pricingType = initData?.statuses?.pricing_type;

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

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "facility-package-details",
    fetchQueryFunction: getFacilityPackageDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data) {
      console.log(data, "data");
      form.setFieldsValue({
        ...data,
        facility: data?.facility.uuid,
        pricingType: data?.pricingType?.uuid,
      });
      setSelectedData(data);
    }
  }, [data]);

  const onFinish = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
        facility: { uuid: values.facility },
        pricingType: { uuid: values.pricingType },
      };

      createFacility.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Facility Package Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        facility: { uuid: values.facility },
        pricingType: { uuid: values.pricingType },
        uuid: data?.uuid,
      };

      editFacility.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Facility Package Updated Successfully!");
        },
      });
    }
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Facility Package Details"
                : mode === "edit"
                  ? "Edit Facility Package"
                  : "Create Facility Package"}
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
                isPending={createFacility.isPending || editFacility.isPending}
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

          <Form.Item
            label="Facility Type"
            name="facility"
            rules={[{ required: true, message: "Facility Type is Required" }]}
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

           <Form.Item
            label="Pricing Type"
            name="pricingType"
            rules={[{ required: true, message: "Pricing Type is Required" }]}
            getValueProps={(value) => ({
              value: isView
                ? pricingTypesList.find((item) => item.value === value)?.label
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
          >
            <Input readOnly={isView} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Included Hours"
              name="includedHours"
              rules={[
                { required: true, message: "Included Hours is Required" },
              ]}
            >
              <Input readOnly={isView} />
            </Form.Item>

            <Form.Item
              label="Included Pax"
              name="includedPax"
              rules={[{ required: true, message: "Included Pax is Required" }]}
            >
              <Input readOnly={isView} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Extra Hour Price"
              name="extraHourPrice"
              rules={[
                { required: true, message: "Extra Hour Price is Required" },
              ]}
            >
              <Input readOnly={isView} />
            </Form.Item>

            <Form.Item
              label="Extra Pax Price"
              name="extraPaxPrice"
              rules={[
                { required: true, message: "ExtraPax Price is Required" },
              ]}
            >
              <Input readOnly={isView} />
            </Form.Item>
          </div>

          <Form.Item
            label="Remark"
            name="remark"
            rules={[{ required: true, message: "Remark is Required" }]}
          >
            <Input readOnly={isView} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default FacilityPackageForm;
