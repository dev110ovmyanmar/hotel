import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Input,
  Button,
  Drawer,
  Select,
  Divider,
  Space,
  InputNumber,
  Row,
  Col,
  TimePicker,
  Checkbox,
  Card,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { upsertPolicy, policyDetails } from "../../../../api/policyApi";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import { queryClient } from "../../../../app/queryClient";
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Loader from "../../../../component/Loader/Loader";

const { TextArea } = Input;

const PolicyForm = ({
  page,
  setPage,
  mode,
  setMode,
  selectedData,
  drawerOpen,
  setDrawerOpen,
}) => {
  const [form] = Form.useForm();
  const [policyForm] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const isUnlimited = Form.useWatch(
    "isUnlimited",
    policyForm
  );

  const [addPolicyRuleDrawer, setAddPolicyRuleDrawer] = useState(false);

  const [selectedPolicyRule, setSelectedPolicyRule] = useState({});

  const [policyRuleMode, setPolicyRuleMode] = useState("");
  const addPolicyRule = policyRuleMode === "addRule";
  const editPolicyRule = policyRuleMode === "editRule";

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const policyType = initData?.statuses?.policy_type;
  const linkTo = initData?.statuses?.link_to;
  const chargeBaseType = initData?.statuses?.charge_base_type;
  const chargeType = initData?.statuses?.charge_type;

  const chargeTypeValue = Form.useWatch(["chargeType", "uuid"], policyForm);

  const openPolicyRule = () => {
    policyForm.resetFields();
    setAddPolicyRuleDrawer(true);
  };

  const upsertPolicys = useApiMutation({
    mutationFn: upsertPolicy,
    invalidateKeys: [["policies"]],
    // false             false
    shouldInvalidate: addPolicyRule
      ? !addPolicyRule
      : isEdit
        ? true
        : page === 1,
  });

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "policy-detail",
    fetchQueryFunction: policyDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  if (data) {
    console.log(data);
  }
  const cancelCode = data?.policyType?.code === "cancellation";
  const earlyCheckin = data?.policyType?.code === "early_checkin";
  const lateCheckout = data?.policyType?.code === "late_checkout";
  const noShow = data?.policyType?.code === "no_show";

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data,
        linkTo: data?.linkTo?.uuid,
      });
    }
  }, [data, isAdd]);

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
    }
  }, [isAdd]);

  const onFinish = (values) => {
    if (isAdd) {
      const modifiedValue = {
        ...values,
        linkTo: {
          uuid: values?.linkTo,
        },
      };

      upsertPolicys.mutate(modifiedValue, {
        onSuccess: () => {
          setPage(1);
          setDrawerOpen(false);
          Toast.success("Policy Created Successfully!");
          form.resetFields();
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...values,
        linkTo: {
          uuid: values?.linkTo,
        },
        uuid: selectedData?.uuid,
      };

      upsertPolicys.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Policy Updated Successfully!");
        },
      });
    }
  };

  // Policy Rule

  const formatHourTo12 = (hour) => {
    if (hour === undefined || hour === null) return "";

    // Handle Unlimited separately
    if (hour === 9999) return "Unlimited";

    // Convert 24 -> 0 (12 AM)
    if (hour === 24) hour = 0;

    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;

    return `${formattedHour} ${period}`;
  };

  const columns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
    },
    {
      title: "Charge Based On",
      dataIndex: ["chargeBaseType", "name"],
      key: "chargeBaseType",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Charge Value",
      dataIndex: "chargeValue",
      key: "chargeValue",
      render: (_, record) => {
        const chargeValue = Number(record?.chargeValue);
        const chargeTypeName = record?.chargeType?.code;

        if (chargeTypeName === "flat") {
          return <div>{chargeValue} MMK</div>;
        } else {
          return <div>{chargeValue} %</div>;
        }
      },
    },
    // {
    //   title: cancelCode || noShow ? "Days Range" : "Hours Range",
    //   // dataIndex: ,
    //   key: "earlycheck",
    //   render: (_, record) => {
    //     console.log(record, "RecordINE")
    //     return (
    //       <div>
    //         {record?.fromOffset} to {record?.toOffset === 9999 ? `Unlimited` : record?.toOffset}{" "}
    //         {cancelCode || noShow ? "Days" : "Hours"}
    //       </div>
    //     );
    //   },
    // },
    {
      title: cancelCode || noShow ? "Days Range" : "Hours Range",
      key: "earlycheck",
      render: (_, record) => {
        return (

          <>
            {(earlyCheckin || lateCheckout) && (
              <div>
                {formatHourTo12(record?.fromOffset)} to{" "}
                {record?.toOffset === 9999
                  ? "Unlimited"
                  : formatHourTo12(record?.toOffset)}{" "}
              </div>
            )}

            {(noShow || cancelCode) && (
              <div>
                {record?.fromOffset} to {""} {record?.toOffset === 9999 ? "Unlimited" : record?.toOffset} Days
              </div>
            )}
          </>

        );
      },
    },
    // {
    //   title: "Action",
    //   render: (_, record) => {
    //     return (
    //       <EditOutlined
    //         style={{ fontSize: "12px" }}
    //         onClick={() => {
    //           setPolicyRuleMode("editRule");
    //           setAddPolicyRuleDrawer(true);
    //           setSelectedPolicyRule(record);

    //         }}
    //       />
    //     );
    //   },
    // },
    !isView
      ? {
        title: "Action",
        render: (_, record) => {
          return (
            <EditOutlined
              style={{ fontSize: "12px" }}
              onClick={() => {
                setPolicyRuleMode("editRule");
                setAddPolicyRuleDrawer(true);
                setSelectedPolicyRule(record);
              }}
            />
          );
        },
      }
      : {},
  ];

  useEffect(() => {
    if (addPolicyRule) {
      policyForm.resetFields();
    }
  }, [addPolicyRule]);


  const convertNumberToTime = (num) => {
    if (num === null || num === undefined) return null;

    // 24 = 12 AM
    let hour = num === 24 ? 0 : num;

    return dayjs().hour(hour).minute(0).second(0);
  };

  // For Edit
  useEffect(() => {
    if (editPolicyRule && selectedPolicyRule) {
      const isUnlimitedtoOffset = selectedPolicyRule?.toOffset === 9999;
      if (earlyCheckin || lateCheckout) {

        policyForm.setFieldsValue({
          ...selectedPolicyRule,

          fromOffset: convertNumberToTime(selectedPolicyRule?.fromOffset),

          toOffset: isUnlimitedtoOffset ? null : convertNumberToTime(selectedPolicyRule?.toOffset),

          isUnlimited: isUnlimitedtoOffset,

          chargeValue: Number(selectedPolicyRule?.chargeValue),
        });
      }

      if (noShow || cancelCode) {

        policyForm.setFieldsValue({
          ...selectedPolicyRule,

          fromOffset: selectedPolicyRule?.fromOffset,

          toOffset: isUnlimitedtoOffset ? null : selectedPolicyRule?.toOffset,

          isUnlimited: isUnlimitedtoOffset,

          chargeValue: Number(selectedPolicyRule?.chargeValue),
        });
      }

    }
  }, [editPolicyRule, selectedPolicyRule, earlyCheckin, lateCheckout, noShow, cancelCode]);


  const mapTimeToNumber = (time) => {
    if (!time) return null;

    let hour = time.hour();

    // 12 AM → 24
    if (hour === 0) return 24;

    return hour;
  };


  const savePolicyRule = (values) => {

    // For Hour (0 === 24 format)
    if (earlyCheckin || lateCheckout) {

      if (values.fromOffset) {
        values.fromOffset = mapTimeToNumber(values.fromOffset);
      }

      if (values.toOffset && !values.isUnlimited) {
        values.toOffset = mapTimeToNumber(values.toOffset);
      }

    }

    // Checked is ture , auto toOffset to 9999
    if (values.isUnlimited) {
      values.toOffset = 9999;
    }

    // Remove checkbox field (backend doesn't need it)
    delete values.isUnlimited;

    const linkTouuid = form.getFieldValue("linkTo");
    const policyTypeuuid = form.getFieldValue(["policyType", "uuid"]);

    const modifiedPolicyRule = {
      name: data?.name,
      description: data?.description,
      version: data?.version,
      isActive: data?.isActive,
      isDuplicate: data?.isDuplicate,
      isEdit: data?.isEdit,
      isLatest: data?.isLatest,
      uuid: data?.uuid,
      policyRule: addPolicyRule
        ? {
          ...values,
        }
        : {
          ...values,
          uuid: selectedPolicyRule?.uuid,
        },
      linkTo: {
        uuid: linkTouuid,
      },
      policyType: {
        uuid: policyTypeuuid,
      },
    };

    if (addPolicyRule) {
      upsertPolicys.mutate(modifiedPolicyRule, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["policy-detail", { uuid: selectedData?.uuid }],
          });
          Toast.success("Policy Rule Created Successfully");
          setAddPolicyRuleDrawer(false);
        },
      });
    }

    if (editPolicyRule) {
      upsertPolicys.mutate(modifiedPolicyRule, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["policy-detail", { uuid: selectedData?.uuid }],
          });
          Toast.success("Policy Rule Updated Successfully");
          setAddPolicyRuleDrawer(false);
        },
      });
    }
  };

  let fieldName;

  if (cancelCode) {
    fieldName = "cancelBetween";
  } else if (earlyCheckin) {
    fieldName = "earlyCheckin";
  } else if (lateCheckout) {
    fieldName = "lateCheckout";
  } else if (noShow) {
    fieldName = "noShow";
  };

  const labelText = cancelCode ? "Cancel Between" :
    earlyCheckin ? "Early Check-in Between" :
      lateCheckout ? "Late Check-out Between" :
        noShow ? "No Show" : "Something";

  const extraText = (cancelCode || noShow) ? "(Days Before Arrival)" : null;

  // watch fromOffset value
  const fromOffsetValue = Form.useWatch("fromOffset", policyForm);

  useEffect(() => {

    // TIME MODE
    if (earlyCheckin || lateCheckout) {
      const hour = fromOffsetValue?.hour();

      const currentUnlimited =
        policyForm.getFieldValue("isUnlimited");

      // If 12 AM → auto check
      if (hour === 0 && !currentUnlimited) {
        policyForm.setFieldsValue({
          isUnlimited: true,
          // toOffset: undefined
        });
      }

      // If not 12 AM → uncheck
      if (hour !== 0 && currentUnlimited) {
        policyForm.setFieldsValue({
          isUnlimited: false,
        });
      }
    }

    // NUMBER MODE
    if (!earlyCheckin && !lateCheckout) {
      if (fromOffsetValue >= 30) {
        policyForm.setFieldsValue({
          isUnlimited: true,
          // toOffset: 9999
        });
      } else {
        policyForm.setFieldsValue({
          isUnlimited: false,
        });
      }
    }

  }, [fromOffsetValue, earlyCheckin, lateCheckout]);

  return (
    <div className="flex justify-center">
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Policy Details"
                : mode === "edit"
                  ? "Edit Policy"
                  : "Add New Policy"}
            </span>
            {isView ? (
              <Button
                type="primary"
                onClick={() => {
                  setMode("edit");
                }}
              >
                Edit
              </Button>
            ) : (
              <FormButtons
                onClick={() => form.submit()}
                isPending={upsertPolicys?.isPending}
                mode={mode}
              />
            )}
          </div>
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <Loader />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            validateTrigger="onSubmit"
            onFinish={onFinish}
            readOnly={isView}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Policy Name is Required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Link To"
              name="linkTo"
              rules={[{ required: true, message: "Link To is Required" }]}
            >
              <Select
                options={linkTo?.map((item) => ({
                  label: item?.name,
                  value: item?.uuid,
                }))}
              ></Select>
            </Form.Item>

            <Form.Item
              label="Type"
              name={["policyType", "uuid"]}
              rules={[{ required: true, message: "Policy Name is Required" }]}
            >
              <Select
                options={policyType?.map((item) => ({
                  label: item.name,
                  value: item.uuid,
                }))}
                open={isView ? false : undefined}
              ></Select>
            </Form.Item>

            <Form.Item
              label="Is Active"
              name="isActive"
              rules={[{ required: true, message: "Is Active is Required" }]}
            >
              <Select
                options={[
                  { label: "True", value: true },
                  { label: "False", value: false },
                ]}
                open={isView ? false : undefined}
              ></Select>
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is Required" }]}
            >
              <TextArea readOnly={isView} rows={4}></TextArea>
            </Form.Item>

            {(isEdit || isView) && (
              <Card className="mt-5 shadow-sm  border border-gray-100 bg-gray-100!">
                {/* <Divider /> */}
                <Space className="!flex !justify-between">
                  <div className="font-bold">
                    {cancelCode
                      ? "Cancellation Policy (Days Before Arrival)"
                      : noShow
                        ? "No Show Policy (Days Before Arrival)"
                        : earlyCheckin
                          ? "Early CheckIn Policy"
                          : "Late CheckOut Policy"}
                  </div>

                  <Button
                    type="primary"
                    onClick={() => {
                      (openPolicyRule(), setPolicyRuleMode("addRule"));
                    }}
                    hidden={isView}
                  >
                    Add New Policy Rule
                  </Button>
                </Space>

                <Table
                  rowKey="id"
                  dataSource={data?.policyRules}
                  // dataSource={selectedData?.policyRules }
                  // dataSource={policyRuleData}
                  columns={columns}
                  pagination={false}
                  className="my-3"
                ></Table>

                <Drawer
                  title={
                    <div className="flex justify-between">
                      {addPolicyRule ? (
                        <span>Add New Policy Rule</span>
                      ) : (
                        <span>Edit Policy Rule</span>
                      )}
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => policyForm.submit()}
                      >
                        {addPolicyRule ? "Create" : "Update"}
                      </Button>
                    </div>
                  }
                  open={addPolicyRuleDrawer}
                  onClose={() => {
                    (setAddPolicyRuleDrawer(false), setSelectedPolicyRule({}));
                  }}
                  size={550}
                >
                  <Form
                    layout="vertical"
                    form={policyForm}
                    validateTrigger="onSubmit"
                    onFinish={savePolicyRule}
                  >
                    <Form.Item
                      label="Charge Base Type"
                      name={["chargeBaseType", "uuid"]}
                      rules={[
                        {
                          required: true,
                          message: "Charge Based On is Required",
                        },
                      ]}
                    >
                      <Select
                        options={chargeBaseType?.map((item) => ({
                          label: item.name,
                          value: item.uuid,
                        }))}
                      ></Select>
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Charge Type"
                          name={["chargeType", "uuid"]}
                          rules={[
                            {
                              required: true,
                              message: "Charge Type is Required",
                            },
                          ]}
                          getValueProps={(value) => ({
                            value: isView
                              ? chargeType.find((item) => item.value === value)
                                ?.label
                              : value,
                          })}
                        >
                          {isView ? (
                            <Input readOnly={isView} />
                          ) : (
                            <Select
                              options={chargeType?.map((item) => ({
                                label: item.name,
                                value: item.uuid,
                              }))}
                              placeholder="Select Charge Type"
                            ></Select>
                          )}
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          label="Charge Value "
                          name="chargeValue"
                          min={0}
                          rules={[
                            {
                              required: true,
                              message: "Charge Value is Required",
                            },
                            {
                              validator: (_, value) => {
                                const selectedType = chargeType?.find(
                                  (item) => item.uuid === chargeTypeValue,
                                );

                                if (selectedType?.code === "percentage") {
                                  const numValue = Number(value);
                                  if (
                                    isNaN(numValue) ||
                                    numValue < 1 ||
                                    numValue > 100
                                  ) {
                                    return Promise.reject(
                                      new Error(
                                        "Percentage must be between 1 and 100",
                                      ),
                                    );
                                  }
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <Input
                            type="number"
                            min={0}
                            addonAfter={(() => {
                              const selected = chargeType?.find(
                                (item) => item.uuid === chargeTypeValue,
                              );
                              return selected?.code === "percentage"
                                ? "%"
                                : "MMK";
                            })()}
                            readOnly={isView}
                          />
                        </Form.Item>
                      </Col>
                    </Row>


                    <Form.Item
                      label={
                        <>
                          <span>
                            {cancelCode ? "Cancel Between" : "No Show"}{" "}
                          </span>
                          <span
                            style={{ fontWeight: "bold", marginLeft: "5px" }}
                          >
                            {" "}
                            (Days Before Arrival)
                          </span>
                        </>
                      }
                      name={cancelCode ? "cancelBetween" : "noShow"}
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="fromOffset"
                            rules={[
                              { required: true, message: "From is Required" },
                            ]}
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber
                              readOnly={isView}
                              style={{ width: "100%" }}
                              addonAfter={
                                earlyCheckin || lateCheckout ? "Hrs" : "Day"
                              }
                              min={0}
                              placeholder="From"
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                          <Form.Item
                            shouldUpdate={(prev, curr) =>
                              prev?.toOffsetNoLimit !== curr?.toOffsetNoLimit
                            }
                            style={{ marginBottom: 0 }}
                          >
                            {({ getFieldValue, setFieldValue }) => {
                              const isNoLimit =
                                getFieldValue("toOffsetNoLimit");

                              return (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "8px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div style={{ flex: 1 }}>
                                      <InputNumber
                                        readOnly={isView || isNoLimit}
                                        style={{ width: "100%" }}
                                        addonAfter={
                                          earlyCheckin || lateCheckout
                                            ? "Hrs"
                                            : "Days"
                                        }
                                        min={0}
                                        value={
                                          isNoLimit
                                            ? 9999
                                            : getFieldValue("toOffset")
                                        }
                                        disabled={isNoLimit}
                                        onChange={(value) => {
                                          setFieldValue("toOffset", value);
                                          if (value !== 9999) {
                                            setFieldValue(
                                              "toOffsetNoLimit",
                                              false,
                                            );
                                          }
                                        }}
                                        placeholder="To"
                                      />
                                    </div>

                                    {!isView && (
                                      <Checkbox
                                        checked={isNoLimit}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          setFieldValue(
                                            "toOffsetNoLimit",
                                            checked,
                                          );
                                          if (checked) {
                                            setFieldValue("toOffset", 9999);
                                          } else {
                                            setFieldValue(
                                              "toOffset",
                                              undefined,
                                            );
                                          }
                                        }}
                                      >
                                        No Limit
                                      </Checkbox>
                                    )}

                                    {isView &&
                                      getFieldValue("toOffset") === 9999 && (
                                        <Tag color="blue">No Limit</Tag>
                                      )}
                                  </div>

                                  {/* Validation message */}
                                  {!isNoLimit &&
                                    !getFieldValue("toOffset") &&
                                    !isView && (
                                      <div
                                        style={{
                                          color: "#ff4d4f",
                                          fontSize: "12px",
                                        }}
                                      >
                                        To is Required
                                      </div>
                                    )}
                                </div>
                              );
                            }}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>

                    <Form.Item
                      label="Sort Order"
                      name="priority"
                      rules={[
                        { required: true, message: "Priority is Required" },
                      ]}
                    >
                      <InputNumber
                        readOnly={isView}
                        style={{ width: "100%" }}
                        min={0}
                      />
                    </Form.Item>
                  </Form>
                </Drawer>

              </Card>
            )}

            {/* {(isEdit || isView) && (
              <>
                <Divider />

                <Space className="!flex !justify-between">
                  <div className="font-bold">
                    {cancelCode
                      ? "Cancellation Policy (Days Before Arrival)"
                      : noShow
                        ? "No Show Policy (Days Before Arrival)"
                        : earlyCheckin
                          ? "Early CheckIn Policy"
                          : "Late CheckOut Policy"}
                  </div>

                  <Button
                    type="primary"
                    onClick={() => {
                      (openPolicyRule(), setPolicyRuleMode("addRule"));
                    }}
                    hidden={isView}
                  >
                    Add New Policy Rule
                  </Button>
                </Space>

                <Table
                  rowKey="id"
                  dataSource={data?.policyRules}
                  columns={columns}
                  pagination={false}
                  className="my-3"
                ></Table>
                <Drawer
                  title={
                    <div className="flex justify-between">
                      {addPolicyRule ? (
                        <span>Add New Policy Rule</span>
                      ) : (
                        <span>Edit Policy Rule</span>
                      )}
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => policyForm.submit()}
                        loading={upsertPolicys?.isPending}
                      >
                        {addPolicyRule ? "Create" : "Update"}
                      </Button>
                    </div>
                  }
                  open={addPolicyRuleDrawer}
                  onClose={() => {
                    (setAddPolicyRuleDrawer(false), setSelectedPolicyRule({}));
                  }}
                  size={550}
                >
                  <Form
                    layout="vertical"
                    form={policyForm}
                    onFinish={savePolicyRule}
                  >
                    <Form.Item
                      label="Charge Base Type"
                      name={["chargeBaseType", "uuid"]}
                      rules={[
                        {
                          required: true,
                          message: "Charge Based On is Required",
                        },
                      ]}
                    >
                      <Select
                        options={chargeBaseType?.map((item) => ({
                          label: item.name,
                          value: item.uuid,
                        }))}
                      ></Select>
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Charge Type"
                          name={["chargeType", "uuid"]}
                          rules={[
                            {
                              required: true,
                              message: "Charge Type is Required",
                            },
                          ]}
                          getValueProps={(value) => ({
                            value: isView
                              ? chargeType.find((item) => item.value === value)
                                ?.label
                              : value,
                          })}
                        >
                          {isView ? (
                            <Input readOnly={isView} />
                          ) : (
                            <Select
                              options={chargeType?.map((item) => ({
                                label: item.name,
                                value: item.uuid,
                              }))}
                              placeholder="Select Charge Type"
                            ></Select>
                          )}
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          label="Charge Value "
                          name="chargeValue"
                          min={0}
                          rules={[
                            {
                              required: true,
                              message: "Charge Value is Required",
                            },
                            {
                              validator: (_, value) => {
                                const selectedType = chargeType?.find(
                                  (item) => item.uuid === chargeTypeValue,
                                );

                                if (selectedType?.code === "percentage") {
                                  const numValue = Number(value);
                                  if (
                                    isNaN(numValue) ||
                                    numValue < 1 ||
                                    numValue > 100
                                  ) {
                                    return Promise.reject(
                                      new Error(
                                        "Percentage must be between 1 and 100",
                                      ),
                                    );
                                  }
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <Input
                            type="number"
                            min={0}
                            addonAfter={(() => {
                              const selected = chargeType?.find(
                                (item) => item.uuid === chargeTypeValue,
                              );
                              return selected?.code === "percentage"
                                ? "%"
                                : "MMK";
                            })()}
                            readOnly={isView}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label={
                        <>
                          <span>
                            {labelText}
                          </span>
                          <span
                            style={{ fontWeight: "bold", marginLeft: "5px" }}
                          >
                            {extraText}
                          </span>
                        </>
                      }
                      required
                    >
                      <Row gutter={[16, 16]}>
                        <Col span={11}>
                          {
                            (earlyCheckin || lateCheckout) ?
                              <Form.Item
                                name="fromOffset"
                                rules={[
                                  { required: true, message: "From is Required" },
                                ]}
                                style={{ marginBottom: 0 }}
                              >
                                <TimePicker
                                  use12Hours
                                  readOnly={isView}
                                  style={{ width: "100%" }}
                                  placeholder="From"
                                  format={"h A"}
                                />
                              </Form.Item> :
                              <Form.Item
                                name="fromOffset"
                                rules={[
                                  { required: true, message: "From is Required" },
                                  {
                                    validator: (_, value) => {
                                      if (!value) {
                                        return Promise.resolve();
                                      }
                                      if (value < 1 || value > 30) {
                                        return Promise.reject("Number must be between 1 and 30.")
                                      }
                                      return Promise.resolve()
                                    }
                                  }
                                ]}
                                style={{ marginBottom: 0 }}
                              >
                                <InputNumber
                                  readOnly={isView}
                                  style={{ width: "100%" }}
                                  suffix={
                                    earlyCheckin || lateCheckout ? "Hrs" : "Day"
                                  }
                                  placeholder="From"
                                />
                              </Form.Item>
                          }

                        </Col>

                        <Col span={1}>
                          <Form.Item
                            name="isUnlimited"
                            valuePropName="checked"
                          >
                            <Checkbox
                              rules={[
                                { required: true, message: "To is Required" }]}
                            />
                          </Form.Item>
                        </Col>

                        {
                          !isUnlimited &&
                          <Col span={11}>
                            {
                              (earlyCheckin || lateCheckout) ?
                                <Form.Item
                                  name="toOffset"
                                  rules={[
                                    { required: true, message: "To is Required" },
                                  ]}
                                  style={{ marginBottom: 0 }}
                                >
                                  <TimePicker
                                    disabled={isUnlimited}
                                    use12Hours
                                    readOnly={isView}
                                    style={{ width: "100%" }}
                                    placeholder="To"
                                    format={"h A"}

                                  />
                                </Form.Item>
                                :
                                <Form.Item
                                  name="toOffset"
                                  rules={[
                                    { required: true, message: "To is Required" },
                                  ]}
                                  style={{ marginBottom: 0 }}
                                >
                                  <InputNumber
                                    readOnly={isView}
                                    style={{ width: "100%" }}
                                    suffix={
                                      earlyCheckin || lateCheckout ? "Hrs" : "Days"
                                    }
                                    placeholder="To"
                                  />
                                </Form.Item>
                            }

                          </Col>
                        }

                      </Row>
                    </Form.Item>

                    <Form.Item
                      label="Sort Order"
                      name="priority"
                      rules={[
                        { required: true, message: "Sort Order is Required" }
                      ]}
                    >
                      <InputNumber
                        readOnly={isView}
                        style={{ width: "100%" }}
                        min={0}
                      />
                    </Form.Item>
                  </Form>
                </Drawer>
              </>
            )} */}
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default PolicyForm;

