
import React, { useRef, useCallback } from 'react';
import { Table, Spin } from 'antd';
import { AiOutlineDesktop } from 'react-icons/ai';

const ActiveAdmins = ({
  activeAdminDatas,
  isFetching,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage

}) => {
  const scrollRef = useRef(null);

  // Flatten all pages into single array
  const sessions = activeAdminDatas?.pages?.flatMap(page => page?.data || []) || [];
  console.log(sessions, "SessionInActiveAdmins")
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: text => <div>{text}</div>,
    },
    {
      title: 'Admin Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <div>{text}</div>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: text => <div>{text}</div>,
    }
  ];

  // Handle scroll to load more
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;

    console.log('Scroll distance to bottom:', distanceToBottom);

    if (distanceToBottom < 50) {
      console.log('Fetching next page...');
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sessionColumns = [
    {
      title: "Device",
      key: "device",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <AiOutlineDesktop fontSize={20} />

          <span>
            {record.device?.deviceName ||
              "Unknown"}
          </span>
        </div>
      ),
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
    },
    {
      title: "Request Origin",
      dataIndex: "requestOrigin",
      key: "requestOrigin",
    },
  ];


  const expandedRowRender = (record) => {
    return (
      <Table
        className="expanded-table dark:[&_.ant-table-thead>tr>th]:!text-[#F3F4F6]  [&_.ant-table-pagination]:!mt-8"
        columns={sessionColumns}
        dataSource={record?.sessions || []}
        rowKey={(session) => session.uuid}
        pagination={false}
        size="small"
        style={{ margin: "16px" }}
      />
    );
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="w-full h-[400px] overflow-auto"
      id="scrollId"
    >
      <Table
        tableLayout="fixed"
        columns={columns}
        dataSource={sessions}
        rowKey={(record) => record.uuid}
        pagination={false}
        loading={isFetching}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record?.sessions.length > 0,
        }}
      />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Spin tip="Loading more..." />
        </div>
      )}
      {!hasNextPage && (
        <div className="text-center text-gray-400 py-4">
          No more data
        </div>
      )}
    </div>
  );
};

export default ActiveAdmins;
