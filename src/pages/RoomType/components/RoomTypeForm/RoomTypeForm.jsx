import React, { useEffect } from "react";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import Toast from "../../../../component/Toast/Toast";
import useApiQuery from "../../../../hooks/useApiQuery";
import { RoomTypeDetail, upsertRoomType } from "../../../../api/roomApi";

const RoomTypeForm = ({ initialValues, mode, onSuccess }) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { data } = useApiQuery({
    fetchQueryName: "roomTypeDetails",
    fetchQueryFunction: RoomTypeDetail,
    params: { uuid: initialValues?.uuid },
    options: {
      enabled: (isEdit || isView) && !!initialValues?.uuid,
    },
  });

  const { mutate, isPending } = useApiMutation({
    mutationFn: upsertRoomType,
    options: {
      onSuccess: () => {
        Toast.success(
          isEdit ? "Updated successfully!" : "Created successfully!",
        );

        form.resetFields();
        onSuccess?.();
      },
      onError: (error) => {
        Toast.error("failed!");
      },
    },
  });

  // const handleSubmit = (values) => {
  //   mutate({
  //     ...values,
  //     ...(isEdit &&
  //       initialValues?.uuid && {
  //         uuid: initialValues?.uuid,
  //       }),
  //   });
  // };
  const handleSubmit = (values) => {
    console.log(values,"code")
    mutate({
      ...values,
      uuid: isEdit ? initialValues?.uuid : undefined,
      name: values.name,
      code: values.code,
      description: values.description,
      maxAdults: values.maxAdults,
      maxChildren: values.maxChildren,
      maxOccupancy: values.maxOccupancy,
      basePrice: values.basePrice,
      areaSize: values.areaSize,
      totalRooms: values.totalRooms,
    });
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  const handleCancel = () => {
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      style={{ width: "100%" }}
      disabled={isView}
      onFinish={handleSubmit}
      
    >
      <h1 className="form-subtitle">Room</h1>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="RoomType name"
            name="name"
            placeholder="e.g. Deluxe Bungalow Double"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Short Name" name="code" placeholder="e.g. DBD" >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label="Short Description"
        name="description"
        placeholder="Enter a brief description
"
      >
        <Input />
      </Form.Item>
      <h1 className="form-subtitle">Guest</h1>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Maximum Adults" name="maxAdults">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Maximum Children" name="maxChildren">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Maximum Occupancy" name="maxOccupancy">
        <Input />
      </Form.Item>

      <h1 className="form-subtitle">Title</h1>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Base Price" name="basePrice">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Square Feet" name="areaSize">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Total Rooms" name="totalRooms">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Position" name="position">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Bed Types">
        <Select
          placeholder="Select bed type"
          options={[
            { value: "1", label: "Bed Types 1" },
            { value: "2", label: "Bed Types 2" },
            { value: "3", label: "Bed Types 3" },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        placeholder="Enter full room description"
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <div className="flex justify-between gap-4">
          <Button type="default" onClick={handleCancel} block>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" block loading={isPending}>
            save
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default RoomTypeForm;
// import React, { useEffect } from "react";
// import { Button, Col, Form, Input, Row, Select } from "antd";
// import { useApiMutation } from "../../../../hooks/useApiMutation";
// import useApiQuery from "../../../../hooks/useApiQuery";
// import Toast from "../../../../component/Toast/Toast";
// import { RoomTypeDetail, upsertRoomType } from "../../../../api/roomApi";

// const RoomTypeForm = ({ initialValues, mode, onSuccess }) => {
//   const [form] = Form.useForm();
//   const isView = mode === "view";
//   const isEdit = mode === "edit";

//   const { data } = useApiQuery({
//     fetchQueryName: "roomTypeDetails",
//     fetchQueryFunction: RoomTypeDetail,
//     params: { uuid: initialValues?.uuid },
//     options: { enabled: isEdit && !!initialValues?.uuid },
//   });

//   const { mutate, isPending } = useApiMutation({
//     mutationFn: upsertRoomType,
//     options: {
//       onSuccess: () => {
//         Toast.success(isEdit ? "Updated successfully!" : "Created successfully!");
//         form.resetFields();
//         onSuccess?.();
//       },
//       onError: (error) => {
//         console.error(error);
//         Toast.error("Operation failed!");
//       },
//     },
//   });

//   useEffect(() => {
//     if (data) form.setFieldsValue(data);
//   }, [data, form]);

//   const handleSubmit = (values) => {
//     mutate({
//       uuid: isEdit ? initialValues?.uuid : undefined,
//       name: values.roomTypeName,
//       description: values.description,
//       maxAdults: values.maximumAdults,
//       maxChildren: values.maximumChildren,
//       basePrice: values.basePrice,
//       areaSize: values.squareFeet,
//       totalRooms: values.totalRooms,
//     });
//   };

//   const handleCancel = () => form.resetFields();

//   return (
//     <Form form={form} layout="vertical" disabled={isView} onFinish={handleSubmit}>
//       <Row gutter={16}>
//         <Col span={12}>
//           <Form.Item label="Room Type Name" name="roomTypeName" rules={[{ required: true }]}>
//             <Input placeholder="Deluxe Bungalow Double" />
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item label="Short Name" name="shortName">
//             <Input placeholder="DBD" />
//           </Form.Item>
//         </Col>
//       </Row>

//       <Form.Item label="Short Description" name="description">
//         <Input.TextArea placeholder="Enter short description" />
//       </Form.Item>

//       <Row gutter={16}>
//         <Col span={12}>
//           <Form.Item label="Maximum Adults" name="maximumAdults">
//             <Input />
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item label="Maximum Children" name="maximumChildren">
//             <Input />
//           </Form.Item>
//         </Col>
//       </Row>

//       <Row gutter={16}>
//         <Col span={12}>
//           <Form.Item label="Base Price" name="basePrice">
//             <Input />
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item label="Square Feet" name="squareFeet">
//             <Input />
//           </Form.Item>
//         </Col>
//       </Row>

//       <Form.Item label="Total Rooms" name="totalRooms">
//         <Input />
//       </Form.Item>

//       <Form.Item>
//         <div className="flex justify-between gap-4">
//           <Button onClick={handleCancel} block>Cancel</Button>
//           <Button type="primary" htmlType="submit" block loading={isPending}>Save</Button>
//         </div>
//       </Form.Item>
//     </Form>
//   );
// };

// export default RoomTypeForm;
