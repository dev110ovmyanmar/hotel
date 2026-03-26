import React, { useState, useMemo, useEffect } from "react";
import {
  getProperties,
} from "../../api/propertyApi.js";
import { queryClient } from "../../app/queryClient.js";
import useApiQuery from "../../hooks/useApiQuery";
import PropertyTable from "./components/PropertyTable.jsx";
import PropertyForm from "./components/PropertyForm.jsx";
import ListHeader from "../../component/ListHeader/ListHeader.jsx";
import { LIMITS } from "../../variables/constants.js";

const PropertiesListing = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCountryUuid, setSelectedCountryUuid] = useState(null);

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "properties",
    fetchQueryFunction: getProperties,
    params: {
      pagination: {
        page: page,
        perPage: perPage
      },
      keyword,
    },
  });

  const properties = data?.data || [];
  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  useEffect(() => {
    setPage(1);
  }, [keyword, perPage]);

  const propertyTypes = useMemo(
    () =>
      initData?.statuses?.property_type?.map((item) => ({
        value: item.uuid,
        label: item.name,
      })) || [],
    [initData],
  );
  const countryOptions = useMemo(
    () =>
      initData?.locations?.map((item) => ({
        value: item.uuid,
        label: item.name,
      })) || [],
    [initData],
  );
  const currencyOptions = useMemo(
    () =>
      initData?.currencies?.map((item) => ({
        value: item.uuid,
        label: item.code,
      })) || [],
    [initData],
  );

  const cityOptions = useMemo(() => {
    if (!selectedCountryUuid || !initData?.locations) {
      return [];
    }
    return (
      initData.locations
        .find((loc) => loc.uuid === selectedCountryUuid)
        ?.city?.map((c) => ({ value: c.uuid, label: c.name })) || []
    );
  }, [selectedCountryUuid, initData]);

  const handleAdd = () => {
    setCurrentMode("add");
    setSelectedRow(null);
    setSelectedCountryUuid(null);
    setDrawerOpen(true);
  };

  const handleView = (record) => {
    setSelectedRow(record);
    setSelectedCountryUuid(record.country?.uuid);
    setCurrentMode("view");
    setDrawerOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedRow(record);
    setSelectedCountryUuid(record.country?.uuid);
    setCurrentMode("edit");
    setDrawerOpen(true);
  };

  const onClose = () => {
    setDrawerOpen(false);
    setSelectedRow(null);
  };

  const switchToEdit = () => {
    setCurrentMode("edit");
  };

  const showCreateButton = properties ? false : true;

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          keyword={keyword}
          setKeyword={setKeyword}
          searchPlaceholder="Search Property..."
          onAdd={handleAdd}
          showCreateButton={showCreateButton}
          // showButton={true}
          addButtonText={"Add Property"}
        />
      </div>

      <PropertyTable
        dataSource={properties}
        onView={handleView}
        onEdit={handleEdit}
        loading={isLoading}
        page={data?.response?.pagination?.currentPage || page}
        perPage={data?.response?.pagination?.perPage || perPage}
        total={data?.response?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
      />

      <PropertyForm
        mode={currentMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        loading={isLoading}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        propertyTypes={propertyTypes}
        countryOptions={countryOptions}
        cityOptions={cityOptions}
        currencyOptions={currencyOptions}
        switchToEdit={switchToEdit}
        onCountryChange={setSelectedCountryUuid}
      />

    </div>
  );
};

export default PropertiesListing;
