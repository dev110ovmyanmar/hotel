import { Dropdown, Space, Table } from "antd";
import { useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons";
import { renderMatches, useLocation, useParams } from "react-router-dom";
import useApiQuery from "../../hooks/useApiQuery";
import { getFacilityDetails } from "../../api/facilityApi";
import { PERMISSIONS } from "../../variables/permission";
import usePermission from "../../hooks/usePermission";
import FacilityListPackageForm from "./Components/FacilityForm/FacilityListPackageForm";
import {capitalizeFirstLetter} from "../../utils/Utils";
import PriceTag from "../../component/PriceTag/PriceTag";

const FacilityListPackagesTable = ({
  page,
  setPage,
  perPage,
  total,
  changePage,
  changePerPage,
}) => {
  const { hasPermission } = usePermission();
  const location = useLocation();
  const { uuid } = location.state;
  const {name} = location.state;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState({});

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "facility-details",
    fetchQueryFunction: getFacilityDetails,
    params: { uuid },
    options: {
      enabled: !!uuid,
    },
  });

  const columns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    // {
    //   title: "Facility",
    //   dataIndex: ["facility", "name"],
    //   key: "facility",
    // },
    // {
    //   title: "Pricing Type",
    //   dataIndex: ["pricingType", "name"],
    //   key: "pricingType",
    // },
    {
      title: "Base Price",
      dataIndex: "basePrice",
      key: "basePrice",
      render:(text)=><PriceTag value={text}/>
    },
    {
      title: "Included Hours",
      dataIndex: "includedHours",
      key: "includedHours",
    },
    {
      title: "Included Pax",
      dataIndex: "includedPax",
      key: "includedPax",
    },
    {
      title: "Extra Hour Price",
      dataIndex: "extraHourPrice",
      key: "extraHourPrice",
      render:(text)=> <PriceTag value={text}/>
    },
    {
      title: "Extra Pax Price",
      dataIndex: "extraPaxPrice",
      key: "extraPaxPrice",
      render: (text) => <PriceTag value={text} />
    },
    {
      title: "Action",
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.FACILITY_PACKAGE_VIEW,
            onClick: () => {
              setDrawerOpen(true);
              setMode("view");
              setSelectedData(record);
            },
          },
          //   {
          //     key: "edit",
          //     label: "Edit",
          //     icon: <EditOutlined style={{ fontSize: "12px" }} />,
          //     // permission: PERMISSIONS.FACILITY_PACKAGE_EDIT,
          //     onClick: () => {
          //       setDrawerOpen(true);
          //       setMode("edit");
          //       setSelectedData(record);
          //     },
          //   },
        ];

        // Filter actions by permission
        const items = actions
          .filter(
            (action) => !action.permission || hasPermission(action.permission),
          )
          .map((action) => ({
            key: action.key,
            label: (
              <Space size={4} style={smallStyle} onClick={action.onClick}>
                {action.icon}
                <span style={{ fontSize: "14px" }}>{action.label}</span>
              </Space>
            ),
          }));

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <MoreOutlined style={{ fontSize: "16px" }} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div id="scrollId" className="w-full h-[63vh] px-6 py-2">
      <div className="text-lg mb-3">{capitalizeFirstLetter(name)}</div>

      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data?.facilityPackages}
        rowKey="uuid"
        pagination={{
          current: page,
          pageSize: perPage,
          total: total,
          onChange: (page, perPage) => {
            changePage(page);
            changePerPage(perPage);
          },
          showSizeChanger: true,
        }}
      />

      <FacilityListPackageForm
        page={page}
        setPage={setPage}
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />
    </div>
  );
};

export default FacilityListPackagesTable;
