import React, { useState, useEffect } from "react";
import { Alert, Button, Divider, Dropdown, Modal, Radio, Space, Spin, Table, Tag } from "antd";
import {
  SwapOutlined,
  InfoCircleOutlined,
  FolderOpenOutlined,
  PrinterOutlined,
  FileSearchOutlined,
  EditOutlined,
  CheckOutlined,
  FundViewOutlined,
  MoreOutlined,
  WarningOutlined,
  LoadingOutlined,
  CrownOutlined,
  BranchesOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  darkModeStyle,
  textColorDarkMode,
  textWhiteInDarkStyle,
} from "../../../../../utils";
import { SlCalculator } from "react-icons/sl";
import { AiOutlineHdd } from "react-icons/ai";
import PriceTag from "../../../../../component/PriceTag/PriceTag";
import AdjustmentDrawer from "./AdjustmentDrawer";
import RebateDrawer from "./RebateDrawer";
import VoidDrawer from "./VoidDrawer";
import FolioEditFormDrawer from "./FolioEditFormDrawer";
import Toast from "../../../../../component/Toast/Toast";
import FinancialStatusTag from "../../../../../component/FinancialStatusTag/FinancialStatusTag";


const FolioTitle = ({ rest }) => (
  <span>
    <span>Folio</span>
    {rest}
  </span>
);

