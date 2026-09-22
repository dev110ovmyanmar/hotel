import React from 'react';
import { Modal, Button, Descriptions, Tag, Typography, Row, Col, Card, Avatar, Spin } from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CreditCardOutlined,
    FileTextOutlined,
    HomeOutlined,
    InfoCircleOutlined,
    UserOutlined
} from '@ant-design/icons';
import useApiQuery from '../../../../hooks/useApiQuery';
import { folioPaymentDetails } from '../../../../api/reservationSectionApi';

const { Text, Title } = Typography;

export default function FolioPaymentDetailModal({
    isOpen,
    onClose,
    selectedDataUuid
}) {
    // Dynamic Query hook fetching individual row payload matching selection uuid
    const { data, isFetching } = useApiQuery({
        fetchQueryName: ["folio-payment-details"],
        fetchQueryFunction: folioPaymentDetails,
        params: { uuid: selectedDataUuid },
        options: { enabled: !!selectedDataUuid && isOpen },
    });

    const folio = data?.folio || {};
    const guest = data?.guest || {};
    const property = data?.property || {};
    const currencySymbol = data?.currency?.symbol || "Ks";

    // Dynamic Status Tags Mapping
    const getStatusTag = (status) => {
        const code = status?.code;
        const name = status?.name || "Unknown";
        if (code === "completed") {
            return <Tag color="success" icon={<CheckCircleOutlined />}>{name}</Tag>;
        }
        return <Tag color="default" icon={<ClockCircleOutlined />}>{name}</Tag>;
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <div className="w-1 h-[18px] bg-[#a6b019] rounded-[2px]" />
                    <span className="font-semibold text-slate-800">Payment Transaction Details</span>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            width={750}
            footer={null}
        >
            <Spin spinning={isFetching} tip="Fetching live transaction entries...">

                {/* Top Banner Meta Details Summary */}
                <div className="flex justify-between items-center bg-slate-50 p-3 px-4 rounded-lg my-4 border border-slate-200">
                    <div>
                        <Text type="secondary" className="text-xs block">TRANSACTION NO</Text>
                        <div className="font-semibold text-slate-800 text-base">#{data?.transactionNo || 'N/A'}</div>
                    </div>
                    <div>
                        <Text type="secondary" className="text-xs block">FOLIO NO</Text>
                        <div className="font-semibold text-slate-800 text-base">{folio?.folioNo || 'N/A'}</div>
                    </div>
                    <div>
                        <Text type="secondary" className="text-xs block mb-0.5">STATUS</Text>
                        {getStatusTag(data?.paymentStatus)}
                    </div>
                </div>

                <Row gutter={[16, 16]}>
                    {/* Core Transaction Metadata */}
                    <Col span={24}>
                        <Descriptions
                            title={<span className="text-sm text-slate-600 font-medium"><CreditCardOutlined className="mr-1" /> Payment Summary</span>}
                            bordered
                            size="small"
                            column={2}
                        >
                            <Descriptions.Item label="Payment Date">{data?.paymentDate || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Payment Method">{data?.paymentMethod?.name || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="External Reference">{data?.externalReference || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Processed By">{data?.receivedBy?.name || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Remarks" span={2}>{data?.remark || 'No operation notes captured.'}</Descriptions.Item>
                        </Descriptions>
                    </Col>

                    {/* Guest & Property Entities Profiles split column row */}
                    <Col span={12}>
                        <Card
                            size="small"
                            title={<span className="text-xs font-medium text-slate-700"><UserOutlined className="mr-1" /> Guest Information</span>}
                            className="h-full rounded-md shadow-sm border-slate-200"
                        >
                            <div className="flex gap-3 items-center mb-1">
                                <Avatar src={guest?.guestFiles?.profile} icon={<UserOutlined />} size={40} className="bg-slate-200" />
                                <div>
                                    <div className="font-semibold text-slate-800">{guest?.title ? `${guest.title} ` : ''}{guest?.name || 'Unknown'}</div>
                                    <Text type="secondary" className="text-xs block mt-0.5">Phone: {guest?.phone || 'N/A'}</Text>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card
                            size="small"
                            title={<span className="text-xs font-medium text-slate-700"><HomeOutlined className="mr-1" /> Property Profile</span>}
                            className="h-full rounded-md shadow-sm border-slate-200"
                        >
                            <div className="flex gap-3 items-center mb-1">
                                <Avatar src={property?.file} icon={<HomeOutlined />} size={40} shape="square" className="bg-slate-200" />
                                <div>
                                    <div className="font-semibold text-slate-800">{property?.name || 'N/A'}</div>
                                    <Text type="secondary" className="text-[11px] block text-slate-500 leading-tight mt-0.5">{property?.address || 'N/A'}</Text>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 px-5 text-slate-700 shadow-sm mt-2">
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] uppercase tracking-wider mb-3.5 font-medium">
                                <FileTextOutlined />
                                <span>Folio Balance Accounts Ledger Summary</span>
                            </div>

                            <Row gutter={16}>
                                <Col span={6}>
                                    <div className="text-xs text-slate-500">Grand Total</div>
                                    <div className="text-base font-semibold text-slate-900 mt-0.5">
                                        {currencySymbol} {folio?.grandTotal?.toLocaleString() || '0'}
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <div className="text-xs text-slate-500">Total Tax & Fees</div>
                                    <div className="text-base font-medium text-slate-900 mt-0.5">
                                        {currencySymbol} {((folio?.taxTotal || 0) + (folio?.serviceChargeTotal || 0)).toLocaleString()}
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <div className="text-xs text-emerald-600 font-medium">Amount Paid</div>
                                    <div className="text-lg font-bold text-emerald-600 mt-0.5">
                                        {currencySymbol} {data?.amount?.toLocaleString() || '0'}
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <div className="text-xs text-rose-600 font-medium">Remaining Balance</div>
                                    <div className="text-lg font-bold text-rose-600 mt-0.5">
                                        {currencySymbol} {folio?.balanceAmount?.toLocaleString() || '0'}
                                    </div>
                                </Col>
                            </Row>

                            <div className="flex items-start gap-1.5 mt-4 text-slate-400 text-[10px] border-t border-slate-200 pt-2.5 leading-normal">
                                <InfoCircleOutlined className="mt-0.5" />
                                <span>Folio opened at {folio?.openedAt || 'N/A'}. All currency evaluations are processed directly using {data?.currency?.code || 'MMK'} localized legal tender constraints.</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Spin>
        </Modal>
    );
}