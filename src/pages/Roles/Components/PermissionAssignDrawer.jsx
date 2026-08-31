
import React, { useState, useMemo } from "react";
import { Button, Drawer, Input, Checkbox, Divider, Empty } from "antd";
// import { SearchOutlined } from "@ant-design/icons";

const PermissionAssignDrawer = ({
  open,
  onClose,
  rolePermissions = [],
  selectedPermissions = [],
  onSave, // Now triggers API call from RoleDrawer.handlePermissionSave
}) => {
  const [search, setSearch] = useState("");
  const [checkedIds, setCheckedIds] = useState([]);

  //  Sync with parent's selectedPermissions every time drawer opens
  React.useEffect(() => {
    if (open) {
      const ids = (selectedPermissions || []).map((id) => String(id));
      setCheckedIds(ids);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]); // selectedPermissions intentionally excluded — sync only on open

  //  Flatten all permissions and track which were originally selected
  const allPermissions = useMemo(() => {
    const flattened = [];
    const originalPermissions = new Set();

    if (!rolePermissions || !Array.isArray(rolePermissions)) {
      return { flattened, originalPermissions };
    }

    rolePermissions.forEach((moduleGroup) => {
      if (moduleGroup?.permissions && Array.isArray(moduleGroup.permissions)) {
        moduleGroup.permissions.forEach((perm) => {
          if (perm?.id) {
            flattened.push(perm);
            if (perm.selected) {
              originalPermissions.add(String(perm.id));
            }
          }
        });
      }
    });

    return { flattened, originalPermissions };
  }, [rolePermissions]);

  //  Filter by search term
  const filteredPermissions = useMemo(() => {
    return allPermissions.flattened.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [allPermissions, search]);

  //  Group filtered permissions by module
  const groupedByModule = useMemo(() => {
    const groups = {};
    filteredPermissions.forEach((p) => {
      const module = p.module || "other";
      if (!groups[module]) groups[module] = [];
      groups[module].push(p);
    });
    return groups;
  }, [filteredPermissions]);

  //  Toggle all permissions in a module
  const handleCheckAll = (module, permissions) => {
    const moduleIds = permissions.map((p) => String(p.id));
    const allChecked = moduleIds.every((id) => checkedIds.includes(id));

    if (allChecked) {
      setCheckedIds((prev) => prev.filter((id) => !moduleIds.includes(id)));
    } else {
      setCheckedIds((prev) => [...new Set([...prev, ...moduleIds])]);
    }
  };

  //  Toggle a single permission
  const handleCheck = (id) => {
    const normalizedId = String(id);
    setCheckedIds((prev) =>
      prev.includes(normalizedId)
        ? prev.filter((cid) => cid !== normalizedId)
        : [...prev, normalizedId]
    );
  };

  //  Save: pass integer IDs back to RoleDrawer.handlePermissionSave
  const handleSave = () => {
    const finalIds = checkedIds.map((id) => parseInt(id, 10));
    onSave(finalIds); // RoleDrawer will call API and update state
  };

  // Cancel: reset local state to what parent had
  const handleClose = () => {
    setCheckedIds((selectedPermissions || []).map((id) => String(id)));
    onClose();
  };

  return (
    <Drawer
      title="Manage Permissions"
      description="Select permissions to assign to this role"
      open={open}
      onClose={handleClose}
      size={600}
      extra={
        <div className="flex gap-2">
          <Button type="primary" onClick={handleSave}>
            Update
          </Button>
        </div>
      }
    >

      {/* ── Search Input ── */}
      {/* <Input
        placeholder="Search permissions by name or code..."
        prefix={<SearchOutlined />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
        allowClear
      /> */}

      {/* ── Permissions List ── */}
      <div className="space-y-4">
        {!rolePermissions || rolePermissions.length === 0 ? (
          <Empty description="No permissions available" />
        ) : Object.entries(groupedByModule).length === 0 ? (
          <Empty description="No permissions match your search" />
        ) : (
          Object.entries(groupedByModule).map(([module, permissions]) => {
            const moduleIds = permissions.map((p) => String(p.id));
            const allChecked = moduleIds.every((id) =>
              checkedIds.includes(id)
            );
            const someChecked = moduleIds.some((id) =>
              checkedIds.includes(id)
            );

            return (
              <div key={module} className="border rounded p-3">
                {/* Module Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold capitalize text-base">
                    {module}
                  </span>
                  <Checkbox
                    checked={allChecked}
                    indeterminate={someChecked && !allChecked}
                    onChange={() => handleCheckAll(module, permissions)}
                  >
                    Select All
                  </Checkbox>
                </div>
                <Divider className="my-2" />

                {/* Individual Permissions */}
                <div className="space-y-2">
                  {permissions.map((p) => {
                    const isOriginal = allPermissions.originalPermissions.has(
                      String(p.id)
                    );
                    const isChecked = checkedIds.includes(String(p.id));

                    return (
                      <div key={p.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={isChecked}
                          onChange={() => handleCheck(p.id)}
                        >
                          <span
                            className={`text-sm ${isOriginal && isChecked
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
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Drawer>
  );
};

export default PermissionAssignDrawer;