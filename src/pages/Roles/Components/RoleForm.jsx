// import React, { useEffect, useState } from "react";
// import { Button, Form, Input, Divider, Spin, message, Drawer } from "antd";
// import Loader from "../../../component/Loader/Loader";
// import PermissionAssignDrawer from "./PermissionAssignDrawer";
// import { fetchRoleDetail } from "../../../api/roleApi";
// import useApiQuery from "../../../hooks/useApiQuery";
// import Toast from "../../../component/Toast/Toast";

// const { TextArea } = Input;

// const RoleForm = ({
//   mode,
//   selectedData,
//   setDrawerOpen,
//   updateRoleFunction,
//   updatePermissionFunction, // ✅ New separate prop for permission update
//   createRoleFunction,
//   switchToEdit,
//   DrawerTitle,
//   open,
//   onClose
// }) => {
//   const [form] = Form.useForm();
//   const [permDrawerOpen, setPermDrawerOpen] = useState(false);
//   const [currentPermissions, setCurrentPermissions] = useState([]);

//   const isView = mode === "view";
//   const isAdd = mode === "add";

//   const { data: roleDetail, refetch, isLoading } = useApiQuery({
//     fetchQueryName: "roleDetail",
//     fetchQueryFunction: fetchRoleDetail,
//     params: { uuid: selectedData?.uuid },
//     options: { enabled: !!selectedData?.uuid },
//   });

//   useEffect(() => {
//     if (isAdd) {
//       form.resetFields();
//       setCurrentPermissions([]);
//     } else if (roleDetail) {
//       form.setFieldsValue({
//         name: roleDetail.name,
//         code: roleDetail.code,
//         description: roleDetail.description || "",
//       });

//       const initialSelectedIds = [];
//       roleDetail.permissions?.forEach((group) => {
//         group.permissions?.forEach((p) => {
//           if (p.selected) initialSelectedIds.push(String(p.id));
//         });
//       });
//       setCurrentPermissions(initialSelectedIds);
//     }
//   }, [roleDetail, form, isAdd]);

//   // ✅ Handles ONLY name / code / description
//   const onFinish = (values) => {
//     if (isAdd) {
//       const createPayload = {
//         name: values.name,
//         code: values.code,
//         description: values.description,
//         // permissionIds: currentPermissions.map((id) => String(id)),
//         // permissionId: currentPermissions.map((id) => Number(id)),
//         permissionId: currentPermissions.map((id) => parseInt(id, 10)),
//       };
//       // console.log("Create payload", createPayload);

//       createRoleFunction.mutate(createPayload, {
//         onSuccess: (res) => {
//           if (res?.reasonCode === "200" || res?.status === "success") {
//             Toast.success("Role created successfully");
//             // refetch();
//             setDrawerOpen(false);
//           } else {
//             Toast.error(res?.error?.text || "Creation failed");
//           }
//         },
//         onError: () => Toast.error("Error occurred while creating role"),
//       });
//     } else {
//       // ✅ Edit mode: only update role info (no permissions here)
//       const updatePayload = {
//         uuid: selectedData?.uuid,
//         name: values.name,
//         code: values.code,
//         description: values.description,
//       };

//       // console.log("📤 Sending Role Info Update:", updatePayload);

//       updateRoleFunction.mutate(updatePayload, {
//         onSuccess: (res) => {
//           if (res?.reasonCode === "200") {
//             Toast.success("Role info updated successfully");
//             refetch();
//             setDrawerOpen(false);
//           } else {
//             Toast.error(res?.error?.text || "Update failed");
//           }
//         },
//         onError: () => Toast.error("An error occurred during update"),
//       });
//     }
//   };

//   // ✅ Handles ONLY permission changes — called from PermissionAssignDrawer onSave
//   const handlePermissionSave = (newIds) => {
//     const newIdsAsString = newIds.map(String);
//     setCurrentPermissions(newIdsAsString);
//     setPermDrawerOpen(false);

//     // Compute delta (only changed permissions)
//     // const changedPermissions = [];
//     // roleDetail?.permissions?.forEach((group) => {
//     //   group.permissions?.forEach((p) => {
//     //     const wasSelected = p.selected;
//     //     const isNowSelected = newIdsAsString.includes(String(p.id));
//     //     if (wasSelected !== isNowSelected) {
//     //       changedPermissions.push(p.id);
//     //     }
//     //   });
//     // });

//     // if (changedPermissions.length === 0) {
//     //   Toast.info("No permission changes detected");
//     //   return;
//     // }

//     const permPayload = {
//       uuid: selectedData?.uuid,
//       name: roleDetail.name,
//       code: roleDetail.code,
//       description: roleDetail.description || "",
//       // permissions: changedPermissions,
//       permissions: newIds, //This the array of currently checked IDs
//     };

//     console.log("📤 Sending Permission Delta Update:", permPayload);

