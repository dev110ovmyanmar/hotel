import React, { useEffect } from "react";
import { Form, Input, Button, Select, Drawer } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import { getFacilityDetails } from "../../../../api/facilityApi";

const FacilityListPackageForm = ({
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

  useEffect(() => {
    if (selectedData) {
      form.setFieldsValue({
        ...selectedData,
      });
    }
  }, [selectedData]);

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>Facility Package Details</span>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          style={{ width: "100%" }}
        //  onFinish={onFinish}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is Required" }]}
          >
            <Input readOnly={isView} />
          </Form.Item>

          {/* <Form.Item
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
                 </Form.Item> */}

          {/* <Form.Item
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
                 </Form.Item> */}

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
            <Input.TextArea readOnly={isView} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default FacilityListPackageForm;
