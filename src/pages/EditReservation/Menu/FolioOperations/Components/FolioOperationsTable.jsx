import React, { useState, useEffect } from "react";
import { Button, Divider, Modal, Radio, Space, Table } from "antd";
import { SwapOutlined, InfoCircleOutlined, FolderOpenOutlined, PrinterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { darkModeStyle, houseKeepingAndMaintenanceRequestDarkMode, partnerDarkModeStyle, selectedDarkMode, textColorDarkMode, textWhiteInDarkStyle } from "../../../../../utils";


const FolioTitle = ({ rest }) => (
  <span>
    <span
    >
      Folio
    </span>
    {rest}
  </span>
);

const SubFolioTable = ({ record, lineColumns, onMoveTo, isTransferring }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const lines = record.folioLines || [];

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [lines]);

  const isFolioClosed = record.closedAt !== null && record.closedAt !== undefined;

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
    getCheckboxProps: () => ({
      disabled: isFolioClosed,
    }),
  };

  // Calculate totals
  const totalDebit = lines
    .filter((line) => line.postingType === "debit")
    .reduce((sum, line) => sum + (Number(line.grandTotal) || 0), 0);

  const totalCredit = lines
    .filter((line) => line.postingType === "credit")
    .reduce((sum, line) => sum + (Number(line.grandTotal) || 0), 0);

  const totalBalance = totalDebit - totalCredit;

  const summary = () => (
    <Table.Summary fixed className="bg-gray-50 font-semibold" {...darkModeStyle} {...textWhiteInDarkStyle} {...textColorDarkMode}>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} />
        <Table.Summary.Cell index={1} />
        <Table.Summary.Cell index={2} />
        <Table.Summary.Cell index={3} >Total </Table.Summary.Cell>
        <Table.Summary.Cell index={3} align="right">
          {totalDebit > 0 ? `${totalDebit.toLocaleString()}` : "-"}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={4} align="right">
          {totalCredit > 0 ? `${totalCredit.toLocaleString()}` : "-"}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={6} align="right">
          {`${totalBalance.toLocaleString()}`}
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        gap: "10px",
        padding: "8px",
        borderTop: "1px solid #e8e8e8",
      }}>
        <Button onClick={() => setSelectedRowKeys([])}>Cancel</Button>
        <Button
          type="primary"
          disabled={selectedRowKeys.length === 0 || isTransferring}
          onClick={() => onMoveTo(record, selectedRowKeys)}
        >
          Move To
        </Button>
      </div>
      <Table
        className="nested-folio-table expanded-table dark:[&_.ant-table-thead>tr>th]:!text-[#F3F4F6] "
        rowSelection={rowSelection}
        columns={lineColumns}
        dataSource={lines}
        rowKey="id"
        pagination={false}
        size="small"
        bordered
        summary={summary}
      />
    </div>
  );
};

