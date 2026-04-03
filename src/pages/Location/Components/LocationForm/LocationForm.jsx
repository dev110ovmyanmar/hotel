import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Drawer,
  Modal,
  Table,
  Space,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import {
  upsertLocation,
  locationDetails,
} from "../../../../api/locationApi";
import { FiEdit } from "react-icons/fi";
import ListHeader from "./../../../../component/ListHeader/ListHeader";
import FormButtons from "./../../../../component/FormButtons/FormButtons";
import { queryClient } from './../../../../app/queryClient';
import Loader from "../../../../component/Loader/Loader";

const LocationForm = ({
  page,
  setPage,
  mode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  modalOpen,
  setModalOpen,
}) => {
  const [form] = Form.useForm();
  const [cityForm] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const [cityMode, setCityMode] = useState("");
  const isCityEdit = cityMode === "cityEdit";
  const isCityAdd = cityMode === "cityAdd";

  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState({});

  const upsertLocations = useApiMutation({
    mutationFn: upsertLocation,
    invalidateKeys: [["locations"]],
    shouldInvalidate: isEdit ? true : page === 1

  });

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "location-detail",
    fetchQueryFunction: locationDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (isEdit && data) {
      form.setFieldsValue({
        ...data,
      });
    }
  }, [data, isEdit]);

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
    }
    if (isCityAdd) {
      cityForm.resetFields();
    }
  }, [isAdd, isCityAdd]);

  const onFinish = (values) => {
    if (isAdd) {
      upsertLocations.mutate(values, {
        onSuccess: () => {
          setPage(1);
          setModalOpen(false);
          Toast.success("Country Created Successfully!");
          form.resetFields();
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...values,
        uuid: selectedData?.uuid,
      };

      upsertLocations.mutate(editValues, {
        onSuccess: () => {
          setModalOpen(false);
          Toast.success("Country Updated Successfully!");
        },
      });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "City",
      dataIndex: "name",
      key: "name",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Action",
      render: (_, record) => {
        return (
          <Space>
            <FiEdit
              className="text-blue-500"
              onClick={() => {
                (setCreateDrawerOpen(true),
                  setCityMode("cityEdit"),
                  setSelectedCity(record));
              }}
            />
          </Space>
        );
      },
    },
  ];

  const onCityFinish = (values) => {
    if (isCityAdd) {
      setSelectedCity({});
      const modifiedValues = {
        name: data?.name,
        uuid: data?.uuid,
        city: {
          name: values?.city.name,
        },
      };
      upsertLocations.mutate(modifiedValues, {
        onSuccess: () => {
          queryClient.invalidateQueries(["locations"]);
          setCreateDrawerOpen(false);
          Toast.success("City Create Successfully!");

        },
      });
    }

    // Edit
    if (isCityEdit) {
      const editValues = {
        name: data?.name,
        uuid: data?.uuid,
        city: {
          name: values?.city.name,
          uuid: selectedCity.uuid,
        },
      };
      upsertLocations.mutate(editValues, {
        onSuccess: () => {
          queryClient.invalidateQueries(["locations"]);
          setCreateDrawerOpen(false);
          Toast.success("City Updated Successfully!");
        },
      });
    }
  };

  useEffect(() => {
    if (isCityEdit && selectedCity) {
      cityForm.setFieldsValue({
        city: {
          name: selectedCity.name,
        },
      });
    }
  }, [selectedCity, isCityAdd]);

  return (
    <div className="flex justify-center">
      {isView && (
        <Drawer
          destroyOnClose
          size={550}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={
            <>
              <span style={{ fontWeight: "normal" }}>Country: </span>
              <span>{data?.name}</span>
            </>
          }
        >
          <ListHeader
            addButtonText="Add New City"
            page={page}
            setPage={setPage}
            setCreateDrawerOpen={setCreateDrawerOpen}
            setCityMode={setCityMode}
          />

          <Table
            columns={columns}
            dataSource={data?.city}
            rowKey="uuid"
            className="my-3"
            loading={isLoading}
            pagination={false}
          ></Table>

          <Drawer
            open={createDrawerOpen}
            onClose={() => setCreateDrawerOpen(false)}
            title={
              <div className="flex justify-between items-center">
                <span>{isCityEdit ? "Edit City" : "Add New City"}</span>

                <div className="flex justify-between gap-4">
                  <Button
                    type="primary"
                    onClick={() => cityForm.submit()}
                    loading={upsertLocations?.isPending}
                  >
                    {isCityAdd ? "Create" : "Update"}
                  </Button>
                </div>
              </div>
            }
          >
            {
              isLoading ? (
                <div className="flex items-center justify-center h-full min-h-[300px]">
                  <Loader />
                </div>
              ) : (
                <Form form={cityForm} onFinish={onCityFinish} layout="vertical">
                  <Form.Item
                    label="City"
                    name={["city", "name"]}
                    rules={[{ required: true, message: "City is required" }]}
                  >
                    <Input />
                  </Form.Item>
                </Form>
              )
            }
          </Drawer>
        </Drawer >
      )}

      <Modal
        width={400}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title={mode === "add" ? "Add New Location" : "Edit Location"}
        footer={null}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
          wrapperCol={{ xs: { span: 24 }, sm: { span: 18 } }}
          className="w-full px-4 max-w-lg md:max-w-2xl"
          validateTrigger="onSubmit"
          onFinish={onFinish}
        >
          <Form.Item
            label="Country"
            name="name"
            rules={[{ required: true, message: "Country is Required" }]}
          >
            <Input />
          </Form.Item>

          {!isView && (
            <div className="flex justify-end sm:mb-2 md:mb-3 gap-2">
              <Button type="default" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>

              <FormButtons
                onClick={() => form.submit()}
                isPending={upsertLocations?.isPending}
                mode={mode}
              />
            </div>
          )}
        </Form>
      </Modal>
    </div >
  );
};

export default LocationForm;
