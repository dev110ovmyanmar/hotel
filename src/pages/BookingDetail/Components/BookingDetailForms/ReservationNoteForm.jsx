import React, { useState } from "react";
import {
  Form,
  Input,
  Drawer,
  Button,
  Table,
  Divider,
  Space,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  reservationNoteCreate,
  reservationNoteDelete,
  reservationNoteList,
} from "../../../../api/reservationSectionApi";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import Toast from "../../../../component/Toast/Toast";
import { LIMITS } from "../../../../variables/constants";
import useApiQuery from "../../../../hooks/useApiQuery";
import Loader from "../../../../component/Loader/Loader";

const ReservationNoteForm = ({
  mode,
  open,
  onClose,
  selectedData,
  onSuccess,
  reservationUuid,
  reservationRoomUuid
}) => {

  const [form] = Form.useForm();

  const isView = mode === "view";

  const uuid = reservationUuid;
  const roomUuid = reservationRoomUuid;

  const [editingKey, setEditingKey] = useState("");
  const [editValue, setEditValue] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);

  const { data, isFetching, refetch } = useApiQuery({
    fetchQueryName: "reservation-note",
    fetchQueryFunction: reservationNoteList,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
      reservation: { uuid: uuid },
    },
    options: {
      enabled: open,
    },
  });

  const reservationNotesCreate = useApiMutation({
    mutationFn: reservationNoteCreate,
  });

  const reservationNotesDelete = useApiMutation({
    mutationFn: reservationNoteDelete,
    invalidateKeys: [["reservation-note", { uuid: selectedData?.uuid }]],
  });

  const onFinish = (values) => {
    const payload = {
      note: values.noteContent,
      reservation: { uuid: uuid },
    };

    reservationNotesCreate.mutate(payload, {
      onSuccess: () => {
        Toast.success("Note Created Successfully!");
        form.resetFields();
        refetch?.();
        onSuccess?.();
      },
    });
  };
  const editNote = (record) => {
    const payload = {
      note: editValue,
      uuid: record?.uuid,
      reservation: { uuid },
      reservationRoom: { uuid: roomUuid },
    };

    reservationNotesCreate.mutate(payload, {
      onSuccess: () => {
        Toast.success("Note updated successfully!");
        setEditingKey("");
        setEditValue("");
        refetch?.();
        onSuccess?.();
      },
    });
  };

  const deleteNote = (record) => {
    const payload = {
      uuid: record?.uuid,
    };

    reservationNotesDelete.mutate(payload, {
      onSuccess: () => {
        Toast.success("Note deleted successfully!");
        refetch?.();
        onSuccess?.();
      },
    });
  };

  const columns = [
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
      align: "center",
      render: (_, record) => {
        return record?.reservationRoom == null
          ? "-"
          : <span className="text-black">{record?.reservationRoom?.room?.roomNo}</span>;
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (_, record) =>
        record.id === editingKey ? (
          <Input.TextArea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoSize
          />
        ) : (
          record.note
        ),
    },
    {
      title: "Action",
      hidden: isView,
      width: 100,
      render: (_, record) => (
        <Space>
          {record.id === editingKey ? (
            <>
              <Tooltip title="Save">
                <CheckOutlined
                  className="text-green-500 cursor-pointer"
                  onClick={() => editNote(record)}
                />
              </Tooltip>

              <Tooltip title="Cancel">
                <CloseOutlined
                  className="text-red-500 cursor-pointer"
                  onClick={() => setEditingKey("")}
                />
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title="Edit">
                <EditOutlined
                  className="text-blue-500 cursor-pointer"
                  onClick={() => {
                    setEditingKey(record.id);
                    setEditValue(record.note);
                  }}
                />
              </Tooltip>

              <Tooltip title="Delete">
                <Popconfirm
                  title="Delete?"
                  onConfirm={() => deleteNote(record)}
                >
                  <DeleteOutlined className="text-red-500 cursor-pointer" />
                </Popconfirm>
              </Tooltip>
            </>
          )}
        </Space>
      ),
    }

  ].filter((c) => !c.hidden);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Reservation Notes"
      size={550}
      extra={
        !isView && (
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => form.submit()}
            loading={reservationNotesCreate.isPending}
          >
            Create
          </Button>
        )
      }
    >
      {isFetching ? (
        <div className="flex min-h-screen items-center justify-center">
          <Loader />
        </div>
      ) : (
        !isView && (
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Note"
              name="noteContent"
              rules={[
                {
                  required: true,
                  message: "Please input your note content!",
                },
              ]}
            >
              <Input.TextArea placeholder="Add a new note..." />
            </Form.Item>
          </Form>
        )
      )}


      {data?.data && data.data.length > 0 && (
        <>
          <Divider>History</Divider>

          <Table
            dataSource={data.data}
            columns={columns}
            rowKey="id"
            pagination={false}
            loading={
              isFetching ||
              reservationNotesDelete.isPending ||
              reservationNotesCreate.isPending
            }
            size="small"
          />
        </>
      )}
    </Drawer>
  );
};

export default ReservationNoteForm;
