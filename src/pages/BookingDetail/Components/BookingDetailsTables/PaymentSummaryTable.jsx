import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Card, Dropdown, Space, Table, Typography } from "antd";
import { IoCalendarClearOutline, IoCardOutline } from "react-icons/io5";

const { Text } = Typography;

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
    dataIndex: "updatedAt",
    key: "updatedAt",
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
    fixed:"end",
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

const PaymentSummaryTable = ({ data }) => {
  const CustomTitle = (
    <Space>
      <div className="payment-icon-box">
        <IoCardOutline style={{ color: "#a6b019", fontSize: "18px" }} />
      </div>
      <Text>Payment Summary</Text>
    </Space>
  );
  return (
    <Card title={CustomTitle} className="payment-card">
      <Table
        columns={columns}
        dataSource={data}
        size="small"
        pagination={false}
      />
    </Card>
  );
};

export default PaymentSummaryTable;
