import React, { useEffect, useMemo } from "react";
import { Form, Input, Drawer, Button, Select } from "antd";
import { useLocation } from "react-router-dom";
import Loader from "../../../../component/Loader/Loader";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import Toast from "../../../../component/Toast/Toast";
import useApiQuery from "../../../../hooks/useApiQuery";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import { getGuestNoteDetail, upsertGuestNote } from "../../../../api/guestNoteApi";


const { TextArea } = Input;

const GuestNoteForm = ({
    mode,
    setMode,
    drawerOpen,
    setDrawerOpen,
    selectedRow,
    setSelectedRow,
    setPage,
    page,
    guestUuid,
    // guestName,
}) => {
    const [form] = Form.useForm();

    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isAdd = mode === "add";

    // 1. Fetch Detail API - Ensure we handle data.response based on your JSON structure
    const { data, isFetching } = useApiQuery({
        fetchQueryName: "guestNotes-detail",
        fetchQueryFunction: getGuestNoteDetail,
        params: {
            uuid: selectedRow?.uuid,
            partnerType: "Guest"
        },
        options: { enabled: !!selectedRow?.uuid && drawerOpen },
    });

    useEffect(() => {
        if (isAdd) {
            form.resetFields();
        } else if (data) {
            form.setFieldsValue({
                // guest: data.guest?.name,
                guest: data.guest.uuid,
                note: data.note,
            });
        }
    }, [data, isAdd, form, drawerOpen]);

    const createNote = useApiMutation({
        mutationFn: upsertGuestNote,
        invalidateKeys: [["guestNotes"]],
        // shouldInvalidate: page === 1,
    });

    const updateNote = useApiMutation({
        mutationFn: upsertGuestNote,
        invalidateKeys: [["guestNotes"]],
    })

    // 4. Handle Submit
    const onFinish = (values) => {
        const payload = {
            uuid: isEdit ? selectedRow?.uuid : null,
            note: values.note,
            guest: {
                uuid: isAdd ? guestUuid : selectedRow?.guest?.uuid
            },
        };

        if (isAdd) {
            createNote.mutate(payload, {
                onSuccess: () => {
                    handleClose();
                    setPage(1);
                    Toast.success(`Guest Note ${isEdit ? "updated" : "created"} successfully.`);
                }
            })
        } else {
            updateNote.mutate(payload, {
                onSuccess: () => {
                    handleClose();
                    Toast.success(`Guest Note ${isEdit ? "updated" : "created"} successfully.`);
                }
            })
        }
    };

    const handleClose = () => {
        setDrawerOpen(false);
        setSelectedRow(null);
        form.resetFields();
    };

    return (
        <Drawer
            title={isView ? "Guest Note Details" : isEdit ? "Edit Guest Note" : "Add Guest Note"}
            size={550}
            onClose={handleClose}
            open={drawerOpen}
            extra={
                isView ? (
                    <Button type="primary" onClick={() => setMode("edit")}>
                        Edit
                    </Button>
                ) : (
                    <FormButtons
                        onClick={() => form.submit()}
                        mode={mode}
                        isPending={isEdit ? updateNote.isPending : createNote.isPending}
                    />
                )
            }>
            {isFetching && !isAdd ? (
                <Loader />
            ) : (
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <div className="grid grid-cols-12 gap-y-2">
                        <div className="col-span-12">
                            <Form.Item
                                label="Note Content"
                                name="note"
                                rules={[{ required: true, message: "Please enter the note content" }]}>

                                <TextArea
                                    readOnly={isView}
                                    placeholder="Enter internal guest remarks or notes here..."
                                    style={{
                                        cursor: isView ? "default" : "text"
                                    }} />
                            </Form.Item>
                        </div>

                    </div>
                </Form>
            )}
        </Drawer>
    );
};

export default GuestNoteForm;