
import React, { useRef, useCallback } from 'react';
import { Table, Spin } from 'antd';
import { AiOutlineDesktop } from 'react-icons/ai';
import useInfiniteApiQuery from '../../hooks/useInfiniteApiQuery';
import { activeAdmins } from '../../api/nightAuditApi';

const ActiveAdmins = ({
  activeAdminDatas,
  isLoading,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage

}) => {
  const scrollRef = useRef(null);

  // Flatten all pages into single array
  const sessions = activeAdminDatas?.pages?.flatMap(page => page?.data || []) || [];

  const columns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      width: 60,
      render: text => <div>{text}</div>,
    },
    {
      title: 'Admin Name',
      dataIndex: 'adminName',
      key: 'adminName',
      render: text => <div>{text}</div>,
    },
    {
      title: 'Device Name',
      dataIndex: 'deviceName',
      key: 'deviceName',
      render: text => (
        <div className="flex items-center gap-1 justify-end">
          <AiOutlineDesktop fontSize={20} />
          <span>{text}</span>
        </div>
      ),
      align: "right"
    },
  ];

  const dataSource = sessions.map((session, index) => ({
    key: session.uuid || String(index + 1),
    no: index + 1,
    adminName: session.admin?.name || 'Unknown',
    deviceName: session.device?.deviceName || 'Unknown',
  }));

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

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="w-full h-[400px] overflow-auto"
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        pagination={false}
        loading={isLoading}
      />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Spin tip="Loading more..." />
        </div>
      )}
      {!hasNextPage && sessions.length > 0 && (
        <div className="text-center text-gray-400 py-4">
          No more data
        </div>
      )}
    </div>
  );
};

export default ActiveAdmins;
