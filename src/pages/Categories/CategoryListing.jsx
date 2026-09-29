import React, { useState, useMemo, useEffect } from "react";
import {
  getCategories
} from "../../api/categoryApi";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import CategoryTable from "./components/CategoryTable";
import CategoryForm from "./components/CategoryForm";
import { LIMITS } from "../../variables/constants";
import { PERMISSIONS } from "../../variables/permission";

const CategoryListing = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isFetching, error } = useApiQuery({
    fetchQueryName: "categories",
    fetchQueryFunction: getCategories,
    params: {
      pagination:
      {
        page: page,
        perPage: perPage
      },
      keyword,
    },
  });


  const categories = data?.data || [];

  useEffect(() => {
    setPage(1);
  }, [keyword, perPage]);

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
          searchPlaceholder="Search Category ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Category"
          onAdd={handleAdd}
          permission={PERMISSIONS.CATEGORY_CREATE}
        />
      </div>

      <CategoryTable
        dataSource={categories} // Filtered by keyword via API or useMemo
        onView={handleView}
        onEdit={handleEdit}
        loading={isFetching}
        page={data?.pagination?.currentPage || page}
        perPage={data?.pagination?.perPage || perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
      />

      <CategoryForm
        mode={currentMode}
        page={data?.response?.pagination?.currentPage || page}
        setPage={setPage}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        switchToEdit={switchToEdit}
        loading={isFetching}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
};

export default CategoryListing;



