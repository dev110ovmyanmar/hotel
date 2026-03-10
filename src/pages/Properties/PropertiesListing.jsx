import React, { useState, useMemo } from "react";
import { fetchPropertiesData, createProperty, updateProperty, fetchPropertyDetail } from "../../api/propertyApi.js";
import { queryClient } from "../../app/queryClient.js";
import useApiQuery from "../../hooks/useApiQuery";
import { useApiMutation } from "../../hooks/useApiMutation";
import Toast from "../../component/Toast/Toast.jsx";
import PropertyTable from "./components/PropertyTable.jsx";
import PropertyForm from "./components/PropertyForm.jsx";
import ListHeader from "../../component/ListHeader/ListHeader.jsx";
import dayjs from "dayjs";

const PropertiesListing = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [selectedCountryUuid, setSelectedCountryUuid] = useState(null);

  const timezone = dayjs.tz.guess();
  console.log("Time Zone", timezone);

  const formattedTimezone = timezone === "Asia/Rangoon" ? "Asia/Yangon" : timezone; // Timezone format

  const { data, isLoading, refetch } = useApiQuery({
    fetchQueryName: ["propertyData", keyword],
    fetchQueryFunction: () => fetchPropertiesData({ keyword }),
  });

  const properties = Array.isArray(data?.response?.data) ? data.response.data : [];
  const initData = queryClient.getQueryData(["initData", {}]);

  // Dynamic Options
  const propertyTypes = useMemo(() => initData?.statuses?.property_type?.map(item => ({ value: item.uuid, label: item.name })) || [], [initData]);
  const countryOptions = useMemo(() => initData?.locations?.map(item => ({ value: item.uuid, label: item.name })) || [], [initData]);
  const currencyOptions = useMemo(() => initData?.currencies?.map(item => ({ value: item.uuid, label: item.code })) || [], [initData]);
  
  const cityOptions = useMemo(() => {
    if (!selectedCountryUuid || !initData?.locations) return [];
    return initData.locations.find(loc => loc.uuid === selectedCountryUuid)?.city?.map(c => ({ value: c.uuid, label: c.name })) || [];
  }, [selectedCountryUuid, initData]);

  const { mutate: upsertMutate, isPending: isSaving } = useApiMutation({
    mutationFn: (payload) => payload.uuid ? updateProperty(payload.uuid, payload) : createProperty(payload),
    options: {
      onSuccess: () => {
        Toast.success(`Successfully saved.`);
        setDrawerOpen(false);
        refetch();
      },
      onError: (err) => Toast.error(err?.response?.data?.error?.text || "Operation failed"),
    },
  });

  const handleGetDetail = async (uuid) => {
    setIsLoadingDetail(true);
    try {
      const res = await fetchPropertyDetail(uuid);
      if (res.reasonCode === "200") {
        const rawData = res.response;
        rawData.settingsArray = rawData.settings?.map(s => ({ uuid: s.uuid, key: s.settingKey, value: s.settingValue })) || [];
        setSelectedRow(rawData);
        if (rawData.country?.uuid) setSelectedCountryUuid(rawData.country.uuid);
      }
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handlePropertySubmit = (values) => {
    // const activeSetting = selectedRow?.settingsArray?.[0];
    const isSettingUpdate = !!values.setting; 

    let payload;

    if(isSettingUpdate){
      payload = {
        uuid: values.uuid || "",
        name: values.name,
        type: { uuid: values.property_type_uuid },
        address: values.address,
        country: { uuid: values.country_uuid },
        city: { uuid: values.city_uuid },
        currency: { uuid: values.currency_uuid },
        email: values.email,
        phone: values.phone,
        checkinTime: values.checkinTime?.format("HH:mm:ss"),
        checkoutTime: values.checkoutTime?.format("HH:mm:ss"),
        timezone: formattedTimezone,
        setting: {
          // uuid: values.setting.uuid,
          key: values.setting.key,
          value: values.setting.value
        }
      };
    }else{
      // Full property payload
    const activeSetting = selectedRow?.settingsArray?.[0];
      payload = {
      uuid: values.uuid || "",
      name: values.name,
      type: { uuid: values.property_type_uuid },
      address: values.address,
      country: { uuid: values.country_uuid },
      city: { uuid: values.city_uuid },
      currency: { uuid: values.currency_uuid },
      email: values.email,
      phone: values.phone,
      checkinTime: values.checkinTime?.format("HH:mm:ss"),
      checkoutTime: values.checkoutTime?.format("HH:mm:ss"),
      timezone: formattedTimezone,
      setting: activeSetting ? {
        key: activeSetting.key,
        value: activeSetting.value
      } : undefined
    };
  };
    upsertMutate(payload);
}


  // Define the add handler separately for cleanliness
  const handleAdd = () => {
    setCurrentMode("add");
    setSelectedRow(null);
    setSelectedCountryUuid(null);
    setDrawerOpen(true);
  };

  //value for viewing "Add Property" button or not
  const showButton = properties.length === 0 ? false : true;


  return (
    <div className="p-6">
    <ListHeader 
        title="Properties List" 
        keyword={keyword} 
        setKeyword={setKeyword}
        searchPlaceholder="Search Property..."
        onAdd={handleAdd}
        showButton={false}
        addButtonText={"Add Property"}
    />

      <PropertyTable dataSource={properties} loading={isLoading} 
        onEdit={(rec) => { setCurrentMode("edit"); setDrawerOpen(true); handleGetDetail(rec.uuid); }}
        onView={(rec) => { setCurrentMode("view"); setDrawerOpen(true); handleGetDetail(rec.uuid); }}
      />
      <PropertyForm
        open={drawerOpen}
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