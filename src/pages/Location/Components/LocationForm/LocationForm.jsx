
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Image, Drawer, AutoComplete, Modal, Table, Space } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { CloseOutlined } from "@ant-design/icons";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { loadState } from "../../../../utils";
import { queryClient } from "../../../../app/queryClient";
import { createLocationFun, editLocationFun, locationDetailsFun } from "../../../../api/locationFunctionApi";
import { AiTwotoneEye } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import ContentBanner from "../../../../component/ContentBanner/ContentBanner";


const LocationForm = ({
  mode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  modalOpen,
  setModalOpen
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

  const createLocationFunction = useApiMutation({
    mutationFn: createLocationFun,
    invalidateKeys: [["locations"]]
  });

  const editLocationFunction = useApiMutation({
    mutationFn: editLocationFun,
    invalidateKeys: [["locations"]]
  });

  const { data, isPending, error } = useApiQuery({
    fetchQueryName: "locations",
    fetchQueryFunction: locationDetailsFun,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  if (data) {
    console.log(data, "DaTATTTTTTTTTTTTTTTTTTTTTTTt")
  }

  useEffect(() => {
    if (isEdit && data) {
      form.setFieldsValue({
        ...data,
      });
    }
  }, [data, isEdit]);

  useEffect(()=>{
    if(isAdd){
      form.resetFields()
    } 
    if(isCityAdd){
      cityForm.resetFields()
    }
  },[isAdd,isCityAdd]);

  const onFinish = (values) => {
    if (isAdd) {
      createLocationFunction.mutate(values, {
        onSuccess: () => {
          setModalOpen(false);
          Toast.success("Country Created Successfully!");
          form.resetFields()
        }
      })
    }

    if (isEdit) {
      const editValues = {
        ...values,
        uuid: selectedData?.uuid
      };

      editLocationFunction.mutate(editValues, {
        onSuccess: () => {
          setModalOpen(false);
          Toast.success("Country Updated Successfully!");
        }
      })
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: 'id',
      key: 'id',
      render: text => <div>{text}</div>

    },
    {
      title: "City",
      dataIndex: 'name',
      key: "name",
      render: text => <div>{text}</div>
    },
    {
      title: "Action",
      render: (_, record) => {
        return (
          <Space>
            <FiEdit className="text-blue-500" onClick={() => { setCreateDrawerOpen(true), setCityMode("cityEdit"), setSelectedCity(record) }} />
          </Space>
        )
      }
    }
  ];

  const onCityFinish = (values) => {

    if (isCityAdd) {
      setSelectedCity(null);
      const modifiedValues = {
        name: data?.name,
        uuid: data?.uuid,
        city: {
          name: values?.city.name
        }
      };
      createLocationFunction.mutate(modifiedValues, {
        onSuccess: () => {
          setCreateDrawerOpen(false);
          Toast.success("City Create Successfully!");
          
        }
      });
    }

    // Edit
    if (isCityEdit) {
      const editValues = {
        name: data?.name,
        uuid: data?.uuid,
        city: {
          name: values?.city.name,
          uuid: selectedCity.uuid
        }
      }
      editLocationFunction.mutate(editValues, {
        onSuccess: () => {
          setCreateDrawerOpen(false);
          Toast.success("City Updated Successfully!");
          
        }
      });
    }

  };

  useEffect(() => {
    if (!isCityAdd && isCityEdit && selectedCity) {
      cityForm.setFieldsValue({
        city: {
          name: selectedCity.name
        }
      });
    }
  }, [selectedCity, !isCityAdd]);

  return (
    <div className="flex justify-center" >
      {isView && (
        <Drawer
          destroyOnClose
          size={500}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          closable={false}
          extra={
            < CloseOutlined
              onClick={() => setDrawerOpen(false)}
              style={{ fontSize: 18, cursor: "pointer" }}
            />
          }
          title={
            <>
              <span style={{ fontWeight: "normal" }}>Country: </span>
              <span >{data?.name}</span>
            </>
          }
        >
          <ContentBanner
            btntext="Create City"
            smallbuttonsize="true"
            setCreateDrawerOpen={setCreateDrawerOpen}
            setCityMode={setCityMode}
          />

          <Table
            size="small"
            columns={columns}
            dataSource={data?.city}
            rowKey="uuid"
            className="my-3"
            pagination={false}
          >
          </Table>

          <Drawer
            open={createDrawerOpen}
            onClose={() => setCreateDrawerOpen(false)}
            closable={false}
            extra={
              <CloseOutlined
                onClick={() => setCreateDrawerOpen(false)}
                style={{ fontSize: 18, cursor: "pointer" }}
              />
            }
            title={
              isCityAdd ? "Create City" : "Edit City"
            }
            
          >
            <Form
              form={cityForm}
              onFinish={onCityFinish}
            >

              <Form.Item label="City" name={["city", "name"]} rules={[{ required: true, message: "City is required" }]}>
                <Input />
              </Form.Item>

              <div className="flex justify-end">
                <Button
                  onClick={() => setCreateDrawerOpen(false)}
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button htmlType="submit" type="primary" loading={isCityAdd ? createLocationFunction.isPending : editLocationFunction.isPending}>
                  {isCityAdd ? "Create" : "Save"}
                </Button>
              </div>
            </Form>
          </Drawer>
        </Drawer >
      )}

      <Modal
        width={400}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title={
          mode === "add" ?
            "Create Country" :
            "Edit Country"
        }
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
          <Form.Item label="Country" name="name" rules={[{ required: true, message: "Country is Required" }]}>
            <Input />
          </Form.Item>


          {!isView && (
            <div className="flex justify-end sm:mb-2 md:mb-3" >
              <Button
                type="default"
                onClick={() => setModalOpen(false)}
                className="me-2"
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={isAdd? createLocationFunction.isPending : editLocationFunction.isPending}>
                {isAdd ? "Create" : "Save"}
              </Button>
            </div>
          )}
        </Form>
      </Modal>

    </div >
  )
};


export default LocationForm
