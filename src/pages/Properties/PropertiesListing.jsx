import React, { useState, useEffect } from "react";
import { Table, Drawer, Button, message, Input, Tag, Space, Card, Empty, Spin, Popconfirm } from "antd";
import { PlusOutlined, SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { fetchPropertiesData, createProperty, updateProperty, fetchPropertyDetail } from "../../api/propertyApi.js";
import { queryClient } from "../../app/queryClient.js";
import useApiQuery from "../../hooks/useApiQuery";
import Toast from "../../component/Toast/Toast.jsx";
import { useApiMutation } from "../../hooks/useApiMutation";
import usePropertiesColumns from "./usePropertiesColumns.jsx";
import PropertyForm from "./PropertyForm";
import SettingForm from "./SettingForm";
import ListHeader from "../../component/ListHeader/ListHeader.jsx";

const PropertiesListing = () => {
  // const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  //Listing Data Fetch
  const { data, isLoading, refetch } = useApiQuery({
    fetchQueryName: ["propertyData", keyword],
    fetchQueryFunction: () => fetchPropertiesData({ keyword }),
  });

  const properties = Array.isArray(data?.response?.data) ? data.response.data : [];

  const initData = queryClient.getQueryData(["initData", {}]);
  const propertyTypes = initData?.statuses?.property_type?.map(item => ({
    value: item.uuid,
    label: item.name,
  })) || [];

  // 2. Detail Fetch: Setting Array (id 1, 2, 3...)
  useEffect(() => {
    const getDetail = async () => {
      if (open && selectedRow?.uuid && (currentMode === "edit" || currentMode === "view")) {
        try {
          setIsLoadingDetail(true);
          const res = await fetchPropertyDetail(selectedRow.uuid);
          if (res.reasonCode === "200") {
            const rawData = res.response;
            
            rawData.settingsArray = rawData.settings?.map(s => ({
              uuid: s.uuid, // Existing Row UUID
              key: s.settingKey,
              value: s.settingValue
            })) || [];
            
            setSelectedRow(rawData);
          }
        } catch (err) {
          Toast.error("Failed to load details.");
        } finally {
          setIsLoadingDetail(false);
        }
      }
    };
    getDetail();
  }, [open, selectedRow?.uuid, currentMode]);

  const { mutate: upsertMutate, isLoading: isSaving } = useApiMutation({
    mutationFn: (payload) => payload.uuid ? updateProperty(payload.uuid, payload) : createProperty(payload),
    options: {
      onSuccess: () => {
        Toast.success(`Successfully saved.`);
        setOpen(false);
        refetch();
      },
      onError: (err) => Toast.error(err?.message || "Operation failed"),
    },
  });

  // 3. New Setting 
  const handleSettingFinish = (settingValues) => {
    const currentSettings = selectedRow?.settingsArray || [];
    // need to add with uuid to add more setting
    const newEntry = { ...settingValues, uuid: "" }; 
    
    setSelectedRow({ 
      ...selectedRow, 
      settingsArray: [...currentSettings, newEntry] 
    });
    setChildrenDrawer(false);
  };

  const removeSetting = (idx) => {
    const filtered = selectedRow.settingsArray.filter((_, i) => i !== idx);
    setSelectedRow({ ...selectedRow, settingsArray: filtered });
  };

  // 4 To Save Single Object Payload (Active Setting)
  const handlePropertySubmit = (values) => {
    const activeSetting = selectedRow?.settingsArray?.find(s => s.uuid === "") || 
                         selectedRow?.settingsArray?.[selectedRow.settingsArray.length - 1];

    if (!activeSetting) {
      Toast.warning("Please add at least one setting group.");
      return;
    }

    const payload = {
      uuid: values.uuid || "", // Property UUID
      name: values.name,
      type: { uuid: values.property_type_uuid },
      address: values.address || "",
      country: { uuid: values.country_uuid || "" },
      city: { uuid: values.city_uuid || "" },
      currency: { uuid: values.currency_uuid || "" },
      email: values.email || "",
      phone: values.phone || "",
      checkInTime: values.checkInTime?.format("HH:mm:ss") || "07:00:00",
      checkOutTime: values.checkOutTime?.format("HH:mm:ss") || "08:00:00",
      timezone: values.timezone || "Asia/Yangon",
      
      //API Format: Single Object for one row
      setting: {
        uuid: activeSetting.uuid || "", 
        key: activeSetting.key,
        value: activeSetting.value // Parsed JSON Object
      }
    };
    upsertMutate(payload);
  };

  const showDrawer = (record, mode) => {
    setSelectedRow(record ? { ...record, settingsArray: [] } : { settingsArray: [] });
    setCurrentMode(mode);
    setOpen(true);
  };

  const handleAdd = () => {
    showDrawer(null, "add")
  };

  return (
    <>
      {/* {contextHolder} */}
      <div className="p-6">
        {/* <Card title="Property Listing">
          <div className="flex justify-between mb-4">
            <Input 
              placeholder="Search Properties..." 
              prefix={<SearchOutlined />} 
              style={{ width: 300 }} 
              onChange={(e) => setKeyword(e.target.value)} 
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showDrawer(null, "add")}>
              Add Property
            </Button>
          </div> */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4 w-full px-6 py-2">
            <ListHeader
              title="Properties List"
              searchPlaceholder="Search Property ..."
              keyword={keyword}
              setKeyword={setKeyword}
              addButtonText=" Add Property"
              onAdd={handleAdd}
            />
          </div>
          <Table 
            columns={usePropertiesColumns((r) => showDrawer(r, "edit"), (r) => showDrawer(r, "view"))} 
            dataSource={properties} 
            rowKey="uuid" 
            loading={isLoading} 
          />
        {/* </Card> */}

        <Drawer
          title={currentMode === "add" ? "New Property" : "Property Details"}
          width={750} open={open} onClose={() => setOpen(false)}
          extra={currentMode !== "view" && (
            <Button type="primary" form="property-form" htmlType="submit" loading={isSaving}>
              Save All Data
            </Button>
          )}
        >
          <Spin spinning={isLoadingDetail}>
            <PropertyForm id="property-form" initialValues={selectedRow} onFinish={handlePropertySubmit} mode={currentMode} propertyTypes={propertyTypes} />
            <hr className="my-8" />
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Settings</h3>
              {currentMode !== "view" && (
                <Button type="dashed" icon={<PlusOutlined />} onClick={() => setChildrenDrawer(true)}>
                  Add New Setting
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {selectedRow?.settingsArray?.map((s, idx) => (
                <Card 
                  key={idx} 
                  size="small" 
                  title={<Tag color={s.uuid ? "blue" : "green"}>{s.key.toUpperCase()} {s.uuid ? "" : "(To be saved)"}</Tag>}
                  // extra={currentMode !== "view" && (
                  //   <Popconfirm title="Delete local card?" onConfirm={() => removeSetting(idx)}>
                  //     <Button type="text" danger icon={<DeleteOutlined />} />
                  //   </Popconfirm>
                  // )}
                >
                  <pre className="text-xs bg-gray-50 p-2 border rounded overflow-auto max-h-40">
                    {JSON.stringify(s.value, null, 2)}
                  </pre>
                </Card>
              ))}
              {(!selectedRow?.settingsArray || selectedRow.settingsArray.length === 0) && <Empty description="No configurations" />}
            </div>
          </Spin>

          <Drawer title="Setting Configuration" width={450} open={childrenDrawer} onClose={() => setChildrenDrawer(false)}>
            <SettingForm onFinish={handleSettingFinish} />
          </Drawer>
        </Drawer>
      </div>
    </>
  );
};

export default PropertiesListing;