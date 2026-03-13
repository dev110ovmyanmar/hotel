// import React, { useEffect } from "react";
// import { Button, Form, Input, Drawer, Select, InputNumber, Switch } from "antd";
// import Loader from "../../../component/Loader/Loader";
// import FormButtons from "../../../component/FormButtons/FormButtons";

// const InventoryForm = ({
//   initialValues,
//   mode,
//   onSubmit,
//   open,
//   onClose,
//   loading, 
//   switchToEdit,
//   categoryOptions, // Renamed/Added for context
//   unitOptions,
//   submitting      // Added for context
// }) => {
//   const [form] = Form.useForm();
//   const isView = mode === "view";

//   useEffect(() => {
//     if (open) {
//       if (initialValues) {
//         form.setFieldsValue({
//           name: initialValues.name,
//           reorderLevel: initialValues.reorderLevel,
//           unitCost: initialValues.unitCost,
//           unitPrice: initialValues.unitPrice,// Handle both unitCost and unitPrice
//           stockQuantity: initialValues.stockQuantity,
//           laundryStatus: initialValues.laundryStatus ?? false,
//           isFree: initialValues.isFree ?? false,
//           // Extract UUIDs from nested response objects
//           categoryUuid: initialValues.category?.uuid || initialValues.categoryUuid,
//           unitUuid: initialValues.unit?.uuid || initialValues.unitUuid,
//         });
//       } else {
//         form.resetFields();
//       }
//     }
//   }, [initialValues, open, form]);

//   return (
//     <Drawer
//       title={
//         <div className="flex items-center justify-between w-full">
//           <span>{mode === "view" ? "View Item" : mode === "edit" ? "Edit Item" : "Add Item"}</span>
//           {isView ? (
//             <Button type="primary" onClick={switchToEdit}>Edit</Button>
//           ) : (
//             <FormButtons onClick={() => form.submit()} mode={mode} loading={submitting} />
//           )}
//         </div>
//       }
//       size={500}
//       onClose={onClose}
//       open={open}
//       destroyOnClose
//     >
//       {loading ? <Loader /> : (
//         <Form form={form} layout="vertical" onFinish={onSubmit}>
//           <Form.Item
//             label="Item Name"
//             name="name"
//             rules={[{ required: true, message: "Please input item name!" }]}
//           >
//             <Input placeholder="e.g. Shampoo" />
//           </Form.Item>

//           {/* Use one single grid container for everything to ensure identical margins */}
//           <div className="grid grid-cols-4 gap-x-5 gap-y-0">

//             {/* ROW 1: 4 items spanning 1 column each */}
//             <Form.Item label={<span className="text-xs">Unit Price</span>} name="unitPrice" rules={[{ required: true }]}>
//               <InputNumber className="!w-full"  min={0} precision={2} readOnly={isView} />
//             </Form.Item>

//             <Form.Item label={<span className="text-xs">Unit Cost</span>} name="unitCost" rules={[{ required: true }]}>
//               <InputNumber className="!w-full" min={0} precision={2} readOnly={isView} />
//             </Form.Item>

//             <Form.Item label={<span className="text-xs">Stock Qty</span>} name="stockQuantity" rules={[{ required: true }]}>
//               <InputNumber className="!w-full" min={0} readOnly={isView} />
//             </Form.Item>

//             <Form.Item label={<span className="text-xs">Reorder</span>} name="reorderLevel" rules={[{ required: true }]}>
//               <InputNumber className="!w-full" min={0} readOnly={isView} />
//             </Form.Item>

//             {/* ROW 2: 2 items spanning 2 columns each */}
//             <Form.Item label="Category" name="categoryUuid" rules={[{ required: true }]} className="col-span-2">
//               <Select options={categoryOptions} placeholder="Select Category" disabled={isView} className="w-full" />
//             </Form.Item>

//             <Form.Item label="Unit" name="unitUuid" rules={[{ required: true }]} className="col-span-2">
//               <Select options={unitOptions} placeholder="Select Unit" disabled={isView} className="w-full" />
//             </Form.Item>

//           </div>

//           <div className="flex gap-10 borderp-4 rounded-lg">
//             {/* <Form.Item label="Laundry Status" name="laundryStatus" valuePropName="checked" rules={[{ required: true }]}>
//               <Switch />
//             </Form.Item> */}

