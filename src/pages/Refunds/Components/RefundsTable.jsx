import { Table } from 'antd';
import ColorStatusTag from '../../../component/ColorStatusTag/ColorStatusTag';
import PriceTag from '../../../component/PriceTag/PriceTag';


const RefundsTable = ({ data, page, perPage, total, changePage, changePerPage, loading }) => {

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Guest Name',
      key: 'guestName',
      render: (_, record) => <div>{record?.guest?.fullName || '-'}</div>,
    },
    {
      title: 'Folio No',
      key: 'folioNo',
      render: (_, record) => <div>{record?.folio?.folioNo || '-'}</div>,
    },
    {
      title: 'Res No',
      key: 'reservationNo',
      render: (_, record) => <div>{record?.reservation?.reservationNo || '-'}</div>,
    },
    {
      title: 'Payment Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (text) => <div>{text || '-'}</div>,
    },
    {
      title: 'Amount (MMK)',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount, record) => <PriceTag value={amount}/>
    },
    {
      title: 'Payment Method',
      key: 'paymentMethod',
      width: 100,
      render: (_, record) => <div>{record?.paymentMethod?.name || '-'}</div>,
    },
    {
      title: 'Payment Type',
      key: 'paymentType',
      width: 100,
      render: (_, record) => <div>{record?.paymentType?.name || '-'}</div>,
    },
    {
      title: 'Status',
      key: 'paymentStatus',
      render: (_, record) => {
        const statusForTag = {
          code: record?.paymentStatus?.code,
          name: record?.paymentStatus?.name,
        };
        return <ColorStatusTag status={statusForTag} />;
      }
    },
  ];

  return (
    <div id="scrollId" className="w-full">
      <Table
        tableLayout="fixed"
        scroll={{x: 1000}}
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
            changePerPage(perPage);
          },
          showSizeChanger: true
        }}
      />
    </div>
  );
};

export default RefundsTable;
