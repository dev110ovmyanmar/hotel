import React, { useEffect, useState } from "react";
import { Table, Form, Input, Button, Drawer, Select, Divider, Space, InputNumber } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import {
  createPolicyFun,
  editPolicyFun,
  policyDetailsFun,
} from "../../../../api/policyFunctionApi";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import { loadState } from "./../../../../utils/Utils";
import { LOCAL_STORAGE_KEYS } from "./../../../../variables/constants";
import { queryClient } from "../../../../app/queryClient";
import { EditOutlined } from '@ant-design/icons';

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

  const openPolicyRule = () => {
    setAddPolicyRuleDrawer(true)
  };

  const createPolicyFunction = useApiMutation({
    mutationFn: createPolicyFun,
    invalidateKeys: [["policies"]],
    shouldInvalidate: addPolicyRule ? !addPolicyRule : page === 1
  });

  const editPolicyFunction = useApiMutation({
    mutationFn: editPolicyFun,
    invalidateKeys: [["policies"]],
  });

  const { data, isPending, error } = useApiQuery({
    fetchQueryName: "policy-detail",
    fetchQueryFunction: policyDetailsFun,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

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

      createPolicyFunction.mutate(modifiedValue, {
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

      editPolicyFunction.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Policy Updated Successfully!");
        },
      });
    }
  };

  // Policy Rule 

  const columns = [
    {
      title: 'ID',
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
    },
    {
      title: 'Charge Value',
      dataIndex: 'chargeValue',
      key: 'chargeValue',
      render: text => <div>{text}</div>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: text => <div>{text}</div>,
    },
    {
      title: 'Charge Base Type',
      dataIndex: ["chargeBaseType", "name"],
      key: 'chargeBaseType',
      render: text => <div>{text}</div>,
    },
    {
      title: 'Charge Type',
      dataIndex: ["chargeType", "name"],
      key: 'chargeType',
      render: text => <div>{text}</div>,
    },
    {
      title: 'From',
      dataIndex: "fromOffset",
      key: 'fromOffset',
      render: text => <div>{text}</div>,
    },
    {
      title: 'To',
      dataIndex: "toOffset",
      key: 'toOffset',
      render: text => <div>{text}</div>,
    },
    {
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
    },
  ];


  useEffect(() => {
    if (addPolicyRule) {
      policyForm.resetFields()
    }
  }, [addPolicyRule]);


  useEffect(() => {
    if (editPolicyRule) {
      policyForm.setFieldsValue(
        selectedPolicyRule
      )
    }
  }, [editPolicyRule, selectedPolicyRule])

  const savePolicyRule = (values) => {
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
      policyRule:
        addPolicyRule ?
          { ...values } :
          {
            ...values,
            uuid: selectedPolicyRule?.uuid
          }
      ,
      linkTo: {
        uuid: linkTouuid
      },
      policyType: {
        uuid: policyTypeuuid
      }
    };

    if (addPolicyRule) {
      createPolicyFunction.mutate(modifiedPolicyRule, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["policy-detail", { uuid: selectedData?.uuid }] });
          Toast.success("Policy Rule Created Successfully");
          setAddPolicyRuleDrawer(false);
        }
      })
    };

    if (editPolicyRule) {
      editPolicyFunction.mutate(modifiedPolicyRule, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["policy-detail", { uuid: selectedData?.uuid }] });
          Toast.success("Policy Rule Updated Successfully");
          setAddPolicyRuleDrawer(false);
        }
      })
    }

  };

  return (
    <div className="flex justify-center">
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={500}
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
                isPending={
                  isAdd
                    ? createPolicyFunction.isPending
                    : editPolicyFunction.isPending
                }
                mode={mode}
              />
            )}
          </div>
        }
      >
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
            rules={[{ required: true, message: "Is Active  is Required" }]}
          >
            <Select
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              open={isView ? false : undefined}
            ></Select>
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is Required" }]}
          >
            <TextArea readOnly={isView}></TextArea>
          </Form.Item>


          {
            isEdit && (
              <>
                <Divider />

                <Space className="!flex !justify-between">
                  <div className="font-bold">Policy Rules</div>

                  <Button
                    type="primary"
                    onClick={() => {
                      openPolicyRule(),
                        setPolicyRuleMode("addRule");
                    }
                    }
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
                >

                </Table>

                <Drawer
                  title={
                    <div className="flex justify-between">
                      {
                        addPolicyRule ?
                          <span>Add New Policy Rule</span> :
                          <span>Edit Policy Rule</span>
                      }
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => policyForm.submit()}
                      >
                        {
                          addPolicyRule ? "Create" : "Update"
                        }
                      </Button>
                    </div>
                  }
                  open={addPolicyRuleDrawer}
                  onClose={() => {
                    setAddPolicyRuleDrawer(false),
                      setSelectedPolicyRule({})
                  }}
                >
                  <Form
                    layout="vertical"
                    form={policyForm}
                    validateTrigger="onSubmit"
                    onFinish={savePolicyRule}
                  >

                    <Form.Item
                      label="Charge Value"
                      name="chargeValue"
                      rules={[{ required: true, message: "Charge Name is Required" }]}
                    >
                      <Input readOnly={isView} />
                    </Form.Item>

                    <Form.Item
                      label="Priority"
                      name="priority"
                      rules={[{ required: true, message: "Priority is Required" }]}
                    >
                      <InputNumber readOnly={isView} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                      label="Charge Base Type"
                      name={["chargeBaseType", "uuid"]}
                      rules={[{ required: true, message: "Charge Base Type is Required" }]}
                    >
                      <Select
                        options={
                          chargeBaseType?.map(item => ({
                            label: item.name,
                            value: item.uuid
                          }))
                        }
                      >
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Charge Type"
                      name={["chargeType", "uuid"]}
                      rules={[{ required: true, message: "Charge Type is Required" }]}
                    >
                      <Select
                        options={
                          chargeType?.map(item => ({
                            label: item.name,
                            value: item.uuid
                          }))
                        }
                      >
                      </Select>
                    </Form.Item>

                    <Space>
                      <Form.Item
                        label="From"
                        name="fromOffset"
                        rules={[{ required: true, message: "From is Required" }]}
                      >
                        <InputNumber readOnly={isView} />
                      </Form.Item>

                      <Form.Item
                        label="To"
                        name="toOffset"
                        rules={[{ required: true, message: "To is Required" }]}
                      >
                        <InputNumber readOnly={isView} />
                      </Form.Item>
                    </Space>
                  </Form>
                </Drawer>
              </>
            )
          }

        </Form>
      </Drawer>
    </div>
  );
};

export default PolicyForm;
