import React, { useState, useEffect } from "react";
import { getServiceInventory } from "../../api/serviceInventoryApi";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import ServiceInventoryTable from "./components/ServiceInventoryTable";
import ServiceInventoryForm from "./components/ServiceInventoryForm";
import { LIMITS } from "../../variables/constants";
import { PERMISSIONS } from "../../variables/permission";

const ServiceInventoryListing = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isFetching, error } = useApiQuery({
    fetchQueryName: "service_inventories",
    fetchQueryFunction: getServiceInventory,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
    },
  });

  const serviceInventories = data?.data || [];

  useEffect(() => {
    setPage(1);
  }, [keyword, perPage]);

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleAdd = () => {
    setCurrentMode("add");
    setDrawerOpen(true);
  };

  const handleView = (record) => {
    setSelectedRow(record);
    setCurrentMode("view");
    setDrawerOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedRow(record);
    setCurrentMode("edit");
    setDrawerOpen(true);
  };

  const switchToEdit = () => {
    setCurrentMode("edit");
  };

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          searchPlaceholder="Search Service Inventories ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Service Inventory"
          onAdd={handleAdd}
          permission={PERMISSIONS.SERVICE_INVENTORY_CREATE}
        />
      </div>

      <ServiceInventoryTable
        dataSource={serviceInventories}
        onView={handleView}
        onEdit={handleEdit}
        loading={isFetching}
        page={data?.pagination?.currentPage || page}
        perPage={data?.pagination?.perPage || perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
      />

      <ServiceInventoryForm
        mode={currentMode}
        page={page}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        loading={isFetching}
        switchToEdit={switchToEdit}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
};

export default ServiceInventoryListing;
