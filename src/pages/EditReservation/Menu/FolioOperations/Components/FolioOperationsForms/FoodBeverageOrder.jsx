// import React, { useState } from "react";
// import {
//   Drawer,
//   Form,
//   Input,
//   DatePicker,
//   InputNumber,
//   Button,
//   Space,
//   Row,
//   Col,
//   TimePicker,
//   Select,
//   Card,
//   Typography,
//   Tag,
//   Radio,
//   Table,
// } from "antd";
// import FormItem from "antd/es/form/FormItem";
// import TextArea from "antd/es/input/TextArea";
// import FormButtons from "../../../../../../component/FormButtons/FormButtons";
// import { DeleteOutlined } from "@ant-design/icons";
// const { Text } = Typography;
// const menuAddons = {
//   burger: [
//     { label: "Egg", price: 1000 },
//     { label: "Chicken", price: 1500 },
//     { label: "Pork", price: 1500 },
//     { label: "Seafood", price: 2500 },
//   ],
//   pizza: [
//     { label: "Bubble", price: 1500 },
//     { label: "Jelly", price: 1500 },
//   ],
// };

// const FoodBeverageOrder = ({ open, onClose, reservationId }) => {
//   const [form] = Form.useForm();
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [orders, setOrders] = useState([{ id: 1 }]);

//   const handleSubmit = (values) => {
//     console.log("Searching with:", values);
//   };

//   const addMenu = () => {
//     const newId = orders.length + 1;
//     setOrders([...orders, { id: newId }]);
//   };

// const sharedProps = {
//   mode: "spinner",
//   min: 1,
//   max: 10,
//   defaultValue: 1,
//   style: { width: "100%" },
// };
//   const deleteOrder = (id, index) => {
//     const newOrders = orders.filter((order) => order.id !== id);
//     setOrders(newOrders);

//     const currentItems = form.getFieldValue("items") || [];
//     const newItems = [...currentItems];
//     newItems.splice(index, 1);

//     form.setFieldsValue({ items: newItems });
//   };

//   return (
//     <Drawer
//       open={open}
//       onClose={onClose}
//       size={550}
//       destroyOnClose
//       title={
//         <div className="flex justify-between items-center">
//           <span>Food Beverage Order</span>
//           <Button type="primary">Create</Button>
//         </div>
//       }
//     >
//       <Card title="Order Info" className="shadow rounded">
//         <Form layout="vertical" form={form} onFinish={handleSubmit}>
// <div className="grid grid-cols-2 gap-4">
//   <Form.Item label="Order Date" name="OrderDate">
//     <DatePicker className="w-full" />
//   </Form.Item>
//   <Form.Item label="Order Time" name="orderTime">
//     <TimePicker className="w-full" format="h:mm A" />
//   </Form.Item>
// </div>

// <div className="grid grid-cols-2 gap-4">
//   <Form.Item label="Room" name="room">
//     <Select
//       placeholder="Select Room"
//       style={{ width: "100%" }}
//       options={[
//         { value: "aa", label: "aa" },
//         { value: "bb", label: "bb" },
//       ]}
//     />
//   </Form.Item>

//   <Form.Item label="Order Type" name="orderType">
//     <Select
//       placeholder="Select Order Type"
//       style={{ width: "100%" }}
//       options={[
//         { value: "aa", label: "aa" },
//         { value: "bb", label: "bb" },
//       ]}
//     />
//   </Form.Item>
// </div>

// <Form.Item label="Order Status" name="orderStatus">
//   <Select
//     placeholder="Select Order Status"
//     style={{ width: "100%" }}
//     options={[
//       { value: "Active", label: "Active" },
//       { value: "Inactive", label: "Inactive" },
//     ]}
//   />
// </Form.Item>
//         </Form>
//       </Card>

//       <Form form={form} layout="vertical">
//         {orders.map((order, index) => (
//           <Card
//             key={order.id}
//             title={`Order ${index + 1}`}
//             className="shadow rounded mb-4"
//             size="small"
//             extra={
//               orders.length > 1 && (
//                 <Button
//                   type="text"
//                   danger
//                   icon={<DeleteOutlined />}
//                   onClick={() => deleteOrder(order.id, index)}
//                 />
//               )
//             }
//           >
//             <div className="grid grid-cols-3 gap-3">
//               <Form.Item label="Menu" name={["items", index, "menu"]}>
//                 <Select
//                   options={[
//                     { value: "pizza", label: "Pizza" },
//                     { value: "burger", label: "Burger" },
//                   ]}
//                 />
//               </Form.Item>
// <Form.Item
//   label="Quantity"
//   name={["items", index, "quantity"]}
//   initialValue={1}
// >
//   <InputNumber {...sharedProps} />
// </Form.Item>
// <Form.Item
//   label="Price Per Qty"
//   name={["items", index, "pricePerQty"]}
// >
//   <InputNumber className="!w-full" min={0} suffix="MMK" />
// </Form.Item>
//             </div>
//           </Card>
//         ))}
//       </Form>

//       <div className=" mt-3 ">
//         <Button className="custom-blue-btn" onClick={addMenu}>
//           Add Menu
//         </Button>
//       </div>
//     </Drawer>
//   );
// };

