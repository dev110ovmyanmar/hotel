import React, { useState, useEffect, useMemo } from "react";
import { Form, Button, Select, Input } from "antd";
import Toast from "../../component/Toast/Toast";
import useApiQuery from "../../hooks/useApiQuery";
import { useApiMutation } from "../../hooks/useApiMutation";

import { fetchPrivacyPolicyData, createPrivacyPolicy } from "../../api/privacyPolicyApi";
import { queryClient } from "../../app/queryClient";
import Editor from "../../component/Editor/Editor";
import Loader from "../../component/Loader/Loader";

const stripHTML = (html) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const EditorOrTextArea = ({ value, onChange, isEdit, ...props }) => {
  return !isEdit ? (
    <Input.TextArea
      {...props}
      value={stripHTML(value)}
      readOnly
      rows={10}
      className="bg-gray-50 
      dark:bg-[#1f1f1f] 
      border-gray-200 
      dark:border-gray-700 
      text-gray-700 
      dark:text-[#D9D9D9] 
      cursor-default"
    />
  ) : (
    <Editor
      {...props}
      value={value}
      onChange={onChange}
      placeholder="Content..."
      theme="snow"
    />
  );
};

const PrivacyPolicy = () => {
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [savedPolicies, setSavedPolicies] = useState({
    privacyPolicy: "",
    termsAndConditions: "",
    statusUuid: "",
  });

  // 1. Fetch initial data
  const { data, isLoading } = useApiQuery({
    fetchQueryName: "privacypolicyData",
    fetchQueryFunction: fetchPrivacyPolicyData,
    params: {},
  });

  const isEmpty = data?.privacyPolicy === "" && data?.termsAndConditions === "";

  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const statusOptions =
    initData?.statuses?.status
      ?.filter((item) => item.name.toLowerCase() !== "blocked")
      ?.map((item) => ({
        value: item.uuid,
        label: item.name,
      })) || [];

  const cleanHTML = (html) => (html ? html.replace(/<p><br><\/p>/gi, "").trim() : "");


  // 2. Sync form when data arrives
  useEffect(() => {
    if (data?.response) {
      const response = data.response;
      const formattedData = {
        privacyPolicy: cleanHTML(response.privacyPolicy || ""),
        termsAndConditions: cleanHTML(response.termsAndConditions || ""),
        statusUuid: response.status?.uuid || "",
      };
      setSavedPolicies(formattedData);
      form.setFieldsValue(formattedData);
    }
  }, [data, form]);

  // 3. Setup mutation using useApiMutation
  const mutation = useApiMutation({
    mutationFn: createPrivacyPolicy,
    invalidateKeys: ["privacypolicyData"], // optional: refresh query after success
    options: {
      onSuccess: (_, variables) => {
        const payload = variables; // same payload as passed to mutate
        setSavedPolicies({
          privacyPolicy: payload.privacyPolicy,
          termsAndConditions: payload.termsAndConditions,
          statusUuid: payload.status.uuid,
        });
        setIsEdit(false);
        Toast.success("Policies updated successfully!");
      },
      onError: () => {
        Toast.error("Failed to save policies.");
      },
    },
  });

  // 4. Form submit
  const onFinish = (values) => {
    const payload = {
      privacyPolicy: cleanHTML(values.privacyPolicy),
      termsAndConditions: cleanHTML(values.termsAndConditions),
      status: { uuid: values.statusUuid },
    };

    if (!payload.privacyPolicy && !payload.termsAndConditions) {
      Toast.error("Cannot save empty content.");
      return;
    }

    mutation.mutate(payload);
  };

  const handleCancel = () => {
    form.setFieldsValue(savedPolicies);
    setIsEdit(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#141414] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-end mb-6">
          {
            !isEmpty && !isEdit && (
              <Button
                type="primary"
                className="bg-blue-600 hover:bg-blue-700 h-10 px-8 font-semibold shadow-sm"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </Button>
            )}
          {
            isEmpty && !isEdit && (
              <Button
                type="primary"
                className="bg-blue-600 hover:bg-blue-700 h-10 px-8 font-semibold shadow-sm"
                onClick={() => setIsEdit(true)}
              >
                Create
              </Button>
            )
          }
        </div>

        <Form
          form={form}
          layout="horizontal"
          className="p-10"
          labelAlign="left"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
        >

          <div className="mr-2">
            <Form.Item
              name="privacyPolicy"
              label={<span className="font-bold text-gray-700 dark:text-[#D9D9D9] text-sm">Privacy Policy</span>}
              /* Only validate when not in view mode */
              rules={[{ required: true, message: "Required" }]}
              className="mb-10"
            >
              <EditorOrTextArea isEdit={isEdit} />
            </Form.Item>

            <Form.Item
              name="termsAndConditions"
              label={<span className="font-bold text-gray-700 dark:text-[#D9D9D9] text-sm">Terms & Conditions</span>}
              /* Only validate when not in view mode */
              rules={[{ required: true, message: "Required" }]}
              className="mb-10"
            >
              <EditorOrTextArea isEdit={isEdit} />
            </Form.Item>

            {/* Status */}
            <Form.Item
              name="statusUuid"
              label={<span className="font-bold text-gray-700 dark:text-[#D9D9D9] text-sm">Status</span>}
              rules={[{ required: true, message: "Required" }]}
              getValueProps={(value) => ({
                value: !isEdit
                  ? statusOptions.find((item) => item.value === value)?.label || "-"
                  : value,
              })}
            >
              {isEdit ? (
                <Select
                  options={statusOptions}
                  className="h-11 w-40"
                  placeholder="Select Status"
                />
              ) : (
                <Input
                  readOnly
                  className="h-11 w-40 bg-gray-50 dark:bg-[#1f1f1f] border-gray-200 dark:border-gray-700 text-gray-700 dark:!text-[#D9D9D9] cursor-default"
                />
              )}
            </Form.Item>
          </div>

          {/* Buttons */}
          {isEdit && (
            <div className="flex justify-end gap-4 mt-12 border-gray-200 mr-50">
              <Button onClick={handleCancel} className="px-8 h-11">
                Cancel
              </Button>
              <Button
                type="primary"
                loading={mutation.isLoading}
                className="bg-blue-600 hover:bg-blue-700 px-12 h-11 font-bold text-white"
                htmlType="submit"
              >
                Save
              </Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