const SubFolioTable = ({ record, lineColumns, onMoveTo, isTransferring }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const lines = record.folioLines || [];

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [lines]);

  const isFolioClosed =
    record.closedAt !== null && record.closedAt !== undefined;

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
    hideSelectAll: true,
    getCheckboxProps: (record) => ({
      disabled: isFolioClosed 
      // || !!record.voidedAt,
    }),
  };

  const totalDebit = lines
    .filter((line) => line.postingType === "debit" && !line.voidedAt)
    .reduce((sum, line) => sum + (Number(line.grandTotal) || 0), 0);

  const totalCredit = lines
    .filter((line) => line.postingType === "credit" && !line.voidedAt)
    .reduce((sum, line) => sum + (Number(line.grandTotal) || 0), 0);

  const totalBalance = totalDebit - totalCredit;

  const summary = () => (
    <Table.Summary
      fixed
      className="bg-gray-50 dark:bg-gray-800 font-semibold"
      {...darkModeStyle}
      {...textWhiteInDarkStyle}
      {...textColorDarkMode}
    >
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} />
        <Table.Summary.Cell index={1} />
        <Table.Summary.Cell index={2} />
        <Table.Summary.Cell index={3} />
        <Table.Summary.Cell index={4} />
        <Table.Summary.Cell index={5} />
        <Table.Summary.Cell index={6}>Total</Table.Summary.Cell>
        <Table.Summary.Cell index={7} align="right">
          {totalDebit > 0 ? (
            <PriceTag value={Number(totalDebit)} />
          ) : (
            <PriceTag value={0} />
          )}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={8} align="right">
          {totalCredit > 0 ? (
            <PriceTag value={Number(totalCredit)} />
          ) : (
            <PriceTag value={0} />
          )}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={9} align="right">
          <PriceTag value={Number(totalBalance)} />
        </Table.Summary.Cell>
        <Table.Summary.Cell index={10} />
      </Table.Summary.Row>
    </Table.Summary>
  );

  return (
    <div>
      <div className="flex justify-end items-center gap-2.5 p-2 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={() => setSelectedRowKeys([])}
          disabled={selectedRowKeys.length === 0 || isTransferring}
          className={`rounded-lg ${selectedRowKeys.length === 0 || isTransferring
              ? "text-gray-400"
              : "text-gray-700 dark:text-gray-300 hover:border-blue-500"
            }`}
        >
          Cancel
        </Button>

        <Button
          type="primary"
          disabled={selectedRowKeys.length === 0 || isTransferring}
          onClick={() => onMoveTo(record, selectedRowKeys)}
          className={`rounded-lg ${selectedRowKeys.length === 0 || isTransferring
              ? "bg-gray-300 dark:bg-gray-600"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          Move To
        </Button>
      </div>
      <Table
        className="nested-folio-table expanded-table dark:[&_.ant-table-thead>tr>th]:!text-[#F3F4F6]"
        rowSelection={rowSelection}
        columns={lineColumns}
        dataSource={lines}
        rowKey="id"
        pagination={false}
        size="small"
        bordered
        summary={summary}
        rowClassName={(record) => {
          const classes = [];
          if (record.voidedAt) classes.push('void-folioLine-row');
          const isChildLine = !!record.parentLineId;
          const hasExcludedItemType = [
            'tax', 
            'service_charge', 
            'discount', 
            'incentive',
            'adjustment',
            'rebate'
          ].includes(record.itemType);
          if (isChildLine && hasExcludedItemType) classes.push('hide-checkbox-row');
          return classes.join(' ');
        }}
      />
    </div>
  );
};

const FolioOperationsTable = ({
  dataSource,
  isFolioLineIsEmpty,
  onTransferLines,
  isTransferring,
  onPrintFolio,
  printingFolioUuid = null,
  onAdjustLine,
  isAdjusting = false,
  onRebateLine,
  isRebating = false,
  onVoidLine,
  isVording = false
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFolio, setSelectedFolio] = useState(null);
  const [selectedLineIds, setSelectedLineIds] = useState([]);
  const [targetFolioUuid, setTargetFolioUuid] = useState(null);
  const [adjustmentDrawerOpen, setAdjustmentDrawerOpen] = useState(false);
  const [rebatDrawerOpen, setRebateDrawerOpen] = useState(false);
  const [voidDrawerOpen, setVoidDrawerOpen] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [folioEditDrawerOpen, setFolioEditDrawerOpen] = useState(false);
  const [selectedFolioForEdit, setSelectedFolioForEdit] = useState(null);

  // Updated lineColumns with Adjustment column
  const lineColumns = [
    {
      title: "No",
      dataIndex: "lineNo",
      key: "lineNo",
      align: "center",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Date",
      dataIndex: "chargeDate",
      key: "chargeDate",
      align: "center",
      width: 110,
      render: (_, record) => dayjs(record?.chargeDate).format("YYYY-MM-DD"),
    },
    {
      title: "Description",
      dataIndex: "descriptionSnapshot",
      key: "descriptionSnapshot",
      width: 280,
      render: (_, record) => record.descriptionSnapshot || "-",
    },
    {
      title: "Relation",
      dataIndex: "parentLineId",
      key: "parentLineId",
      align: "center",
      width: 110,
      render: (_, record) => {
        const isChild = record?.parentLineId != null;
        return isChild ? (
          <Tag
            icon={<LinkOutlined />}
            color="processing"
            style={{ borderRadius: "9999px" }}
            className="px-3 py-0.5 text-xs font-medium"
          >
            Child of #{record.parentLineId}
          </Tag>
        ) : (
          <Tag
            icon={<BranchesOutlined />}
            color="warning"
            style={{ borderRadius: "9999px" }}
            className="px-3 py-0.5 text-xs font-semibold"
          >
            Parent #{record.id}
          </Tag>
        );
      },
    },
    {
      title: "Room",
      dataIndex: "room",
      align: "center",
      width: 110,
      key: "room",
      render: (_, record) => record.reservationRoom?.room?.roomNo || "-",
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
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
        if (record.postingType !== "debit") return <PriceTag value={0} />;
        const val = Number(record.grandTotal);
        return val !== undefined && val !== null ? (
          <PriceTag value={val} />
        ) : (
          <PriceTag value={0} />
        );
      },
    },
    {
      title: "Credit (MMK)",
      dataIndex: "grandTotal",
      key: "grandTotal",
      align: "right",
      render: (_, record) => {
        if (record.postingType !== "credit") return <PriceTag value={0} />;
        const val = Number(record.grandTotal);
        return val !== undefined && val !== null ? (
          <PriceTag value={val} />
        ) : (
          <PriceTag value={0} />
        );
      },
    },
    {
      title: "Balance (MMK)",
      key: "balance",
      align: "right",
      render: (_, record) => {
        const val = Number(record.grandTotal);
        if (val === undefined || val === null) return <PriceTag value={0} />;
        const balance = record.postingType === "credit" ? -val : val;
        return <PriceTag value={balance} />;
      },
    },
    {
      title: "Action",
      key: "adjust",
      align: "center",
      width: 50,
      render: (_, record) => {
        const isVoided = !!record.voidedAt;
        const isChildLine = !!record.parentLineId;
        const isAdjustment = record.transactionType?.code === "adjustment";
        const canAdjust = !isVoided && !isChildLine && !isAdjustment;
        const canRebate = record?.postingType === "debit" && !isChildLine && !isVoided;

        let tooltipTextforAdjust = "Adjust this line";
        let tooltipTextforRebate = "Rebate this line";
        if (!canAdjust) {
          if (isVoided) tooltipTextforAdjust = "Cannot adjust a voided line";
          else if (isChildLine)
            tooltipTextforAdjust =
              "Cannot adjust a child line (tax, SC, discount, incentive)";
          else if (isAdjustment)
            tooltipTextforAdjust = "Cannot adjust an adjustment line";
        }

        const canVoid = !isVoided && !isChildLine && !isAdjustment;

        let tooltipTextforVoid = "Void this line";
        if (!canVoid) {
          if (isVoided) tooltipTextforVoid = "Line is already voided";
          else if (isChildLine) tooltipTextforVoid = "Cannot void a child line";
          else if (isAdjustment) tooltipTextforVoid = "Cannot void an adjustment line";
        }

        const items = [
          {
            key: 'adjust',
            label: 'Adjust',
            icon: <SlCalculator />,
            disabled: !canAdjust,
            title: tooltipTextforAdjust,
            onClick: () => {
              setSelectedLine(record);
              setAdjustmentDrawerOpen(true);
            },
          },
          {
            key: 'rebate',
            label: 'Rebate',
            icon: <AiOutlineHdd />,
            disabled: !canRebate,
            title: tooltipTextforRebate,
            onClick: () => {
              setSelectedLine(record);
              setRebateDrawerOpen(true);
            },
          },
          {
            key: 'void',
            label: 'Void',
            icon: <WarningOutlined />,
            disabled: !canVoid,
            title: tooltipTextforVoid,
            danger: true,
            onClick: () => {
              setSelectedLine(record);
              setVoidDrawerOpen(true);
            },
          },
        ];

        const enabledItems = items.filter(item => !item.disabled);

        if (enabledItems.length === 0) return null;

        return (
          <Dropdown
            menu={{ items: enabledItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              className="text-gray-500 hover:text-gray-700"
            />
          </Dropdown>

        );
      },
    },
  ];

  const columns = [
    {
      title: <FolioTitle rest=" No" />,
      dataIndex: "folioNo",
      key: "folioNo",
      width: 200,
      render: (_, record) => (
        <span className="flex items-center gap-1.5">
          {record?.parentFolioId === null && (
            <CrownOutlined style={{ color: "#eab308" }} />
          )}
          {record.folioNo}
        </span>
      ),
    },
    {
      title: "Guest",
      key: "guest",
      render: (_, record) =>
        <div className="grid grid-cols-1 gap-1">
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {record?.guest?.fullName || '-'}
          </span>
          <Tag color="blue" style={{ borderRadius: "9999px" }} className="px-3 py-0.5 text-xs font-medium w-fit">
            {record?.folioOwnerType?.name || 'Unassigned'}
          </Tag>
        </div>
    },
    {
      title: "Total Amount (MMK)",
      key: "grandTotal",
      align: "right",
      render: (_, record) => <PriceTag value={record.grandTotal || 0} />,
    },
    {
      title: "Payment (MMK)",
      key: "paidAmount",
      align: "right",
      render: (_, record) => <PriceTag value={record.paidAmount || 0} />,
    },
    {
      title: "Balance (MMK)",
      key: "balanceAmount",
      align: "right",
      render: (_, record) => <PriceTag value={record.balanceAmount || 0} />,
    },
    {
      title: "Status",
      key: "status",
      align: "center",
      render: (_, record) => <FinancialStatusTag status={record?.financialStatus?.name}/> 
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 60,
      render: (_, record) => {
        const isThisRowLoading = printingFolioUuid === record.uuid;

        const items = [
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => {
              setSelectedFolioForEdit(record);
              setFolioEditDrawerOpen(true);
            },
          },
          {
            key: 'print',
            label: 'Print',
            icon: <PrinterOutlined />,
            disabled: !!printingFolioUuid,
            onClick: () => {
              if (!printingFolioUuid && onPrintFolio) {
                onPrintFolio(record);
              }
            },
          },
        ];

        return (
          <Spin
            indicator={<LoadingOutlined spin className="text-blue-500" />}
            spinning={isThisRowLoading}
          >
            <Dropdown
              menu={{ items }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button
                type="text"
                icon={<MoreOutlined />}
                className="text-gray-500 hover:text-gray-700"
              />
            </Dropdown>
          </Spin>
        );
      },
    },
  ];

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

  const handleAdjustmentConfirm = async (adjustmentData) => {
    try {
      await onAdjustLine(adjustmentData);
      Toast.success(
        `Adjustment Successful`
      );
      setAdjustmentDrawerOpen(false);
      setSelectedLine(null);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleRebateConfirm = async (rebateData) => {
    try {
      await onRebateLine(rebateData);
      Toast.success(
        `Rebate Successful`
      );
      setRebateDrawerOpen(false);
      setSelectedLine(null);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleVoidConfirm = async (voidData) => {
    try {
      await onVoidLine(voidData);
      Toast.success(
        `Void Successful`
      );
      setVoidDrawerOpen(false);
      setSelectedLine(null);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={false}
          bordered={false}
          size="middle"
          className="custom-folio-table"
          rowClassName={(record) =>
            record?.parentFolioId === null ? "active-reservation-row" : "cursor-pointer"
          }
          expandable={{
            expandedRowRender,
            rowExpandable: (record) =>
              record.folioLines && record.folioLines.length > 0,
          }}
        />
      </div>

      {/* Transfer Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <SwapOutlined className="text-lg" />
            </div>
            <div>
              <h3
                className={`text-base font-semibold text-gray-800 dark:text-gray-200 leading-none m-0 ${textColorDarkMode}`}
              >
                Transfer Folio Lines
              </h3>
              <p
                className={`text-xs text-gray-500 dark:text-gray-400 font-normal mt-1 ${textWhiteInDarkStyle}`}
              >
                Move selected line items to another folio
              </p>
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
          className:
            "bg-blue-600 hover:bg-blue-700 border-none font-medium px-5 rounded-lg",
        }}
        cancelButtonProps={{
          className:
            "rounded-lg border-gray-200 hover:text-blue-600 hover:border-blue-500",
        }}
        okText="Submit"
        centered
        width={420}
        className="custom-ant-modal"
      >
        <div className="py-4">
          <div
            className={`bg-blue-50/60 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl p-3 mb-4 flex items-start gap-2.5 mx-2 ${darkModeStyle}`}
          >
            <InfoCircleOutlined className="text-blue-500 dark:text-blue-400 mt-0.5 text-sm flex-shrink-0" />
            <div className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              Moving{" "}
              <strong className="text-blue-900 dark:text-blue-200">
                {selectedLineIds.length}
              </strong>{" "}
              selected line item{selectedLineIds.length !== 1 ? "s" : ""} from{" "}
              <strong className="text-blue-900 dark:text-blue-200">
                {selectedFolio?.folioNo}
              </strong>
              .
            </div>
          </div>

          <div
            className={`mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider mx-2 ${textWhiteInDarkStyle}`}
          >
            Select Target Folio
          </div>

          <div className="max-h-[280px] overflow-y-auto pr-1 py-1 flex flex-col gap-2.5 custom-scrollbar">
            {dataSource?.length > 1 ? (
              <>
                {dataSource
                  ?.filter(
                    (folio) => !selectedFolio || folio.id !== selectedFolio.id
                  )
                  ?.map((folio) => {
                    const isSelected = targetFolioUuid === folio.uuid;
                    const isClosed =
                      folio.closedAt !== null && folio.closedAt !== undefined;
                    const currency = folio.currency?.code || "MMK";
                    const amountText =
                      folio.grandTotal !== undefined
                        ? `${Number(folio.grandTotal).toLocaleString()} ${currency}`
                        : "-";

                    return (
                      <div
                        key={folio.id}
                        onClick={() =>
                          !isClosed && setTargetFolioUuid(folio.uuid)
                        }
                        className={`
                          group relative flex items-center justify-between p-3 rounded-xl border transition-all duration-200 mx-2
                          ${isClosed
                            ? "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 opacity-60 cursor-not-allowed"
                            : isSelected
                              ? "border-blue-500 bg-blue-50/40 dark:bg-blue-900/30 shadow-sm ring-1 ring-blue-500 cursor-pointer"
                              : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 cursor-pointer"
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
                            <span
                              className={`font-semibold text-sm ${isClosed
                                  ? "text-gray-400 dark:text-gray-500"
                                  : "text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                } transition-colors ${textColorDarkMode}`}
                            >
                              {folio.folioNo}
                            </span>
                            {isClosed && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full px-2 py-0.5">
                                Paid
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

            <Alert
              message="The selected parent line and its associated child lines will be transferred together to the selected folio."
              type="warning"
              showIcon
              icon={<WarningOutlined />}
              className="!m-2"
            />
              </>
            ) : (
              <div
                className={`flex flex-col m-2 items-center justify-center py-10 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/50 ${darkModeStyle}`}
              >
                <FileSearchOutlined className="text-4xl text-gray-400 dark:text-gray-500 mb-3" />
                <h3
                  className={`text-base font-semibold text-gray-700 dark:text-gray-300 ${textColorDarkMode}`}
                >
                  No Folios Found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No other folios available for transfer
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Adjustment Drawer */}
      <AdjustmentDrawer
        open={adjustmentDrawerOpen}
        onClose={() => {
          setAdjustmentDrawerOpen(false);
          setSelectedLine(null);
        }}
        lineData={selectedLine}
        onConfirm={handleAdjustmentConfirm}
        loading={isAdjusting}
      />

      {/* Rebate Drawer */}
      <RebateDrawer
        open={rebatDrawerOpen}
        onClose={() => {
          setRebateDrawerOpen(false);
          setSelectedLine(null);
        }}
        lineData={selectedLine}
        onConfirm={handleRebateConfirm}
        loading={isRebating}
      />

      {/* Void Drawer */}
      <VoidDrawer
        open={voidDrawerOpen}
        onClose={() => {
          setVoidDrawerOpen(false);
          setSelectedLine(null);
        }}
        lineData={selectedLine}
        onConfirm={handleVoidConfirm}
        loading={isVording}
      />

      {/* Folio Edit Drawer */}
      <FolioEditFormDrawer
        open={folioEditDrawerOpen}
        onClose={() => {
          setFolioEditDrawerOpen(false);
          setSelectedFolioForEdit(null);
        }}
        folioData={selectedFolioForEdit}
        reservationUuid={selectedFolioForEdit?.reservation?.uuid}
      />
    </>
  );
};

export default FolioOperationsTable;