// export default FoodBeverageOrder;
import React, { useState } from "react";
import {
  Drawer,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Space,
  Row,
  Col,
  TimePicker,
  Select,
  Card,
  Typography,
  Tag,
  Checkbox,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

const menuAddons = {
  fried_rice: [
    { label: "Egg", price: 1000 },
    { label: "Chicken", price: 1500 },
    { label: "Pork", price: 1500 },
    { label: "Seafood", price: 2500 },
  ],
  thai_milk_tea: [
    { label: "Bubble", price: 1500 },
    { label: "Jelly", price: 1500 },
  ],
  burger: [
    { label: "Extra Cheese", price: 500 },
    { label: "Bacon", price: 2000 },
    { label: "Fried Egg", price: 1000 },
  ],
};

const FoodBeverageOrder = ({ open, onClose, reservationId }) => {
  const [form] = Form.useForm();
  const [orders, setOrders] = useState([{ id: Date.now() }]);

  const itemsValue = Form.useWatch("items", form);

  const handleSubmit = (values) => {
    console.log("Form Values:", values);
  };

  const addMenu = () => {
    setOrders([...orders, { id: Date.now() }]);
  };

  const deleteOrder = (id, index) => {
    const newOrders = orders.filter((order) => order.id !== id);
    setOrders(newOrders);

    const currentItems = form.getFieldValue("items") || [];
    const newItems = currentItems.filter((_, i) => i !== index);
    form.setFieldsValue({ items: newItems });
  };

  const sharedProps = {
    mode: "spinner",
    min: 1,
    max: 10,
    defaultValue: 1,
    style: { width: "100%" },
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={550}
      destroyOnClose
      title={
        <div className="flex justify-between items-center">
          <span>Food Beverage Order</span>
          <Button type="primary" onClick={() => form.submit()}>
            Create
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Card size="small" title="Order Info" className="shadow-sm rounded">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Order Date"
              name="OrderDate"
              rules={[{ required: true }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              label="Order Time"
              name="orderTime"
              rules={[{ required: true }]}
            >
              <TimePicker className="w-full" format="h:mm A" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Room" name="room" rules={[{ required: true }]}>
              <Select
                placeholder="Select Room"
                style={{ width: "100%" }}
                options={[
                  { value: "aa", label: "aa" },
                  { value: "bb", label: "bb" },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Order Type"
              name="orderType"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Order Type"
                style={{ width: "100%" }}
                options={[
                  { value: "aa", label: "aa" },
                  { value: "bb", label: "bb" },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Order Status"
            name="orderStatus"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select Order Status"
              style={{ width: "100%" }}
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
            />
          </Form.Item>
        </Card>
        <Space direction="vertical" size="large" className="w-full">
          {orders.map((order, index) => {
            // selected menu for card
            const selectedMenuKey = itemsValue?.[index]?.menu;
            const availableAddons = menuAddons[selectedMenuKey] || [];

            return (
              <Card
                key={order.id}
                title={`Order ${index + 1}`}
                className="shadow-sm rounded mb-4 border-l-4 border-blue-500"
                size="small"
                extra={
                  orders.length > 1 && (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => deleteOrder(order.id, index)}
                    />
                  )
                }
              >
                <div className="grid grid-cols-3 gap-3">
                  <Form.Item label="Menu" name={["items", index, "menu"]}>
                    <Select
                      options={[
                        { value: "fried_rice", label: "Fried Rice" },
                        { value: "thai_milk_tea", label: "Thai Milk Tea" },
                        { value: "burger", label: "Burger" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Quantity"
                    name={["items", index, "quantity"]}
                    initialValue={1}
                  >
                    <InputNumber {...sharedProps} />
                  </Form.Item>
                  <Form.Item
                    label="Price Per Qty"
                    name={["items", index, "pricePerQty"]}
                  >
                    <InputNumber className="!w-full" min={0} suffix="MMK" />
                  </Form.Item>
                </div>

                {/* Add on List */}
                {availableAddons.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Text strong>Add on Menu</Text>
                      <Tag color="default" className="mr-0">
                        Optional
                      </Tag>
                    </div>

                    {/*  selected add on labels */}
                    <Form.Item
                      name={["items", index, "addons"]}
                      className="mb-0"
                    >
                      <Checkbox.Group className="w-full">
                        <div className="space-y-2">
                          {availableAddons.map((addon) => (
                            <div
                              key={addon.label}
                              className="grid grid-cols-3 gap-3 items-center py-2 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                            >
                              {/*  Select Box + Name */}
                              <div className="flex items-center">
                                <Checkbox value={addon.label}>
                                  <span className="ml-2 text-sm">
                                    {addon.label}
                                  </span>
                                </Checkbox>
                              </div>

                              {/*  Quantity */}
                              <div className="text-center">
                                <InputNumber {...sharedProps} />
                              </div>

                              {/* Price  */}
                              <div className=" border border-gray-300 p-1 rounded ">
                                <Text className="text-sm font-medium">
                                  {addon.price.toLocaleString()}{" "}
                                  <span className="ml-15">MMK</span>
                                </Text>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Checkbox.Group>
                    </Form.Item>
                  </div>
                )}
              </Card>
            );
          })}
        </Space>

        <div className=" mt-3 ">
          <Button className="custom-blue-btn" onClick={addMenu}>
            Add Menu
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default FoodBeverageOrder;
