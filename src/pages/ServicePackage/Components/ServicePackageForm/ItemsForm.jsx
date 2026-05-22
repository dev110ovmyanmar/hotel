import { Button, Drawer, Form, Input, InputNumber, Select, Row, Col } from "antd";
import React, { useEffect } from "react";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import useApiQuery from "../../../../hooks/useApiQuery";
import { getServiceMeta } from "../../../../api/serviceInventoryApi";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import { getServicePackageItemDetails, upsertServicePackageItem } from "../../../../api/servicePackageApi";
import { queryClient } from "../../../../app/queryClient";
import Toast from "../../../../component/Toast/Toast";

const ItemsForm = ({
    selectedItem,
    setSelectedItem,
    drawerOpen,
    setDrawerOpen,
    mode,
    setMode,
}) => {
    const [form] = Form.useForm();
    const isView = mode === "item-view";
    const isEdit = mode === "item-edit";
    const isAdd = mode === "item-add";

    const initData = queryClient.getQueryData(["initData", "authenticated"]);

    const service_item_types = initData?.statuses?.service_item_type?.map
        ((item) => {
            return {
                value: item?.uuid,
                label: item?.code,
            }
        });

    const { data: serviceMetaData } = useApiQuery({
        fetchQueryName: "serviceMetaData",
        fetchQueryFunction: getServiceMeta,
    });

    const selectedTypeUuid = Form.useWatch('itemType', form);

    const getDynamicItemOptions = () => {
        if (!selectedTypeUuid) return [];

        const selectedType = initData?.statuses?.service_item_type?.find(
            (type) => type?.uuid === selectedTypeUuid
        );

        const typeCode = selectedType?.code?.toLowerCase();

        if (typeCode === 'service') {
            return serviceMetaData?.services?.map((item) => ({
                value: item?.uuid,
                label: item?.name,
            })) || [];
        }

        if (typeCode === 'inventory') {
            return serviceMetaData?.service_inventory_items?.map((item) => ({
                value: item?.uuid,
                label: item?.name,
            })) || [];
        }

        return [];
    };

    const dynamicItemOptions = getDynamicItemOptions();

    const createItem = useApiMutation({
        mutationFn: upsertServicePackageItem,
        invalidateKeys: [["service-package-items"], ["service-packages"]],
    });

    const editItem = useApiMutation({
        mutationFn: upsertServicePackageItem,
        invalidateKeys: [["service-package-items"], ["service-packages"]],
    });

    const { data, isLoading, error } = useApiQuery({
        fetchQueryName: "service-package-item-details",
        fetchQueryFunction: getServicePackageItemDetails,
        params: { uuid: selectedItem?.uuid },
        options: {
            enabled: !!selectedItem?.uuid,
        },
    });

    useEffect(() => {
        if (!isAdd && data && drawerOpen) {
            form.setFieldsValue({
                ...data,
                uuid: data?.uuid,
                servicePackage: { uuid: data?.servicePackage?.uuid },
                itemType: data?.itemType?.uuid,
                item: data?.item?.uuid
            });
            setSelectedItem(data);
        }
    }, [data, !isAdd, drawerOpen]);

    const onFinish = (values) => {
        if (isAdd) {
            const createValues = {
                ...values,
                servicePackage: { uuid: selectedItem?.servicePackage?.uuid },
                itemType: { uuid: values.itemType },
                item: { uuid: values.item },
            };

            createItem.mutate(createValues, {
                onSuccess: () => {
                    form.resetFields();
                    setDrawerOpen(false);
                    Toast.success("Item Created Successfully!");
                },
            });
        }
        if (isEdit) {
            const editValues = {
                ...values,
                servicePackage: { uuid: selectedItem?.servicePackage?.uuid },
                itemType: { uuid: values.itemType },
                item: { uuid: values.item },
                uuid: data?.uuid,
            };

            editItem.mutate(editValues, {
                onSuccess: () => {
                    form.resetFields();
                    setDrawerOpen(false);
                    Toast.success("Item Updated Successfully!");
                },
            });
        }
    };

    return (
        <div>
            <Drawer
                open={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    form.resetFields();
                    setSelectedItem(null);
                }}
                size={550}
                title={
                    <div className="flex justify-between items-center">
                        <span>
                            {mode === "item-view"
                                ? "Item Details"
                                : mode === "item-edit"
                                    ? "Edit Item"
                                    : "Create Item"}
                        </span>
                        {isView ? (
                            <Button
                                type="primary"
                                onClick={() => {
                                    setMode("item-edit");
                                }}
                            >
                                Edit
                            </Button>
                        ) : (
                            <FormButtons
                                onClick={() => form.submit()}
                                isPending={createItem.isPending || editItem.isPending}
                                mode={mode}
                            />
                        )}
                    </div>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    style={{ width: "100%" }}
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        <Col span={12}>

                            <Form.Item name={["servicePackage", "uuid"]} hidden />

                            <Form.Item
                                label="Item Type"
                                name="itemType"
                                rules={[{ required: true, message: "Item Type is Required" }]}
                            >
                                <Select
                                    options={service_item_types}
                                    placeholder="Select Item Type"
                                    disabled={isView}
                                    onChange={() => form.setFieldValue('item', undefined)}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Item"
                                name="item"
                                rules={[{ required: true, message: "Item is Required" }]}
                            >
                                <Select
                                    showSearch
                                    options={dynamicItemOptions}
                                    placeholder={selectedTypeUuid ? "Select Item" : "Please select an Item Type first"}
                                    disabled={isView || !selectedTypeUuid}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Quantity" name="quantity" rules={[{ required: true, message: "Quantity is required!" }]}>
                                <InputNumber
                                    className="w-full!"
                                    mode="spinner"
                                    min={1}
                                    readOnly={isView}
                                    placeholder="Enter Quantity"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </div>
    );
};

export default ItemsForm;
