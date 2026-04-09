import { AiOutlineCopy } from "react-icons/ai";
import { Dropdown, Space, Table, Tag, Button } from 'antd';
import { useState } from "react";
import { MoreOutlined } from '@ant-design/icons';
import PolicyForm from './PolicyForm/PolicyForm';
import { EyeOutlined } from '@ant-design/icons';
import { EditOutlined } from '@ant-design/icons';
import { useApiMutation } from './../../../hooks/useApiMutation';
import { createPolicyDuplicate } from './../../../api/policyApi';
import Toast from './../../../component/Toast/Toast';

const PolicyTable = ({ data, page, setPage, perPage, total, changePage, changePerPage, loading }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState({});

  const duplicatePolicy = useApiMutation({
    mutationFn: createPolicyDuplicate,
    invalidateKeys: [["policies"]],
    page: page
  });

  const duplicateClick = (uuid) => {
    duplicatePolicy.mutate(uuid, {
      onSuccess: () => {
        Toast.success("Duplicated Successfully")
      }
    })
  }

  const columns = [
    {
      title: 'ID',
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <div>{text}</div>,
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      render: text => <div>{text}</div>,
    },
    {
      title: 'Is Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: text => <div className={text === true ? "text-[#389E0D]" : "text-[#CF1322]"}>{text === true ? "True" : "False"}</div>,
    },
    {
      title: 'Policy Type',
      dataIndex: ["policyType", "name"],
      key: 'policyType',
      render: text => <div>{text}</div>,
    },
    {
      title: 'Link To',
      dataIndex: ["linkTo", "name"],
      key: 'linkTo',
      render: text => <div>{text}</div>,
    },
    {
      title: "Action",
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const items = [
          {
            key: "1",
            label: (
              <Space
                size={4}
                style={smallStyle}
                onClick={() => {
                  setDrawerOpen(true);
                  setMode("view");
                  setSelectedData(record);
                }}
              >
                <EyeOutlined style={{ fontSize: "12px" }} />
                <span style={{ fontSize: "14px" }}>View</span>
              </Space>
            ),
          },
          {
            key: "2",
            label: (
              <Space
                size={4}
                style={smallStyle}
                onClick={() => {
                  setDrawerOpen(true);
                  setMode("edit");
                  setSelectedData(record);
                }}
              >
                <EditOutlined style={{ fontSize: "12px" }} />
                <span style={{ fontSize: "14px" }}>Edit</span>
              </Space>
            ),
          },
          record?.isDuplicate &&
          {
            key: "3",
            label: (
              <Space
                size={4}
                style={smallStyle}
                onClick={() => {
                  duplicateClick(record?.uuid)
                }}
              >
                <AiOutlineCopy style={{ fontSize: "12px" }} />
                <span style={{ fontSize: "14px" }}>Duplicate</span>
              </Space>
            ),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <MoreOutlined style={{ fontSize: "16px" }} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div id="scrollId" className="w-full h-[63vh] " >
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="uuid"
        pagination={{
          current: page,
          pageSize: perPage,
          total: total,
          onChange: (page, perPage) => {
            changePage(page);
            changePerPage(perPage)
          },
          showSizeChanger: true
        }}
      />

      <PolicyForm
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
  )
};


export default PolicyTable;