import React, { useState, useMemo, useEffect } from "react"; // Added useMemo
import {
  fetchPermissionData,
  fetchPermissionDetail,
  createPermission,
  updatePermission,
} from "../../api/permissionApi";
import useApiQuery from "../../hooks/useApiQuery";
import { useApiMutation } from "../../hooks/useApiMutation";
import ListHeader from "../../component/ListHeader/ListHeader";
import PermissionTable from "./Components/PermissionTable";
import PermissionForm from "./Components/PermissionForm";
import Toast from "../../component/Toast/Toast";

const PermissionListing = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState(""); // This now only controls local UI

  // 1. Fetch data WITHOUT keyword so it only calls once on mount
  const { data, refetch, isLoading } = useApiQuery({
    fetchQueryName: "permissionData",
    fetchQueryFunction: fetchPermissionData,
    params: {}, // Removed keyword from here
  });

  const permissions = Array.isArray(data?.response?.data)
    ? data.response.data
    : [];

  // 2. Fetch Permission Details - Only call when drawer is open AND a row is selected
  // const { data: detailRes, isLoading: isLoadingDetail } = useApiQuery({
  //   fetchQueryName: ["permissionDetail", selectedRow?.uuid],
  //   fetchQueryFunction: () => fetchPermissionDetail(selectedRow?.uuid),
  //   enabled:
  //     !!open &&
  //     !!selectedRow?.uuid &&
  //     (currentMode === "view" || currentMode === "edit"),
  //   // Add this to prevent stale queries:
  //   staleTime: Infinity, // Prevents automatic refetches
  //   cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
  // });

  // Replace the useApiQuery call with a manual fetch in a useEffect:
  const [detailData, setDetailData] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    if (
      open &&
      selectedRow?.uuid &&
      (currentMode === "view" || currentMode === "edit")
    ) {
      setIsLoadingDetail(true);
      fetchPermissionDetail(selectedRow.uuid)
        .then((res) => {
          setDetailData(res?.response?.data || null);
        })
        .catch((err) => {
          Toast.error("Failed to fetch permission details");
        })
        .finally(() => {
          setIsLoadingDetail(false);
        });
    } else {
      setDetailData(null);
    }
  }, [open, selectedRow?.uuid, currentMode]);

  // 2. Filter the data LOCALLY using useMemo
  // This will re-run instantly when 'keyword' or 'permissions' changes without an API call
  const filteredPermissions = useMemo(() => {
    if (!keyword) return permissions;

    const lowerKeyword = keyword.toLowerCase();
    return permissions.filter((item) => {
      return (
        item.name?.toLowerCase().includes(lowerKeyword) ||
        item.code?.toLowerCase().includes(lowerKeyword) ||
        item.description?.toLowerCase().includes(lowerKeyword)
      );
    });
  }, [keyword, permissions]);

  // ... Mutations (createMutate/updateMutate) stay exactly the same ...
  const { mutate: createMutate } = useApiMutation({
    mutationFn: createPermission,
    invalidateKeys: [["permissionData"]],
    options: {
      onSuccess: () => {
        refetch();
        Toast.success("Permission created successfully");
        setOpen(false);
      },
      onError: (err) => {
        const apiError = err?.response?.data?.error?.text;
        Toast.error(apiError || err?.message || "Failed to create permission");
      },
    },
  });

  const { mutate: updateMutate } = useApiMutation({
    mutationFn: ({ id, ...payload }) => updatePermission(id, payload),
    invalidateKeys: [["permissionData"]],
    options: {
      onSuccess: () => {
        refetch();
        Toast.success("Permission updated successfully");
        setOpen(false);
      },
      onError: (err) => {
        const apiError = err?.response?.data?.error?.text;
        Toast.error(apiError || err?.message || "Failed to update permission");
      },
    },
  });

  const showDrawer = (record, actionMode) => {
    setSelectedRow(record);
    setCurrentMode(actionMode);
    setOpen(true);
  };

  const handleEdit = (record) => {
    showDrawer(record, "edit");
  };

  const handleView = (record) => {
    setSelectedRow(record);
    setCurrentMode("view");
    setOpen(true);
  };

  const handleSubmit = (values) => {
    if (currentMode === "add") {
      createMutate(values);
    } else if (currentMode === "edit") {
      const uuid = detailData?.uuid || selectedRow?.uuid;
      if (!uuid) {
        messageApi.error("UUID not found");
        return;
      }
      updateMutate({ id: uuid, ...values });
    }
  };

  const switchToEdit = () => {
    if (detailData) {
      setSelectedRow(detailData);
    }
    setCurrentMode("edit");
  };

  const onClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleAdd = () => {
    setSelectedRow(null);
    setCurrentMode("add");
    setOpen(true);
  };

  const isView = currentMode === "view";
  const isEdit = currentMode === "edit";

  const DrawerTitle = isView
    ? "Permission View"
    : isEdit
      ? "Permission Edit"
      : "Permission Create";

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4 w-full px-6 py-2">
        <ListHeader
          // title="Permission List"
          searchPlaceholder="Search Permission ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText=" Add New Permission"
          onAdd={handleAdd}
        />
      </div>
      <PermissionTable
        dataSource={filteredPermissions}
        onView={handleView}
        onEdit={handleEdit}
        loading={isLoading}
      />
      <PermissionForm
        initialValues={currentMode === "add" ? null : detailData || selectedRow}
        mode={currentMode}
        onSubmit={handleSubmit}
        open={open}
        onClose={onClose}
        onCancel={onClose}
        permissions={permissions}
        loading={isLoadingDetail}
        DrawerTitle={DrawerTitle}
        switchToEdit={switchToEdit}
        isView={isView}
      />
    </>
  );
};

export default PermissionListing;
