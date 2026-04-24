import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Dropdown, Space, Table } from "antd";

const columns = [
  {
    title: "Transition Id",
    dataIndex: "transitionId",
    key: "transitionId",
    width: 100,
  },
  {
    title: "Folio Id",
    dataIndex: "folioId",
    key: "folioId",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Pay By",
    dataIndex: "payBy",
    key: "payBy",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
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
          // permission: PERMISSIONS.,
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
          // permission: PERMISSIONS.,
          onClick: () => {
            setDrawerOpen(true);
            setMode("edit");
            setSelectedData(record);
          },
        },
      ];

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
const data = [
  {
    key: 1,
    transitionId: "11",
    folioId: "-",
    date: "11/11/2026",
    payBy: "Bank Transfer",
    amount: "10,000 MMK",
  },
  {
    key: 2,
    transitionId: "22",
    folioId: "-",
    date: "11/11/2026",
    payBy: "Cash",
    amount: "10,000 MMK",
  },
];

const PaymentSummaryTable = () => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      size="small"
      pagination={false}
    />
  );
};

export default PaymentSummaryTable;
