import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Drawer,
  DatePicker,
  Row,
  Col,
  Checkbox,
} from "antd";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import FormButton from "../../../../component/FormButtons/FormButtons";
import { createStaff, editStaff, staffDetails } from "../../../../api/staffApi";
import dayjs from "dayjs";
import { getFormattedDate } from "../../../../utils";
import Loader from "../../../../component/Loader/Loader";
import { PERMISSIONS } from "../../../../variables/permission";
import usePermission from "../../../../hooks/usePermission";
import Toast from "../../../../component/Toast/Toast";

const SEARCH_FILTER = {
  filterOption: (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
};

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
  const phoneValue = Form.useWatch("phone", form);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";
  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.STAFF_EDIT);

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isCurrent, setIsCurrent] = useState(false);

  const statuses = initData?.statuses?.status
    ?.filter((item) => item.code !== "blocked")
    ?.map((s) => ({ value: s.uuid, label: s.name }));

  const departments = initData?.departments?.map((d) => ({
    value: d.uuid,
    label: d.name,
  }));

  const genders = initData?.genders?.map((g) => ({
    value: g.uuid,
    label: g.name,
  }));

  const region = initData?.nrcLocations?.map((loc) => ({
    value: loc.srNo,
    label: loc.srNo,
  }));

  const township = initData?.nrcLocations
    ?.find((loc) => loc.srNo === selectedRegion)
    ?.nrcTownships?.map((nrc) => ({ value: nrc.name, label: nrc.name }));

  const citizenship = initData?.statuses?.nrc_type?.map((type) => ({
    value: type.code,
    label: type.code,
  }));

  const handleCurrentChange = (e) => {
    const checked = e.target.checked;
    setIsCurrent(checked);
    if (checked) {
      form.setFieldsValue({ endedAt: null });
    }
  };

  const createStaffs = useApiMutation({
    mutationFn: createStaff,
    invalidateKeys: [["staffDataList"]],
    shouldInvalidate: page === 1,
  });

  const editStaffs = useApiMutation({
    mutationFn: editStaff,
    invalidateKeys: [["staffDataList"]],
  });

  const { data, isFetching } = useApiQuery({
    fetchQueryName: "staffData",
    fetchQueryFunction: staffDetails,
    params: { uuid: selectedData?.uuid },
    options: { enabled: !!selectedData?.uuid },
  });

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
      const defaultStatus = statuses?.find(
        (s) => s.label.toLowerCase() === "active",
      )?.value;
      form.setFieldsValue({ status: defaultStatus });
    } else if (data) {
      const nrcSrNo = data?.nrc?.srNo || null;
      const nrcTownship = data?.nrc?.township || null;
      const nrcType = data?.nrc?.type || null;
      const nrcNumber = data?.nrc?.number || null;

      form.setFieldsValue({
        ...data,
        department: data?.department?.uuid,
        genderUuid: data?.gender?.uuid,
        nrcType,
        nrcSrNo,
        nrcTownship,
        nrcNumber,
        joinedAt: data?.joinedAt ? dayjs(data.joinedAt) : null,
        endedAt: data?.endedAt ? dayjs(data.endedAt) : null,
        status: data?.status?.uuid,
      });
      setSelectedRegion(nrcSrNo);
    }
  }, [data, isAdd]);

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

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
      endedAt: getFormattedDate(values.endedAt, false),
      nrc: nrcObj,
      nrcNo,
      department: { uuid: values.department },
      gender: { uuid: values.genderUuid },
      citizenship: { uuid: values.nrc_type },
      status: { uuid: values.status },
    };

    const onSuccess = (message) => {
      handleClose();
      setDrawerOpen(false);
      if (isAdd) setPage(1);
      Toast.success(message);
    };

    if (isAdd) {
      createStaffs.mutate(formattedValues, {
        onSuccess: () => onSuccess("Staff Created Successfully!"),
      });
    } else if (isEdit) {
      editStaffs.mutate({ ...formattedValues, uuid: data?.uuid }, {
        onSuccess: () => onSuccess("Staff Updated Successfully!"),
      });
    }
  };

  return (
    <Drawer
      open={drawerOpen}
      onClose={handleClose}
      size={600}
      title={
        <div className="flex justify-between items-center">
          <span>
            {isView ? "Staff Details" : isEdit ? "Edit Staff" : "Create Staff"}
          </span>
          {isView ? (
            canEdit && (
              <Button type="primary" onClick={() => setMode("edit")}>
                Edit
              </Button>
            )
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
      {isFetching ? (
        <div className="flex items-center justify-center h-full min-h-[300px]">
          <Loader />
        </div>
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            {isView &&
              <Input
                readOnly
                suffix={
                  !data?.endedAt ?
                    <div className="text-green-600 border border-green-500 bg-green-100 font-medium text-xs whitespace-nowrap p-1 rounded-md">
                      Currently Working
                    </div> :
                    <div className="text-red-600 border border-red-500 bg-red-100 font-medium text-xs whitespace-nowrap p-1 rounded-md">
                      No Longer Working
                    </div>
                }
              />
              }
              {isAdd && <Input placeholder="Enter Staff Name" />}
              {isEdit && <Input
                suffix={
                  !data?.endedAt ?
                    <div className="text-green-600 border border-green-500 bg-green-100 font-medium text-xs whitespace-nowrap p-1 rounded-md">
                      Currently Working
                    </div> :
                    <div className="text-red-600 border border-red-500 bg-red-100 font-medium text-xs whitespace-nowrap p-1 rounded-md">
                      No Longer Working
                    </div>
                }
              />}
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please select department" }]}
            getValueProps={(value) => ({
              value: isView
                ? departments.find((d) => d.value === value)?.label
                : value,
            })}
          >
            {isView ? (
              <Input readOnly />
            ) : (
              <Select
                showSearch={SEARCH_FILTER}
                options={departments}
                placeholder="Select Department"
                onChange={() => form.setFieldValue("chargeValue", undefined)}
              />
            )}
          </Form.Item>

          <Form.Item
            label="Position"
            name="position"
            rules={[{ required: true, message: "Please enter position" }]}
          >
            <Input placeholder="Enter Position" readOnly={isView} />
          </Form.Item>

          <Form.Item
            label="NRC No"
            name="nrcNo"
            rules={[{ required: true, message: "Please enter NRC number" }]}
            style={{ marginBottom: 0 }}
          >
            <Row gutter={5}>
              <Col span={4}>
                <Form.Item
                  name="nrcSrNo"
                  rules={[{ required: true, message: "Required" }]}
                  getValueProps={(value) => ({
                    value: isView
                      ? region.find((r) => r.value === value)?.label
                      : value,
                  })}
                >
                  {isView ? (
                    <Input readOnly />
                  ) : (
                    <Select
                      showSearch={SEARCH_FILTER}
                      options={region}
                      placeholder="Region"
                      onChange={(value) => {
                        setSelectedRegion(value);
                        form.setFieldsValue({ nrcTownship: null });
                      }}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={1} className="text-center font-bold">
                /
              </Col>

              <Col span={7}>
                <Form.Item
                  name="nrcTownship"
                  rules={[{ required: true, message: "Required" }]}
                  getValueProps={(value) => ({
                    value: isView
                      ? township?.find((t) => t.value === value)?.label
                      : value,
                  })}
                >
                  {isView ? (
                    <Input readOnly />
                  ) : (
                    <Select
                      showSearch={SEARCH_FILTER}
                      options={township}
                      placeholder="Township"
                      disabled={!selectedRegion}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  name="nrcType"
                  rules={[{ required: true, message: "Required" }]}
                  getValueProps={(value) => ({
                    value: isView
                      ? citizenship.find((c) => c.value === value)?.label
                      : value,
                  })}
                >
                  {isView ? (
                    <Input readOnly />
                  ) : (
                    <Select
                      showSearch={SEARCH_FILTER}
                      options={citizenship}
                      placeholder="Type"
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="nrcNumber"
                  rules={[
                    { required: true, message: "Required" },
                    { pattern: /^\d{6}$/, message: "Must be exactly 6 digits" },
                  ]}
                >
                  <Input
                    placeholder="123456"
                    maxLength={6}
                    readOnly={isView}
                    onKeyDown={(e) => {
                      const allowedKeys = ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
                      if (allowedKeys.includes(e.key)) return;
                      if (!/[0-9]/.test(e.key)) e.preventDefault();
                    }}
                    onChange={(e) => {
                      form.setFieldValue("nrcNumber", e.target.value.replace(/\D/g, ""));
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="Passport" name="passport">
            <Input placeholder="Enter Passport" readOnly={isView} />
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <Input
              maxLength={20}
              onKeyDown={(e) => {
                const allowedKeys = ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
                if (allowedKeys.includes(e.key)) return;
                if (!/[0-9]/.test(e.key) && !(e.key === "+" && phoneValue?.length === 0)) {
                  e.preventDefault();
                }
              }}
              readOnly={isView}
              placeholder="Enter Phone Number"
            />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input placeholder="Enter Email Address" readOnly={isView} />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="genderUuid"
            rules={[{ required: true, message: "Please select gender" }]}
            getValueProps={(value) => ({
              value: isView
                ? genders.find((g) => g.value === value)?.label
                : value,
            })}
          >
            {isView ? (
              <Input readOnly />
            ) : (
              <Select
                showSearch={SEARCH_FILTER}
                options={genders}
                placeholder="Select Gender"
              />
            )}
          </Form.Item>

          <Form.Item
            label="Joined Date"
            name="joinedAt"
            rules={[{ required: true, message: "Please select joined date" }]}
            getValueProps={(value) => ({
              value: isView
                ? value?.format("DD/MM/YYYY") || ""
                : value,
            })}
          >
            {isView ? (
              <Input readOnly />
            ) : (
              <DatePicker
                className="w-full"
                placeholder="Select Joined Date"
                allowClear
              />
            )}
          </Form.Item>

            {
            (isView && data?.endedAt) &&
            <Form.Item label="Left Date" name="endedAt"
            getValueProps={(value) => ({
              value: isView
                ? value?.format("DD/MM/YYYY") || ""
                : value,
            })}
          >
              <Input readOnly />
            </Form.Item> 
            }

            {
              isEdit && 
            <Form.Item label="Left Date" name="endedAt">
              <DatePicker
                className="w-full"
                allowClear={false}
              />
            </Form.Item> 
            }

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
            getValueProps={(value) => ({
              value: isView
                ? statuses.find((s) => s.value === value)?.label
                : value,
            })}
          >
            {isView ? (
              <Input readOnly />
            ) : (
              <Select options={statuses} placeholder="Select Status" />
            )}
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default StaffsForm;