//     updatePermissionFunction.mutate(permPayload, {
//       onSuccess: (res) => {
//         if (res?.reasonCode === "200") {
//           Toast.success("Permissions updated successfully");
//           refetch();
//         } else {
//           Toast.error(res?.error?.text || "Permission update failed");
//         }
//       },
//       onError: () =>
//         Toast.error("An error occurred while updating permissions"),
//     });
//   };

//   return (
//     <>
//       {isLoading ? (
//         <div className="flex justify-center items-center h-screen">
//           <Loader />
//         </div>
//       ) : (
//         <Drawer
//           title={
//             <div className="flex items-center justify-between">
//               <span>{DrawerTitle}</span>
//               {isView && (
//                 <Button type="primary" onClick={switchToEdit}>
//                   Edit
//                 </Button>
//               )}
//             </div>
//           }
//           size={500}
//           onClose={onClose}
//           open={open}
//         >
//           <Form form={form} layout="vertical" onFinish={onFinish}>
//             {/* ── Role Info Fields ── */}
//             <Form.Item label="Name" name="name" rules={[{ required: true }]}>
//               <Input readOnly={isView} placeholder="IT Support" />
//             </Form.Item>
//             <Form.Item label="Code" name="code" rules={[{ required: true }]}>
//               <Input readOnly={isView} placeholder="it_support" />
//             </Form.Item>
//             <Form.Item label="Description" name="description">
//               <TextArea rows={3} readOnly={isView} placeholder="Enter the description for related role" />
//             </Form.Item>

//             {/* ── Role Info Action Buttons ── */}
//             {!isView && (
//               <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
//                 <Button
//                   onClick={() => setDrawerOpen(false)}
//                   style={{ flex: 1 }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   style={{ flex: 1 }}
//                   loading={
//                     isAdd
//                       ? createRoleFunction.isPending
//                       : updateRoleFunction.isPending
//                   }
//                 >
//                   {isAdd ? "Create Role" : "Update Info"}
//                 </Button>
//               </div>
//             )}

//             {/* ── Permissions Section (edit / view only, not add) ── */}
//             {!isAdd && (
//               <>
//                 <Divider />
//                 <div
//                   style={{
//                     background: "#f5f5f5",
//                     padding: "15px",
//                     borderRadius: "8px",
//                     marginBottom: "20px",
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                   }}
//                 >
//                   <span>
//                     Permissions Selected:{" "}
//                     <b>{currentPermissions.length}</b>
//                   </span>

//                   {!isView && (
//                     <Button
//                       type="primary"
//                       loading={updatePermissionFunction?.isPending}
//                       onClick={() => setPermDrawerOpen(true)}
//                     >
//                       Manage Permissions
//                     </Button>
//                   )}
//                 </div>
//               </>
//             )}

//             {/* ── Permission Assign Drawer ── */}
//             <PermissionAssignDrawer
//               open={permDrawerOpen}
//               onClose={() => setPermDrawerOpen(false)}
//               rolePermissions={roleDetail?.permissions || []}
//               selectedPermissions={currentPermissions}
//               onSave={handlePermissionSave} // ✅ triggers its own API call
//             />
//           </Form>
//         </Drawer>

//       )}
//     </>
//   );
// };

// export default RoleForm;

import React, { useEffect, useState } from "react";
import { Button, Form, Input, Divider, Spin, message, Drawer } from "antd";
import Loader from "../../../component/Loader/Loader";
import PermissionAssignDrawer from "./PermissionAssignDrawer";
import { fetchRoleDetail } from "../../../api/roleApi";
import useApiQuery from "../../../hooks/useApiQuery";
import Toast from "../../../component/Toast/Toast";
import FormButtons from "../../../component/FormButtons/FormButtons";

const { TextArea } = Input;

