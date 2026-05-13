import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Drawer,
  Button,
  Table,
  Divider,
  Space,
  Popconfirm,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const NoteDrawer = ({ mode, open, onClose, selectedData, onSuccess }) => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [editValue, setEditValue] = useState("");

  const isView = mode === "view";

  useEffect(() => {
    if (open) {
      const notes = [].concat(selectedData?.notes || []);
      setDataSource(
        notes.map((n, i) => ({
          id: n.id || `n-${i}`,
          content: n.content || n,
        })),
      );
    }
  }, [open, selectedData]);

  const updateNotes = (newList) => {
    setDataSource(newList);
    onSuccess?.(newList);
  };

  const onAdd = async () => {
    const { noteContent } = await form.validateFields();
    const newNote = { id: Date.now().toString(), content: noteContent };
    updateNotes([newNote, ...dataSource]);
    form.resetFields();
  };

  const onDelete = (id) =>
    updateNotes(dataSource.filter((item) => item.id !== id));

  const onSaveEdit = (id) => {
    updateNotes(
      dataSource.map((item) =>
        item.id === id ? { ...item, content: editValue } : item,
      ),
    );
    setEditingKey("");
  };

  const columns = [
    {
      title: "Note",
      render: (_, record) =>
        record.id === editingKey ? (
          <Input.TextArea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoSize
          />
        ) : (
          record.content
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
              <CheckOutlined
                className="text-green-500"
                onClick={() => onSaveEdit(record.id)}
              />
              <CloseOutlined
                className="text-red-500"
                onClick={() => setEditingKey("")}
              />
            </>
          ) : (
            <>
              <EditOutlined
                className="text-blue-500"
                onClick={() => {
                  setEditingKey(record.id);
                  setEditValue(record.content);
                }}
              />
              <Popconfirm title="Delete?" onConfirm={() => onDelete(record.id)}>
                <DeleteOutlined className="text-red-500" />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ].filter((c) => !c.hidden);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Room Notes"
      width={500}
      extra={
        !isView && (
          <Button type="primary" onClick={onAdd}>
            Create
          </Button>
        )
      }
    >
      {!isView && (
        <Form form={form} layout="vertical">
          <Form.Item
            label="Note"
            name="noteContent"
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder="Add a new note..." />
          </Form.Item>
        </Form>
      )}
      <Divider>History</Divider>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        pagination={false}
        size="small"
      />
    </Drawer>
  );
};

export default NoteDrawer;
