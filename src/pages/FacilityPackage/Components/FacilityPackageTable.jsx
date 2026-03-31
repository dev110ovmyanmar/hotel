import { Dropdown, Space, Table } from "antd";
import { useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import FacilityPackageForm from "./FacilityPackageForm/FacilityPackageForm";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";
import PriceTag from "../../../component/PriceTag/PriceTag";

const FacilityPackageTable = ({
  data,
  page,
  setPage,
  perPage,
  total,
  changePage,
  changePerPage,
}) => {
  const { hasPermission } = usePermission();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState({});

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
    {
      title: "Facility",
      dataIndex: ["facility", "name"],
      key: "facility",
    },
    {
      title: "Price Type",
      dataIndex: ["pricingType", "name"],
      key: "pricingType",
    },
    {
      title: "Base Price (MMK)",
      dataIndex: "basePrice",
      key: "basePrice",
      render: (text) => <PriceTag value={text}/>
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
      render:(text) => <PriceTag value={text} />
    },
    {
      title: "Extra Pax Price",
      dataIndex: "extraPaxPrice",
      key: "extraPaxPrice",
      render:(text) => <PriceTag value={text} />
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
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.FACILITY_PACKAGE_EDIT,
            onClick: () => {
              setDrawerOpen(true);
              setMode("edit");
              setSelectedData(record);
            },
          },
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
    <div id="scrollId" className="w-full h-[63vh] ">
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
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

      <FacilityPackageForm
        page={page}
        setPage={setPage}
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        width={500}
      />
    </div>
  );
};

export default FacilityPackageTable;