//             <Form.Item
//               label="Laundry Status"
//               name="laundryStatus"
//               valuePropName="checked"
//               rules={[
//                 {
//                   // Standard required check
//                   required: true,
//                   message: "You must acknowledge the Laundry Status!"
//                 }
//               ]}
//             >
//               <Switch
//                 checkedChildren="Yes"
//                 unCheckedChildren="No"
//                 disabled={isView} // Apply our read-only logic here
//               />
//             </Form.Item>
//             {/* 
//             <Form.Item label="Free Item" name="isFree" valuePropName="checked" rules={[{ required: true }]}>
//               <Switch />
//             </Form.Item> */}

//             <Form.Item
//               label="Free Item"
//               name="isFree"
//               valuePropName="checked"
//               rules={[
//                 {
//                   // Standard required check
//                   required: true,
//                   message: "You must acknowledge the Free Status!"
//                 }
//               ]}
//             >
//               <Switch
//                 checkedChildren="Yes"
//                 unCheckedChildren="No"
//                 disabled={isView} // Apply our read-only logic here
//               />
//             </Form.Item>
//           </div>
//         </Form>
//       )}
//     </Drawer>
//   );
// };

// export default InventoryForm;


import React, { useEffect } from "react";
import { Button, Form, Input, Drawer, Select, InputNumber, Switch } from "antd";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";

const InventoryForm = ({
  initialValues,
  mode,
  onSubmit,
  open,
  onClose,
  loading,
  switchToEdit,
  categoryOptions,
  unitOptions,
  submitting
}) => {
  const [form] = Form.useForm();
  const isView = mode === "view";

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          name: initialValues.name,
          reorderLevel: initialValues.reorderLevel,
          unitCost: initialValues.unitCost,
          unitPrice: initialValues.unitPrice,
          stockQuantity: initialValues.stockQuantity,
          laundryStatus: initialValues.laundryStatus ?? false,
          isFree: initialValues.isFree ?? false,
          categoryUuid:
            initialValues.category?.uuid || initialValues.categoryUuid,
          unitUuid: initialValues.unit?.uuid || initialValues.unitUuid,
        });
      } else {
        form.resetFields();
      }
    }
  }, [initialValues, open]);

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between w-full">
          <span>
            {mode === "view"
              ? "View Item"
              : mode === "edit"
              ? "Edit Item"
              : "Add Item"}
          </span>

          {isView ? (
            <Button type="primary" onClick={switchToEdit}>
              Edit
            </Button>
          ) : (
            <FormButtons
              onClick={() => form.submit()}
              mode={mode}
              isPending={submitting}
            />
          )}
        </div>
      }
      size={500}
      onClose={onClose}
      open={open}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Form.Item
              label="Item Name"
              name="name"
              rules={[{ required: true, message: "Please input item name!" }]}
            >
              <Input placeholder="e.g. Shampoo" readOnly={isView} />
            </Form.Item>

            <div className="grid grid-cols-4 gap-x-5 gap-y-0">
              <Form.Item
                label={<span className="text-xs">Unit Price</span>}
                name="unitPrice"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className="!w-full"
                  min={0}
                  precision={2}
                  readOnly={isView}
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs">Unit Cost</span>}
                name="unitCost"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className="!w-full"
                  min={0}
                  precision={2}
                  readOnly={isView}
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs">Stock Qty</span>}
                name="stockQuantity"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className="!w-full"
                  min={0}
                  readOnly={isView}
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs">Reorder</span>}
                name="reorderLevel"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className="!w-full"
                  min={0}
                  readOnly={isView}
                />
              </Form.Item>

              <Form.Item
                label="Category"
                name="categoryUuid"
                rules={[{ required: true }]}
                className="col-span-2"
              >
                <Select
                  options={categoryOptions}
                  placeholder="Select Category"
                  disabled={isView}
                  className="w-full"
                />
              </Form.Item>

              <Form.Item
                label="Unit"
                name="unitUuid"
                rules={[{ required: true }]}
                className="col-span-2"
              >
                <Select
                  options={unitOptions}
                  placeholder="Select Unit"
                  disabled={isView}
                  className="w-full"
                />
              </Form.Item>
            </div>

            <div className="flex gap-10 borderp-4 rounded-lg">
              <Form.Item
                label="Laundry Status"
                name="laundryStatus"
                valuePropName="checked"
                rules={[
                  {
                    required: true,
                    message: "You must acknowledge the Laundry Status!",
                  },
                ]}
              >
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  disabled={isView}
                />
              </Form.Item>

              <Form.Item
                label="Free Item"
                name="isFree"
                valuePropName="checked"
                rules={[
                  {
                    required: true,
                    message: "You must acknowledge the Free Status!",
                  },
                ]}
              >
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  disabled={isView}
                />
              </Form.Item>
            </div>
          </>
        )}
      </Form>
    </Drawer>
  );
};

export default InventoryForm;