import React, { useState, useEffect } from "react";
import { getRestaurantTables } from "../../api/restaurantTableApi";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import RestaurantTableForm from "./components/RestaurantTableForm";
import RestauranttableTable from "./components/RestauranttableTable";
import { LIMITS } from "../../variables/constants";
import { PERMISSIONS } from "../../variables/permission";
import usePermission from "../../hooks/usePermission";

const RestaurantTableListing = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [currentMode, setCurrentMode] = useState("add");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
    const [drawerOpen, setDrawerOpen] = useState(false);


    // Fetch List Data
    const { data, isLoading } = useApiQuery({
        fetchQueryName: "restaurant-tables",
        fetchQueryFunction: getRestaurantTables,
        params: {
            pagination: {
                page: page,
                perPage: perPage
            },
            keyword,
        },
    });

    const restaurantTables = data?.data || [];

    // Reset page to 1 when searching
    useEffect(() => {
        setPage(1);
    }, [keyword, perPage]);

    // Handlers
    const handleAdd = () => {
        setSelectedRow(null);
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

    return (
        <div className="w-full">
            <div className="px-6 py-4">
                <ListHeader
                    title="Restaurant Table List"
                    searchPlaceholder="Search Restaurant Table..."
                    keyword={keyword}
                    setKeyword={setKeyword}
                    addButtonText="Add New Restaurant Table"
                    onAdd={handleAdd}
                    permission={PERMISSIONS.RESTAURANT_TABLE_CREATE}
                />
            </div>

            <RestauranttableTable
                dataSource={restaurantTables}
                onView={handleView}
                onEdit={handleEdit}
                loading={isLoading}
                page={data?.pagination?.currentPage || page}
                perPage={data?.pagination?.perPage || perPage}
                total={data?.pagination?.total}
                changePage={(page) => setPage(page)}
                changePerPage={(perPage) => setPerPage(perPage)}
            />

            <RestaurantTableForm
                mode={currentMode}
                setMode={setCurrentMode}
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
                selectedRow={selectedRow}
                setSelectedRow={setSelectedRow}
                setPage={setPage}
                page={page}
            />
        </div>
    );
};

export default RestaurantTableListing;