const RoleForm = ({
  mode,
  selectedData,
  setDrawerOpen,
  updateRoleFunction,
  updatePermissionFunction, // ✅ New separate prop for permission update
  createRoleFunction,
  switchToEdit,
  DrawerTitle,
  open,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [permDrawerOpen, setPermDrawerOpen] = useState(false);
  const [currentPermissions, setCurrentPermissions] = useState([]);

  const isView = mode === "view";
  const isAdd = mode === "add";

  const {
    data: roleDetail,
    refetch,
    isLoading,
  } = useApiQuery({
    fetchQueryName: "roleDetail",
    fetchQueryFunction: fetchRoleDetail,
    params: { uuid: selectedData?.uuid },
    options: { enabled: !!selectedData?.uuid },
  });

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
      setCurrentPermissions([]);
    } else if (roleDetail) {
      form.setFieldsValue({
        name: roleDetail.name,
        code: roleDetail.code,
        description: roleDetail.description || "",
      });

      const initialSelectedIds = [];
      roleDetail.permissions?.forEach((group) => {
        group.permissions?.forEach((p) => {
          if (p.selected) initialSelectedIds.push(String(p.id));
        });
      });
      setCurrentPermissions(initialSelectedIds);
    }
  }, [roleDetail, form, isAdd]);

  // ✅ Handles ONLY name / code / description
  const onFinish = (values) => {
    if (isAdd) {
      const createPayload = {
        name: values.name,
        code: values.code,
        description: values.description,
        // permissionIds: currentPermissions.map((id) => String(id)),
        // permissionId: currentPermissions.map((id) => Number(id)),
        permissionId: currentPermissions.map((id) => parseInt(id, 10)),
      };
      // console.log("Create payload", createPayload);

      createRoleFunction.mutate(createPayload, {
        onSuccess: (res) => {
          if (res?.reasonCode === "200" || res?.status === "success") {
            Toast.success("Role created successfully");
            // refetch();
            setDrawerOpen(false);
          } else {
            Toast.error(res?.error?.text || "Creation failed");
          }
        },
        onError: () => Toast.error("Error occurred while creating role"),
      });
    } else {
      // ✅ Edit mode: only update role info (no permissions here)
      const updatePayload = {
        uuid: selectedData?.uuid,
        name: values.name,
        code: values.code,
        description: values.description,
      };

      // console.log("📤 Sending Role Info Update:", updatePayload);

      updateRoleFunction.mutate(updatePayload, {
        onSuccess: (res) => {
          if (res?.reasonCode === "200") {
            Toast.success("Role info updated successfully");
            refetch();
            setDrawerOpen(false);
          } else {
            Toast.error(res?.error?.text || "Update failed");
          }
        },
        onError: () => Toast.error("An error occurred during update"),
      });
    }
  };

  // ✅ Handles ONLY permission changes — called from PermissionAssignDrawer onSave
  const handlePermissionSave = (newIds) => {
    const newIdsAsString = newIds.map(String);
    setCurrentPermissions(newIdsAsString);
    setPermDrawerOpen(false);

    // Compute delta (only changed permissions)
    // const changedPermissions = [];
    // roleDetail?.permissions?.forEach((group) => {
    //   group.permissions?.forEach((p) => {
    //     const wasSelected = p.selected;
    //     const isNowSelected = newIdsAsString.includes(String(p.id));
    //     if (wasSelected !== isNowSelected) {
    //       changedPermissions.push(p.id);
    //     }
    //   });
    // });

    // if (changedPermissions.length === 0) {
    //   Toast.info("No permission changes detected");
    //   return;
    // }

    const permPayload = {
      uuid: selectedData?.uuid,
      name: roleDetail.name,
      code: roleDetail.code,
      description: roleDetail.description || "",
      // permissions: changedPermissions,
      permissions: newIds, //This the array of currently checked IDs
    };

    // console.log("📤 Sending Permission Delta Update:", permPayload);

    updatePermissionFunction.mutate(permPayload, {
      onSuccess: (res) => {
        if (res?.reasonCode === "200") {
          Toast.success("Permissions updated successfully");
          refetch();
        } else {
          Toast.error(res?.error?.text || "Permission update failed");
        }
      },
      onError: () =>
        Toast.error("An error occurred while updating permissions"),
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <Drawer
          title={
            <div className="flex items-center justify-between">
              <span>{DrawerTitle}</span>
              {isView ? (
                <Button type="primary" onClick={switchToEdit}>
                  Edit
                </Button>
              ) : (
                <FormButtons
                  onClick={() => form.submit()}
                  mode={mode}
                  loading={
                    isAdd
                      ? createRoleFunction.isPending
                      : updateRoleFunction.isPending
                  }
                />
              )}
            </div>
          }
          size={500}
          onClose={onClose}
          open={open}
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* ── Role Info Fields ── */}
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input readOnly={isView} placeholder="IT Support" />
            </Form.Item>
            <Form.Item label="Code" name="code" rules={[{ required: true }]}>
              <Input readOnly={isView} placeholder="it_support" />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <TextArea
                readOnly={isView}
                // placeholder="Enter the description for related role"
              />
            </Form.Item>

            {/* ── Permissions Section (edit / view only, not add) ── */}
            {!isAdd && (
              <>
                <Divider />
                <div
                  style={{
                    background: "#f5f5f5",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    Permissions Selected: <b>{currentPermissions.length}</b>
                  </span>

                  {!isView && (
                    <Button
                      type="primary"
                      loading={updatePermissionFunction?.isPending}
                      onClick={() => setPermDrawerOpen(true)}
                    >
                      Manage Permissions
                    </Button>
                  )}
                </div>
              </>
            )}

            {/* ── Permission Assign Drawer ── */}
            <PermissionAssignDrawer
              open={permDrawerOpen}
              onClose={() => setPermDrawerOpen(false)}
              rolePermissions={roleDetail?.permissions || []}
              selectedPermissions={currentPermissions}
              onSave={handlePermissionSave} // ✅ triggers its own API call
            />
          </Form>
        </Drawer>
      )}
    </>
  );
};

export default RoleForm;
