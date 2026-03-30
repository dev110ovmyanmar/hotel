import React, { useEffect, useState } from "react";
import { Drawer, Checkbox, Button, Divider } from "antd";

const AddOnDrawer = ({
  mode,
  open,
  onClose,
  loading,
  rolePermissions,
  selectedPermissions,
  onSave
}) => {

  const [checkedIds, setCheckedIds] = useState([]);

  useEffect(() => {
    if (open) {

      if (selectedPermissions?.length) {
        setCheckedIds(selectedPermissions);
        return;
      }

      const ids =
        rolePermissions
          ?.flatMap((m) => m.permissions)
          ?.filter((p) => p.selected)
          ?.map((p) => p.id) || [];

      setCheckedIds(ids);
    }
  }, [open, selectedPermissions, rolePermissions]);

  const togglePermission = (id) => {
    setCheckedIds((prev) =>
      prev?.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  const toggleModule = (permissions) => {
    const ids = permissions.map((p) => p.id);
    const allChecked = ids.every((id) => checkedIds?.includes(id));

    setCheckedIds((prev) => {
      if (allChecked) {
        return prev.filter((id) => !ids.includes(id));
      } else {
        return [...new Set([...prev, ...ids])];
      }
    });
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={550}
      title={
        <div className="flex justify-between items-center">
          <span>
            {mode === "notAllow" ? "View Permissions" : "Add On Permissions"}
          </span>
          {mode === "allow" && (
            <div className="flex justify-between gap-4">
              <Button type="primary" onClick={() => onSave(checkedIds)} loading={loading}>
                Save
              </Button>
            </div>
          )}
        </div>


      }
    >

      {rolePermissions?.map((module) => {
        // Change Allow id
        const ids = module.permissions.map((p) => p.id);
        const allChecked = ids.every((id) => checkedIds.includes(id));

        return (
          <div key={module.module} style={{ marginBottom: 20 }} className="border rounded p-3">

            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold capitalize text-base">
                {module.module}
              </span>
              <Checkbox
                checked={mode === "notAllow" ? true : allChecked}
                disabled={mode === "notAllow"}
                onChange={() => toggleModule(module.permissions)}
              >
                Select All
              </Checkbox>
            </div>

            <Divider style={{ margin: "10px 0" }} />

            {/* Permissions */}
            <div style={{ paddingLeft: 20 }} >
              {module.permissions?.map((p) => (
                <div key={p.id} >
                  <Checkbox
                    checked={mode === "notAllow" ? true : checkedIds?.includes(p.id)}
                    disabled={mode === "notAllow"}
                    onChange={() => togglePermission(p.id)}
                  >
                    <span
                      className={`text-sm ${allChecked
                        ? "text-green-700 font-semibold"
                        : ""
                        }`}
                    >
                      {p.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({p.code})
                    </span>
                  </Checkbox>
                </div>
              ))}
            </div>

          </div>
        );
      })}
    </Drawer >
  );
};

export default AddOnDrawer;