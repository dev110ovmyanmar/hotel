import { Table } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    align: "end",
  },
];

const data = [
  { key: 1, name: "John", phoneNumber: "091234567890" },
  { key: 2, name: "Jane", phoneNumber: "091234567890" },
];

const ContactPersonTable = () => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      size="small"
      pagination={false}
    />
  );
};

export default ContactPersonTable;
