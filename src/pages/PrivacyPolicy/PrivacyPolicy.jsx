import React, { useState, useEffect, useMemo } from "react";
import { Form, Button, Select } from "antd";
import Toast from "../../component/Toast/Toast";
import useApiQuery from "../../hooks/useApiQuery";
import { useApiMutation } from "../../hooks/useApiMutation";

import { fetchPrivacyPolicyData, createPrivacyPolicy } from "../../api/privacyPolicyApi";
import { queryClient } from "../../app/queryClient";
import Editor from "../../component/Editor/Editor";
import Loader from "../../component/Loader/Loader";

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

  const initData = queryClient.getQueryData(["initData"]);

  const statusOptions =
    initData?.statuses?.status?.map((item) => ({
      value: item.uuid,
      label: item.name,
    })) || [];

  const cleanHTML = (html) => (html ? html.replace(/<p><br><\/p>/gi, "").trim() : "");

  const getStatusLabel = (uuid) => statusOptions.find((s) => s.value === uuid)?.label || "-";

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

  const isEmpty = !savedPolicies.privacyPolicy && !savedPolicies.termsAndConditions;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-end mb-6">
          {!isEmpty && !isEdit && (
            <Button
              type="primary"
              className="bg-blue-600 hover:bg-blue-700 h-10 px-8 font-semibold shadow-sm"
              onClick={() => setIsEdit(true)}
            >
              Edit Policies
            </Button>
          )}
        </div>

        {/* Empty State */}
        {isEmpty && !isEdit ? (
          <div className="py-40 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-semibold text-gray-700">No Content Available</h3>
            <p className="text-gray-500 mb-8">Start by creating your first policy.</p>
            <Button
              type="primary"
              size="large"
              className="bg-blue-600 px-10 font-bold"
              onClick={() => setIsEdit(true)}
            >
              Create Now
            </Button>
          </div>
        ) : (
          <Form
            form={form}
            layout="horizontal"
            className="p-10"
            labelAlign="left"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
          >
            
            <Form.Item
              name="privacyPolicy"
              label={<span className="font-bold text-gray-700 text-sm">Privacy Policy</span>}
              /* Only validate when not in view mode */
              rules={[{ required: isEdit , message: "Required" }]}
              className="mb-10"
            >
              <Editor 
              placeholder="Content..." 
              readOnly={!isEdit} // Most editors use this prop
              disabled={!isEdit} // Some editors (like AntD variants) use this
              // If your editor needs a specific "view" theme:
              theme={!isEdit ? "bubble" : "snow"} 
              />
            </Form.Item>

            <Form.Item
              name="termsAndConditions"
              label={<span className="font-bold text-gray-700 text-sm">Terms & Conditions</span>}
              /* Only validate when not in view mode */
              rules={[{ required: isEdit , message: "Required" }]}
              className="mb-10"
            >
              <Editor 
              placeholder="Content..." 
              readOnly={!isEdit} // Most editors use this prop
              disabled={!isEdit} // Some editors (like AntD variants) use this
              // If your editor needs a specific "view" theme:
              theme={!isEdit ? "bubble" : "snow"} 
              />
            </Form.Item>

            {/* Status */}
            <Form.Item
              name="statusUuid"
              label={<span className="font-bold text-gray-700 text-sm">Status</span>}
              rules={[{ required: true, message: "Required" }]}
            >
                <Select
                  options={statusOptions}
                  className="h-11 w-40"
                  placeholder="Select Status"
                  disabled={!isEdit}
                />
            </Form.Item>

            {/* Buttons */}
            {isEdit && (
              <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-gray-200">
                <Button onClick={handleCancel} className="px-8 h-11">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  loading={mutation.isLoading}
                  className="bg-blue-600 hover:bg-blue-700 px-12 h-11 font-bold text-white"
                  htmlType="submit"
                >
                  Create
                </Button>
              </div>
            )}
          </Form>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
