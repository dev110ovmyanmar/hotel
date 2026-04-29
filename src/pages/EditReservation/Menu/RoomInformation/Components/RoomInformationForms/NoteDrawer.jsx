import React, { useEffect, useState } from "react";
import { Form, Input, Drawer, Button } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import GuestNoteForm from "./../../../../../GuestsListing/GuestNotes/components/GuestNoteForm";

const { TextArea } = Input;

const NoteDrawer = ({
  mode,
  setMode,
  open,
  onClose,
  selectedData,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const isView = mode === "view";
  const [noteOpen, setNoteOpen] = useState(false);

  useEffect(() => {
    if (open) {
      if (selectedData?.notes) {
        const notesArray = Array.isArray(selectedData.notes)
          ? selectedData.notes
          : [{ content: selectedData.notes }];
        form.setFieldsValue({ guestNotes: notesArray });
      } else {
        form.setFieldsValue({ guestNotes: [{ content: "" }] });
      }
    } else {
      form.resetFields();
    }
  }, [open, selectedData, form]);

  const onFinish = (values) => {
    console.log("Saving Guest Notes:", values.guestNotes);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={550}
      destroyOnClose
      title={
        <div className="flex justify-between items-center">
          <span>Service Note</span>
          <Button type="primary" onClick={() => form.submit()}>
            Create
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish} disabled={isView}>
        <Form.List name="guestNotes">
          {(fields, { add, remove }) => (
            <div className="flex flex-col gap-2">
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="relative group">
                  <Form.Item
                    {...restField}
                    label={<span className="text-gray-600">Service Note</span>}
                    name={[name, "content"]}
                  >
                    <TextArea
                      placeholder="Enter service details..."
                      className="rounded-md"
                    />
                  </Form.Item>
                </div>
              ))}

              {!isView && (
                <Button
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  className="custom-blue-btn w-40"
                >
                  Add Service Note
                </Button>
              )}
            </div>
          )}
        </Form.List>
      </Form>
    </Drawer>
  );
};

export default NoteDrawer;
