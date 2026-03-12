import React, { useState, useMemo, useEffect } from "react";
import {
  fetchUnitData, //Api function name
  fetchUnitDetail,
  upsertUnit
} from "../../api/unitApi";
import useApiQuery from "../../hooks/useApiQuery";
import { queryClient } from "../../app/queryClient";
import { useApiMutation } from "../../hooks/useApiMutation";
import ListHeader from "../../component/ListHeader/ListHeader";
import UnitTable from "./components/UnitTable";
import UnitForm from "./components/UnitForm";
import Toast from "../../component/Toast/Toast";

const UnitListing = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");

  const initData = queryClient.getQueryData(["initData"]);
    const statusOptions = initData?.statuses?.status?.
    filter((item) => item.name.toLowerCase() !== "blocked")
    ?.map((item) => ({
    value: item.uuid,
    label: item.name,
    })) || [];

  const { data, refetch, isLoading } = useApiQuery({
    fetchQueryName: "unitData",
    fetchQueryFunction: fetchUnitData,
    params: { keyword }, // Pass keyword to API if supported
  });

  const units = data?.response?.data || [];

  const { data: detailRes, isLoading: isLoadingDetail } = useApiQuery({
    fetchQueryName: ["unitDetail", selectedRow?.uuid],
    fetchQueryFunction: fetchUnitDetail,
    params: { uuid: selectedRow?.uuid },
    options: {
      enabled: !!open && !!selectedRow?.uuid && (currentMode === "view" || currentMode === "edit"),
      staleTime: 0,
    },
  });

  const detailData = detailRes?.response || null;

  // Mutations
  const { mutate: upsertMutate } = useApiMutation({
    mutationFn: upsertUnit,
    invalidateKeys: ["unitData"],
    options: {
      onSuccess: () => {
        refetch();
        Toast.success(`Unit ${currentMode === "add" ? "created" : "updated"} successfully`);
        handleClose();
      },
    },
  });

  const handleSubmit = (values) => {
    const payload = {
      name: values.name,
      shortName: values.shortName,
      status: {
        uuid: values.statusUuid
      }
    };

    if(currentMode !== "add"){
      payload.uuid = selectedRow?.uuid;
    }
    upsertMutate(payload);
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleAdd = () => {
    setCurrentMode("add"); setOpen(true); 
  }

  const handleView = (record) => {
    setSelectedRow(record); 
    setCurrentMode("view"); 
    setOpen(true);
  }

  const handleEdit = (record) => {
    setSelectedRow(record); 
    setCurrentMode("edit");
    setOpen(true); 
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4 w-full px-6 py-2">
      <ListHeader
        // title="Unit List"
        keyword={keyword}
        searchPlaceholder="Search Unit ..."
        setKeyword={setKeyword}
        addButtonText="Add New Unit"
        onAdd={handleAdd}
      />
      </div>

      <UnitTable
        dataSource={units} // Filtered by keyword via API or useMemo
        onView={handleView}
        onEdit={handleEdit}
        loading={isLoading}
      />
      <UnitForm
        initialValues={currentMode === "add" ? null : detailData}
        mode={currentMode}
        onSubmit={handleSubmit}
        open={open}
        onClose={handleClose}
        loading={isLoadingDetail && currentMode !== "add"}
        switchToEdit={() => setCurrentMode("edit")}
        statusOptions={statusOptions}
      />
    </>
  );
};


export default UnitListing;