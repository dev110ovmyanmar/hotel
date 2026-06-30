import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import ServicePackageTable from "./Components/ServicePackageTable";
import ServicePackageForm from "./Components/ServicePackageForm/ServicePackageForm";
import { getServicePackages } from "../../api/servicePackageApi";
import { PERMISSIONS } from "../../variables/permission";

const ServicePackageList = () => {
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [mode, setMode] = useState("add");
    const [selectedData, setSelectedData] = useState(null);

    const { data, isLoading, error } = useApiQuery({
        fetchQueryName: "service-packages",
        fetchQueryFunction: getServicePackages,
        params: {
            pagination: {
                page: page,
                perPage: perPage,
            },
            keyword,
        },
    });

    useEffect(() => {
        setPage(1);
    }, [keyword, perPage]);

    const handleAdd = () => {
        setSelectedData(null);
        setMode("add");
        setDrawerOpen(true);
    };

    return (
        <div className="w-full px-6 py-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                <ListHeader
                    searchPlaceholder="Search Package ..."
                    keyword={keyword}
                    setKeyword={setKeyword}
                    addButtonText="Add New Package"
                    onAdd={handleAdd}
                    permission={PERMISSIONS.SERVICE_PACKAGE_CREATE}
                />
            </div>

            <ServicePackageTable
                data={data?.data || []}
                page={data?.pagination.currentPage}
                perPage={data?.pagination.perPage}
                total={data?.pagination?.total}
                changePage={(page) => setPage(page)}
                changePerPage={(perPage) => setPerPage(perPage)}
                loading={isLoading}
            />

            <ServicePackageForm
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
                page={page}
                setPage={setPage}
                mode={mode}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
            />
        </div>
    );
};

export default ServicePackageList;
