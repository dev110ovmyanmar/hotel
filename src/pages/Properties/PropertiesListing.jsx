import React, { useState, useMemo } from "react";
import {
  fetchPropertiesData,
  createProperty,
  updateProperty,
  fetchPropertyDetail,
} from "../../api/propertyApi.js";
import { queryClient } from "../../app/queryClient.js";
import useApiQuery from "../../hooks/useApiQuery";
import { useApiMutation } from "../../hooks/useApiMutation";
import Toast from "../../component/Toast/Toast.jsx";
import PropertyTable from "./components/PropertyTable.jsx";
import PropertyForm from "./components/PropertyForm.jsx";
import ListHeader from "../../component/ListHeader/ListHeader.jsx";

const PropertiesListing = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [selectedCountryUuid, setSelectedCountryUuid] = useState(null);

  const { data, isLoading, refetch } = useApiQuery({
    fetchQueryName: ["propertyData", keyword],
    fetchQueryFunction: () => fetchPropertiesData({ keyword }),
  });

  const properties = Array.isArray(data?.response?.data)
    ? data.response.data
    : [];
  const initData = queryClient.getQueryData(["initData", {}]);

  // Dynamic Options
  const propertyTypes = useMemo(
    () =>
      initData?.statuses?.property_type?.map((item) => ({
        value: item.uuid,
        label: item.name,
      })) || [],
    [initData]
  );
  const countryOptions = useMemo(
    () =>
      initData?.locations?.map((item) => ({
        value: item.uuid,
        label: item.name,
      })) || [],
    [initData]
  );
  const currencyOptions = useMemo(
    () =>
      initData?.currencies?.map((item) => ({
        value: item.uuid,
        label: item.code,
      })) || [],
    [initData]
  );
  const cityOptions = useMemo(() => {
    if (!selectedCountryUuid || !initData?.locations) return [];
    return (
      initData.locations
        .find((loc) => loc.uuid === selectedCountryUuid)
        ?.city?.map((c) => ({ value: c.uuid, label: c.name })) || []
    );
  }, [selectedCountryUuid, initData]);

  const { mutate: upsertMutate, isPending: isSaving } = useApiMutation({
    mutationFn: (payload) =>
      payload.uuid
        ? updateProperty(payload.uuid, payload)
        : createProperty(payload),
    options: {
      onSuccess: () => {
        Toast.success(`Successfully saved.`);
        setDrawerOpen(false);
        refetch();
      },
      onError: (err) =>
        Toast.error(err?.response?.data?.error?.text || "Operation failed"),
    },
  });

  const handleGetDetail = async (uuid) => {
    setIsLoadingDetail(true);
    try {
      const res = await fetchPropertyDetail(uuid);
      if (res.reasonCode === "200") {
        const rawData = res.response;
        rawData.settingsArray =
          rawData.settings?.map((s) => ({
            uuid: s.uuid,
            key: s.settingKey,
            value: s.settingValue,
          })) || [];
        setSelectedRow(rawData);
        if (rawData.country?.uuid) setSelectedCountryUuid(rawData.country.uuid);
      }
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handlePropertySubmit = (values) => {
    const activeSetting = selectedRow?.settingsArray?.[0];
    const payload = {
      uuid: values.uuid || "",
      name: values.name,
      type: { uuid: values.property_type_uuid },
      address: values.address,
      country: { uuid: values.country_uuid },
      city: { uuid: values.city_uuid },
      currency: { uuid: values.currency_uuid },
      email: values.email,
      phone: values.phone,
      checkInTime: values.checkInTime?.format("HH:mm:ss"),
      checkOutTime: values.checkOutTime?.format("HH:mm:ss"),
      timezone: values.timezone || "Asia/Yangon",
      setting: activeSetting
        ? { key: activeSetting.key, value: activeSetting.value }
        : undefined,
    };
    upsertMutate(payload);
  };

  const handleAdd = () => {
    setCurrentMode("add");
    setSelectedRow({ settingsArray: [] });
    setSelectedCountryUuid(null);
    setDrawerOpen(true);
  };

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          title="Property List"
          searchPlaceholder="Search Property ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Property"
          onAdd={handleAdd}
        />
      </div>

      <PropertyTable
        dataSource={properties}
        isLoading={isLoading}
        onEdit={(rec) => {
          setCurrentMode("edit");
          setDrawerOpen(true);
          handleGetDetail(rec.uuid);
        }}
        onView={(rec) => {
          setCurrentMode("view");
          setDrawerOpen(true);
          handleGetDetail(rec.uuid);
        }}
      />

      <PropertyForm
        open={drawerOpen}
        setOpen={setDrawerOpen} 
        setMode={setCurrentMode}
        onClose={() => setDrawerOpen(false)}
        mode={currentMode}
        initialValues={selectedRow}
        setInitialValues={setSelectedRow}
        loading={isLoadingDetail}
        isSaving={isSaving}
        propertyTypes={propertyTypes}
        countryOptions={countryOptions}
        cityOptions={cityOptions}
        currencyOptions={currencyOptions}
        onCountryChange={setSelectedCountryUuid}
        onFinish={handlePropertySubmit}
      />
    </div>
  );
};

export default PropertiesListing;