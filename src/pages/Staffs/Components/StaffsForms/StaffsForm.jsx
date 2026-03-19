import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Drawer,
  DatePicker,
  Row,
  Col,
} from "antd";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import FormButton from "../../../../component/FormButtons/FormButtons";
import { createStaff, editStaff, staffDetails } from "../../../../api/staffApi";
import dayjs from "dayjs";
import { getFormattedDate } from "../../../../utils";

const StaffsForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  setPage,
  page,
}) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const departments = initData?.departments?.map((department) => ({
    value: department.uuid,
    label: department.name,
  }));

  const genders = initData?.genders?.map((gender) => ({
    value: gender.uuid,
    label: gender.name,
  }));

  const region = initData?.nrcLocations?.map((loc) => ({
    value: loc.srNo,
    label: loc.srNo,
  }));

  const township = initData?.nrcLocations
    ?.find((loc) => loc.srNo === selectedRegion)
    ?.nrcTownships?.map((nrc) => ({
      value: nrc.name,
      label: nrc.name,
    }));

  const citizenship = initData?.statuses?.nrc_type?.map((type) => ({
    value: type.code,
    label: type.code,
  }));

  const createStaffs = useApiMutation({
    mutationFn: createStaff,
    invalidateKeys: [["staffData"]],
    shouldInvalidate: page === 1,
  });

  const editStaffs = useApiMutation({
    mutationFn: editStaff,
    invalidateKeys: [["staffData"]],
  });

  const { data } = useApiQuery({
    fetchQueryName: "staffData",
    fetchQueryFunction: staffDetails,
    params: { uuid: selectedData?.uuid },
    options: { enabled: !!selectedData?.uuid },
  });
  useEffect(() => {
    if (!isAdd && data) {
      const nrcSrNo = data?.nrc?.srNo || null;
      const nrcTownship = data?.nrc?.township || null;
      const nrcType = data?.nrc?.type || null;
      const nrcNumber = data?.nrc?.number || null;

      form.setFieldsValue({
        ...data,
        department: data?.department?.uuid,
        genderUuid: data?.gender?.uuid,
        nrcType: nrcType,
        nrcSrNo: nrcSrNo,
        nrcTownship: nrcTownship,
        nrcNumber: nrcNumber,
        joinedAt: data?.joinedAt ? dayjs(data.joinedAt) : null,
      });
      setSelectedRegion(nrcSrNo);
      setSelectedData(data);
    }
  }, [data]);

  const onFinish = (values) => {
    const nrcObj = {
      srNo: values.nrcSrNo,
      township: values.nrcTownship,
      type: values.nrcType,
      number: values.nrcNumber,
    };

    const nrcNo = `${values.nrcSrNo}/${values.nrcTownship}(${values.nrcType})${values.nrcNumber}`;

    const formattedValues = {
      ...values,
      joinedAt: getFormattedDate(values.joinedAt, false),
      nrc: nrcObj,
      nrcNo: nrcNo,
    };

    if (isAdd) {
      const createValues = {
        ...formattedValues,
        department: { uuid: values.department },
        gender: { uuid: values.genderUuid },
        citizenship: { uuid: values.nrc_type },
      };

      createStaffs.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Staff Created Successfully!");
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...formattedValues,
        department: { uuid: values.department },
        gender: { uuid: values.genderUuid },
        citizenship: { uuid: values.nrc_type },
        uuid: data?.uuid,
      };

      editStaffs.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Staff Updated Successfully!");
        },
      });
    }
  };
  return (
    <>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={600}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Staff Details"
                : mode === "edit"
                  ? "Edit Staff"
                  : "Create Staff"}
            </span>

            {isView ? (
              <Button type="primary" onClick={() => setMode("edit")}>
                Edit
              </Button>
            ) : (
              <FormButton
                onClick={() => form.submit()}
                isPending={createStaffs.isPending || editStaffs.isPending}
                mode={mode}
              />
            )}
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={isView}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter staff name" />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please select departmment" }]}
          >
            <Select options={departments} placeholder="Select department" />
          </Form.Item>

          <Form.Item
            label="Position "
            name="position"
            rules={[{ required: true, message: "Please enter position" }]}
          >
            <Input placeholder="Enter Room Type" />
          </Form.Item>

          <Form.Item
            label="NRC No"
            name="nrcNo"
            rules={[{ required: true, message: "" }]}
          >
            <Row gutter={5}>
              <Col span={4}>
                <Form.Item name="nrcSrNo" rules={[{ required: true }]}>
                  <Select
                    options={region}
                    placeholder="Region"
                    onChange={(value) => {
                      setSelectedRegion(value);
                      form.setFieldsValue({ nrcTownship: null });
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={1} className="text-center">
                /
              </Col>

              <Col span={7}>
                <Form.Item name="nrcTownship" rules={[{ required: true }]}>
                  <Select
                    options={township}
                    placeholder="Township"
                    disabled={!selectedRegion || isView}
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item name="nrcType" rules={[{ required: true }]}>
                  <Select options={citizenship} placeholder="Type" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="nrcNumber" rules={[{ required: true }]}>
                  <Input placeholder="Number" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <Input placeholder="Enter phone" />
          </Form.Item>

          <Form.Item label="Passport" name="passport">
            <Input placeholder="Enter passport" />
          </Form.Item>

          <Form.Item
            label="Joined Date"
            name="joinedAt"
            rules={[{ required: true, message: "Please select Date" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item label="Gender" name="genderUuid">
            <Select options={genders} placeholder="Select gender" />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default StaffsForm;
