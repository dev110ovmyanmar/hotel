import { useState } from "react";
import { Space, Table, Drawer, Button, Dropdown } from "antd";
import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import FloorForm from "./FloorForm/FloorForm";
import { fetchFloor } from "../../../api/floorApi";
import useApiQuery from "../../../hooks/useApiQuery";
import ListHeader from "../../../component/ListHeader/ListHeader";

const FloorTable = ({ mode }) => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState(mode);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");

  const { data, isLoading, refetch } = useApiQuery({
    fetchQueryName: "floorData",
    fetchQueryFunction: fetchFloor,
    params: {
      keyword,
      pagination: {
        page: page,
        perPage: perPage,
      },
    },
  });

  const floorList = data?.data || [];
  const total = data?.total || 0;

  const showDrawer = (record, actionMode) => {
    setSelectedRow(record);
    setCurrentMode(actionMode);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleAdd = () => {
    setSelectedRow(null);
    setCurrentMode("add");
    setOpen(true);
  };

  const isView = currentMode === "view";
  const isEdit = currentMode === "edit";
  const isAdd = currentMode === "add";

  const DrawerTitle = isView
    ? "View Floor"
    : isEdit
      ? "Edit Floor"
      : isAdd
        ? "Create Floor"
        : "";

  const columns = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      // width:"20px"
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Floor No",
      dataIndex: "floorNo",
      key: "floorNo",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Dropdown
            menu={{
              onClick: ({ key }) => {
                if (key === "1") {
                  showDrawer(record, "view");
                }
                if (key === "2") {
                  showDrawer(record, "edit");
                }
              },
              items: [
                { key: "1", label: "View", icon: <EyeOutlined /> },
                { key: "2", label: "Edit", icon: <EditOutlined /> },
              ],
            }}
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          title="Floor List"
          searchPlaceholder="Search Floor ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Floor"
          onAdd={handleAdd}
        />
      </div>

      <Table
        columns={columns}
        dataSource={floorList}
        loading={isLoading}
        rowKey={(record) => record.id || record._id}
        pagination={{
          current: page,
          pageSize: perPage,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          onChange: (newPage, newSize) => {
            setPage(newPage);
            setPerPage(newSize);
          },
        }}
      />

      <Drawer title={DrawerTitle} onClose={onClose} open={open} width={500}>
        <FloorForm
          initialValues={selectedRow}
          mode={currentMode}
          onSuccess={() => {
            refetch();
            onClose();
          }}
        />
      </Drawer>
    </>
  );
};

export default FloorTable;
