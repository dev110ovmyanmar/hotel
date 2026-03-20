import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCategories } from "../../services/categorySlice";
import { setUnits } from "../../services/unitSlice";
import { getServiceInventory } from "../../api/serviceInventoryApi";
import { getCategories } from "../../api/categoryApi";
import { getUnits } from "../../api/unitApi";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import InventoryTable from "./components/InventoryTable";
import InventoryForm from "./components/InventoryForm";
import { LIMITS } from "../../variables/constants";


const InventoryListing = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();

  // 1. Access categories and units from Redux
  const categoriesFromRedux = useSelector(
    (state) => state.category?.categories || [],
  );
  const unitsFromRedux = useSelector((state) => state.unit?.units || []);

  // 2. Fetch categories and units if Redux is empty
  const { data: categoryData } = useApiQuery({
    fetchQueryName: "categoryDataForInventory",
    fetchQueryFunction: getCategories,
    options: {
      enabled: categoriesFromRedux.length === 0,
    },
  });

  const { data: unitData } = useApiQuery({
    fetchQueryName: "unitDataForInventory",
    fetchQueryFunction: getUnits,
    options: {
      enabled: unitsFromRedux.length === 0,
    },
  });

  // 3. Populate Redux with categories and units when fetched
  useEffect(() => {
    if (categoryData?.data && categoriesFromRedux.length === 0) {
      dispatch(setCategories(categoryData.data));
    }
  }, [categoryData, categoriesFromRedux.length, dispatch]);

  useEffect(() => {
    if (unitData?.data && unitsFromRedux.length === 0) {
      dispatch(setUnits(unitData.data));
    }
  }, [unitData, unitsFromRedux.length, dispatch]);

  // 4. Map categories and units to Select options
  const categoryOptions =
    categoriesFromRedux?.map((item) => ({
      value: item.uuid,
      label: item.name,
    })) || [];

  const unitOptions =
    unitsFromRedux?.map((item) => ({
      value: item.uuid,
      label: item.name,
    })) || [];

  // 5. Fetch Inventory Listing Data
  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "service_inventories",
    fetchQueryFunction: getServiceInventory,
    params: {
      pagination: 
      { page: page, 
        perPage: perPage
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
          searchPlaceholder="Search Items ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Item"
          onAdd={handleAdd}
        />
      </div>

      <InventoryTable
        dataSource={serviceInventories}
        onView={handleView}
        onEdit={handleEdit}
        loading={isLoading}
        page={data?.pagination?.currentPage || page}
        perPage={data?.pagination?.perPage || perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
      />

      <InventoryForm
        mode={currentMode}
        page={data?.pagination?.currentPage || page}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        loading={isLoading}
        switchToEdit={switchToEdit}
        categoryOptions={categoryOptions} // Now powered by Redux
        unitOptions={unitOptions}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
};

export default InventoryListing;

