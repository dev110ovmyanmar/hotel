import React, { useState, useMemo, useEffect } from "react"; // Added useMemo
import { Table, Drawer, Button, message, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import PermissionDrawer from "./PermissionDrawer";
import {
  fetchPermissionData,
  fetchPermissionDetail,
  createPermission,
  updatePermission,
} from "../../api/permissionApi";
import useApiQuery from "../../hooks/useApiQuery";
import { useApiMutation } from "../../hooks/useApiMutation";
import Loader from "../../component/Loader/Loader";
import usePermissionColumns from "./usePermissionColumns";
import ListHeader from "../../component/ListHeader/ListHeader";

const PermissionListing = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState(""); // This now only controls local UI
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [messageApi, contextHolder] = message.useMessage();

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
          messageApi.error("Failed to fetch permission details");
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
        messageApi.success("Permission created successfully");
        setOpen(false);
      },
      onError: (err) => {
        const apiError = err?.response?.data?.error?.text;
        messageApi.error(
          apiError || err?.message || "Failed to create permission",
        );
      },
    },
  });

  const { mutate: updateMutate } = useApiMutation({
    mutationFn: ({ id, ...payload }) => updatePermission(id, payload),
    invalidateKeys: [["permissionData"]],
    options: {
      onSuccess: () => {
        refetch();
        messageApi.success("Permission updated successfully");
        setOpen(false);
      },
      onError: (err) => {
        const apiError = err?.response?.data?.error?.text;
        messageApi.error(
          apiError || err?.message || "Failed to update permission",
        );
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
  // const isAdd = currentMode === "add";

  const DrawerTitle = isView
    ? "Permission View"
    : isEdit
      ? "Permission Edit"
      : "Permission Create";

  const columns = usePermissionColumns(handleEdit, handleView);

  return (
    <>
      {contextHolder}
      {isLoading ? (
        <div className="flex justify-center items-center h-screen w-full px-6 py-2">
          <Loader />
        </div>
      ) : (
        <>
          {/* <div className="mb-2 flex items-center justify-between">
            <div className="ml-5">
              <Input
                placeholder="Search permissions..."
                prefix={<SearchOutlined />}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)} // Updates keyword state
                style={{ width: 300 }}
                allowClear
              />
            </div>
            <div className="mr-5">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setSelectedRow(null);
                  setCurrentMode("add");
                  setOpen(true);
                }}
              >
                Add Permission
              </Button>
            </div>
          </div> */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4 w-full px-6 py-2">
            <ListHeader
              title="Permission List"
              searchPlaceholder="Search Permission ..."
              keyword={keyword}
              setKeyword={setKeyword}
              addButtonText=" Add Permission"
              onAdd={handleAdd}
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredPermissions} // Pass the FILTERED array here
            rowKey="id"
            className="mx-5"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              showSizeChanger: true,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
            }}
          />
        </>
      )}

      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span>{DrawerTitle}</span>
            {isView && (
              <Button type="primary" onClick={switchToEdit}>
                Edit
              </Button>
            )}
          </div>
        }
        size={500}
        onClose={onClose}
        open={open}
      >
        <PermissionDrawer
          initialValues={
            currentMode === "add" ? null : detailData || selectedRow
          }
          mode={currentMode}
          onSubmit={handleSubmit}
          onCancel={onClose}
          permissions={permissions}
          loading={isLoadingDetail}
        />
      </Drawer>
    </>
  );
};

export default PermissionListing;
