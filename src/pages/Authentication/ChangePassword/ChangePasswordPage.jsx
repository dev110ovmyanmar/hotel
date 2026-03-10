// import React from "react";
// import { Form, Input, Button} from "antd";
// import { useNavigate } from "react-router-dom";
// import { changePassword } from "../../../api/authApi";
// import { useApiMutation } from "../../../hooks/useApiMutation";
// import Toast from "../../../component/Toast/Toast";

// const ChangePasswordPage = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const { mutate, isPending } = useApiMutation({
//     mutationFn: changePassword,
//     options: {
//       onSuccess: () => Toast.success("Password changed successfully!"),
//       onError: (err) => Toast.error(err.message || "Failed!"),
//     },
//   });

//   const handleLogin = (values) => {
//     mutate({
//       currentPassword: values.currentPassword,
//       newPassword: values.newPassword,
//       confirmPassword: values.confirmPassword,
//     });
//   };
  
//   const handleCancel = () => {
//     form.resetFields();
//   };

//   return (
//     <div className="min-h-screen flex justify-center bg-gray-100">
//       <div className=" rounded-lg  w-full max-w-md">
//         <h2 className="text-2xl font-semibold mb-6 text-center">
//           Change Password
//         </h2>
//         <Form layout="vertical" onFinish={handleLogin}>
//           <Form.Item
//             label="Current Password"
//             name="currentPassword"
//             rules={[
//               {
//                 required: true,
//                 message: "Please input your current password!",
//               },
//             ]}
//           >
//             <Input.Password placeholder="Enter current password" />
//           </Form.Item>

//           <Form.Item
//             label="New Password"
//             name="newPassword"
//             rules={[
//               { required: true, message: "Please input your new password!" },
//               { min: 6, message: "Password must be at least 6 characters!" },
//             ]}
//           >
//             <Input.Password placeholder="Enter new password" />
//           </Form.Item>

//           <Form.Item
//             label="Confirm Password"
//             name="confirmPassword"
//             dependencies={["newPassword"]}
//             rules={[
//               { required: true, message: "Please confirm your new password!" },
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   if (!value || getFieldValue("newPassword") === value) {
//                     return Promise.resolve();
//                   }
//                   return Promise.reject(new Error("Passwords do not match!"));
//                 },
//               }),
//             ]}
//           >
//             <Input.Password placeholder="Confirm new password" />
//           </Form.Item>

//           <Form.Item>
//             <div className="flex justify-between gap-4">
//               <Button type="default" onClick={handleCancel} block>
//                 Cancel
//               </Button>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 block
//                 loading={isPending}
//               >
//                 Change Password
//               </Button>
//             </div>
//           </Form.Item>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default ChangePasswordPage;
import React from "react";
import { Form, Input, Button } from "antd";
import { changePassword } from "../../../api/authApi";
import { useApiMutation } from "../../../hooks/useApiMutation";
import Toast from "../../../component/Toast/Toast";

const ChangePasswordPage = ({ onClose }) => {
  const [form] = Form.useForm();

  const { mutate, isPending } = useApiMutation({
    mutationFn: changePassword,
    options: {
      onSuccess: () => {
        Toast.success("Password changed successfully!");
        form.resetFields();
        onClose?.();
      },
      onError: (error) =>  Toast.error(error.response?.data?.message),
    },
  });

  const handleSubmit = (values) => {
    mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose?.();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        label="Current Password"
        name="currentPassword"
        rules={[{ required: true, message: "Please input your current password!" }]}
      >
        <Input.Password placeholder="Enter current password" />
      </Form.Item>

      <Form.Item
        label="New Password"
        name="newPassword"
        rules={[
          { required: true, message: "Please input your new password!" },
          { min: 6, message: "Password must be at least 6 characters!" },
        ]}
      >
        <Input.Password placeholder="Enter new password" />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        dependencies={["newPassword"]}
        rules={[
          { required: true, message: "Please confirm your new password!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Passwords do not match!"));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirm new password" />
      </Form.Item>

      <div className="flex gap-3">
        <Button onClick={handleCancel} block>
          Cancel
        </Button>

        <Button type="primary" htmlType="submit" loading={isPending} block>
          Change Password
        </Button>
      </div>
    </Form>
  );
};

export default ChangePasswordPage;