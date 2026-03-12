import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCategories } from "../../services/categorySlice";
import { setUnits } from "../../services/unitSlice";
import {
  fetchInventoryData, 
  fetchInventoryDetail,
  upsertInventory 
} from "../../api/inventoryApi";
import { fetchCategoryData } from "../../api/categoryApi";
import { fetchUnitData } from "../../api/unitApi";
import useApiQuery from "../../hooks/useApiQuery";
import { useApiMutation } from "../../hooks/useApiMutation";
import ListHeader from "../../component/ListHeader/ListHeader";
import InventoryTable from "./components/InventoryTable";
import InventoryForm from "./components/InventoryForm";
import Toast from "../../component/Toast/Toast";

const InventoryListing = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const dispatch = useDispatch();
 
  // 1. Access categories and units from Redux
  const categoriesFromRedux = useSelector((state) => state.category?.categories || []);
  const unitsFromRedux = useSelector((state) => state.unit?.units || []);

  // 2. Fetch categories and units if Redux is empty
  const { data: categoryData } = useApiQuery({
    fetchQueryName: "categoryDataForInventory",
    fetchQueryFunction: fetchCategoryData,
    options: {
      enabled: categoriesFromRedux.length === 0,
    },
  });

  const { data: unitData } = useApiQuery({
    fetchQueryName: "unitDataForInventory",
    fetchQueryFunction: fetchUnitData,
    options: {
        enabled: unitsFromRedux.length === 0,
    }
  })

  // 3. Populate Redux with categories and units when fetched
  useEffect(() => {
    if (categoryData?.response?.data && categoriesFromRedux.length === 0) {
      dispatch(setCategories(categoryData.response.data));
    }
  }, [categoryData, categoriesFromRedux.length, dispatch]);

  useEffect(() => {
    if (unitData?.response?.data && unitsFromRedux.length === 0) {
      dispatch(setUnits(unitData.response.data));
    }
  }, [unitData, unitsFromRedux.length, dispatch]);


  // 4. Map categories and units to Select options
  const categoryOptions = categoriesFromRedux?.map((item) => ({
    value: item.uuid,
    label: item.name,
  })) || [];

  const unitOptions = unitsFromRedux?.map((item) => ({
    value: item.uuid,
    label: item.name,
  })) || [];

  // 5. Fetch Inventory Listing Data
  const { data, refetch, isLoading } = useApiQuery({
    fetchQueryName: "inventoryData",
    fetchQueryFunction: fetchInventoryData,
    params: { keyword },
  });

  const inventoryItems = data?.response?.data || [];

  // 6. Fetch Inventory Detail
  const { data: detailRes, isLoading: isLoadingDetail } = useApiQuery({
    fetchQueryName: ["inventoryDetail", selectedRow?.uuid],
    fetchQueryFunction: fetchInventoryDetail,
    params: { uuid: selectedRow?.uuid },
    options: {
      enabled: !!open && !!selectedRow?.uuid && (currentMode === "view" || currentMode === "edit"),
      staleTime: 0,
    },
  });

  const detailData = detailRes?.response || null;

  // 7. Mutation
  const { mutate: upsertMutate } = useApiMutation({
    mutationFn: upsertInventory,
    invalidateKeys: ["inventoryData"],
    options: {
      onSuccess: () => {
        refetch();
        Toast.success(`Item ${currentMode === "add" ? "created" : "updated"} successfully`);
        handleClose();
      },
    },
  });

  const handleSubmit = (values) => {
    const payload = {
      name: values.name,
      reorderLevel: values.reorderLevel,
      unitPrice: values.unitPrice, // Keep as unitPrice
      unitCost: values.unitCost,
      stockQuantity: values.stockQuantity,
      laundryStatus: values.laundryStatus ? 1 : 0,
      isFree: values.isFree ? 1 : 0,
      category: {
        uuid: values.categoryUuid
      },
      unit: {
        uuid: values.unitUuid
      }
    };

    if (currentMode !== "add") {
      payload.uuid = selectedRow?.uuid;
    }
    
    upsertMutate(payload);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleAdd = () => { setCurrentMode("add"); setOpen(true); };
  const handleView = (record) => { setSelectedRow(record); setCurrentMode("view"); setOpen(true); };
  const handleEdit = (record) => { setSelectedRow(record); setCurrentMode("edit"); setOpen(true); };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4 w-full px-6 py-2">
        <ListHeader
          // title="Inventory List"
          searchPlaceholder="Search Items ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Item"
          onAdd={handleAdd}
        />
      </div>

      <InventoryTable
        dataSource={inventoryItems}
        onView={handleView}
        onEdit={handleEdit}
        loading={isLoading}
      />
      
      <InventoryForm
        initialValues={currentMode === "add" ? null : (detailData || selectedRow)}
        mode={currentMode}
        onSubmit={handleSubmit}
        open={open}
        onClose={handleClose}
        loading={isLoadingDetail && currentMode !== "add"}
        switchToEdit={() => setCurrentMode("edit")}
        categoryOptions={categoryOptions} // Now powered by Redux
        unitOptions={unitOptions}
      />
    </>
  );
};

export default InventoryListing;