const FolioOperationsTable = ({
  dataSource,
  isFolioLineIsEmpty,
  onTransferLines,
  isTransferring,
  onPrintFolio
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFolio, setSelectedFolio] = useState(null);
  const [selectedLineIds, setSelectedLineIds] = useState([]);
  const [targetFolioUuid, setTargetFolioUuid] = useState(null);

  const lineColumns = [
    {
      title: "No",
      dataIndex: "lineNo",
      key: "lineNo",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Description",
      dataIndex: "descriptionSnapshot", // Fixed: 'description' is null, 'descriptionSnapshot' contains the text
      key: "descriptionSnapshot",
      render: (_, record) => record.descriptionSnapshot || "-",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "right",
      render: (_, record) =>
        record.quantity !== undefined && record.quantity !== null
          ? record.quantity
          : "-",
    },
    {
      title: "Debit (MMK)",
      dataIndex: "grandTotal",
      key: "grandTotal",
      align: "right",
      render: (_, record) => {
        if (record.postingType !== "debit") return "-";
        const val = record.grandTotal;
        return val !== undefined && val !== null
          ? `${Number(val).toLocaleString()}`
          : "-";
      },
    },
    {
      title: "Credit (MMK)",
      dataIndex: "grandTotal",
      key: "grandTotal",
      align: "right",
      render: (_, record) => {
        if (record.postingType !== "credit") return "-";
        const val = record.grandTotal;
        return val !== undefined && val !== null
          ? `${Number(val).toLocaleString()}`
          : "-";
      },
    },
    {
      title: "Balance (MMK)",
      key: "balance",
      align: "right",
      render: (_, record) => {
        const val = record.grandTotal;
        if (val === undefined || val === null) return "-";
        const balance = record.postingType === "credit" ? -val : val;
        return `${Number(balance).toLocaleString()}`;
      },
    }
  ];

  const columns = [
    {
      title: <FolioTitle rest=" No" />,
      dataIndex: "folioNo",
      key: "folioNo",
      width: 200,
    },
    {
      title: "Owner Type",
      key: "type",
      render: (_, record) => record.folioOwnerType?.name || "-",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          // <Button onClick={() => onPrintFolio && onPrintFolio(record)}>
          //   <PrinterOutlined />
          // </Button>
          //  <Button onClick={() => onPrintFolio && onPrintFolio(record)}>
          <PrinterOutlined onClick={() => onPrintFolio && onPrintFolio(record)} />
          // </Button>
        )
      }
    }
  ];

  // Expandable: render folioLines as a nested table
  const expandedRowRender = (record) => {
    return (
      <SubFolioTable
        record={record}
        lineColumns={lineColumns}
        isTransferring={isTransferring}
        onMoveTo={(sourceFolio, lineIds) => {
          setSelectedFolio(sourceFolio);
          setSelectedLineIds(lineIds);
          setTargetFolioUuid(null);
          setModalOpen(true);
        }}
      />
    );
  };

  const handleTransferSubmit = () => {
    if (!selectedFolio || !targetFolioUuid || selectedLineIds.length === 0) {
      return;
    }
    if (onTransferLines) {
      onTransferLines(
        {
          destinationFolioUuid: targetFolioUuid,
          folioLineIds: selectedLineIds,
        },
        () => {
          setModalOpen(false);
          setSelectedFolio(null);
          setSelectedLineIds([]);
          setTargetFolioUuid(null);
        }
      );
    }
  };

  return (
    <>
      <div
        style={{
          border: "1px solid #e8e8e8",
          borderRadius: 8,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={false}
          bordered={false}
          size="middle"
          className="custom-folio-table"
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => record.folioLines && record.folioLines.length > 0,
          }}
        />
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
              <SwapOutlined className="text-lg animate-pulse" />
            </div>
            <div>
              <h3 className={`text-base font-semibold text-gray-800 leading-none m-0 ${textColorDarkMode}`}>Transfer Folio Lines</h3>
              <p className={`text-xs text-gray-500 font-normal mt-1 ${textWhiteInDarkStyle}`}>Move selected line items to another folio</p>
            </div>
          </div>
        }
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setSelectedFolio(null);
          setSelectedLineIds([]);
          setTargetFolioUuid(null);
        }}
        closable={true}
        onOk={handleTransferSubmit}
        confirmLoading={isTransferring}
        okButtonProps={{
          disabled: !targetFolioUuid,
          className: "bg-blue-600 hover:bg-blue-700 border-none font-medium px-5 rounded-lg"
        }}
        cancelButtonProps={{
          className: "rounded-lg border-gray-200 hover:text-blue-600 hover:border-blue-500"
        }}
        okText="Submit"
        centered
        width={420}
        className="custom-ant-modal"
      >
        <div className="py-4">
          {/* Info Banner */}
          <div className={`bg-blue-50/60 border border-blue-100 rounded-xl p-3 mb-4 flex items-start gap-2.5 mx-2 ${darkModeStyle}`}>
            <InfoCircleOutlined className="text-blue-500 mt-0.5 text-sm flex-shrink-0" />
            <div className="text-xs text-blue-800 leading-relaxed">
              Moving <strong className="text-blue-900">{selectedLineIds.length}</strong> selected line item{selectedLineIds.length !== 1 ? 's' : ''} from <strong className="text-blue-900">{selectedFolio?.folioNo}</strong>.
            </div>
          </div>

          <div className={`mb-2 text-xs font-semibold text-gray-500 tracking-wider mx-2 ${textWhiteInDarkStyle}`}>
            Select Target Folio
          </div>

          {/* Card Selection List */}
          <div className={`max-h-[280px] overflow-y-auto pr-1 py-1 flex flex-col gap-2.5 custom-scrollbar `}>
            {dataSource
              ?.filter((folio) => !selectedFolio || folio.id !== selectedFolio.id)
              ?.map((folio) => {
                const isSelected = targetFolioUuid === folio.uuid;
                const isClosed = folio.closedAt !== null && folio.closedAt !== undefined;
                const currency = folio.currency?.code || "MMK";
                const amountText = folio.grandTotal !== undefined
                  ? `${Number(folio.grandTotal).toLocaleString()} ${currency}`
                  : "-";

                return (
                  <div
                    key={folio.id}
                    onClick={() => !isClosed && setTargetFolioUuid(folio.uuid)}
                    className={`
                      group relative flex items-center justify-between p-3 rounded-xl border transition-all duration-200 mx-2
                      ${isClosed
                        ? 'border-gray-200 bg-gray-50/50 opacity-60 cursor-not-allowed'
                        : isSelected
                          ? 'border-blue-500 bg-blue-50/40 shadow-sm ring-1 ring-blue-500 cursor-pointer'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50/50 cursor-pointer'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {!isClosed && (
                        <Radio
                          checked={isSelected}
                          value={folio.uuid}
                          className="m-0 pointer-events-none"
                        />
                      )}
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-sm ${isClosed ? 'text-gray-400' : 'text-gray-800 group-hover:text-blue-600'} transition-colors ${textColorDarkMode}`}>
                          {folio.folioNo}
                        </span>
                        {isClosed && (
                          <span className="text-xs text-gray-500 bg-gray-200 border border-gray-300 rounded-full px-2 py-0.5">
                            It is paid
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FolioOperationsTable;
