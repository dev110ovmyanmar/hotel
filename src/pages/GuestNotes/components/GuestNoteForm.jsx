import React, { useEffect, useMemo } from "react";
import { Form, Input, Drawer, Button, Select } from "antd";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import Toast from "../../../component/Toast/Toast";
import useApiQuery from "../../../hooks/useApiQuery";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { getGuestMeta, getGuestNoteDetail, upsertGuestNote } from "../../../api/guestNoteApi";

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
}) => {
    const [form] = Form.useForm();

    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isAdd = mode === "add";

    // 1. Fetch Detail API - Ensure we handle data.response based on your JSON structure
    const { data, isLoading } = useApiQuery({
        fetchQueryName: "guestNotes-detail",
        fetchQueryFunction: getGuestNoteDetail,
        params: { uuid: selectedRow?.uuid },
        options: { enabled: !!selectedRow?.uuid && drawerOpen },
    });

    const { data: guestMetaData } = useApiQuery({
        fetchQueryName: "guest-meta",
        fetchQueryFunction: getGuestMeta,
    })

    const guestList = guestMetaData?.guests?.map((guest) => ({
        value: guest.uuid,
        label: guest.name,
    }));

    // 2. Sync API data to Form Fields
    useEffect(() => {
        if (isAdd) {
            form.resetFields();
        } else if (data) {
            form.setFieldsValue({
                guest: data.guest?.uuid,
                note: data.note,
            });
        }
    }, [data, isAdd, form, drawerOpen]);

    // 3. Mutation for Create/Update
    const upsertMutation = useApiMutation({
        mutationFn: upsertGuestNote,
        invalidateKeys: [["guestNotes"]],
        shouldInvalidate: page === 1,
    });

    // 4. Handle Submit
    const onFinish = (values) => {
        const payload = {
            // The Note Entry UUID
            uuid: isEdit ? selectedRow?.uuid : undefined,
            // The Note content
            note: values.note,
            // Nested Guest reference
            guest: {
                // Fallback to selectedRow if data.response isn't loaded yet
                uuid: values?.guest
            },
        };

        upsertMutation.mutate(payload, {
            onSuccess: () => {
                handleClose();
                if (isAdd) setPage(1);
                Toast.success(`Guest Note ${isEdit ? "updated" : "created"} successfully.`);
            },
            onError: (err) => {
                // Log this to see why the "Method not allowed" is happening
                console.error("Mutation Error:", err);
            }
        });
    };

    const handleClose = () => {
        setDrawerOpen(false);
        setSelectedRow(null);
        form.resetFields();
    };

    return (
        <Drawer
            title={isView ? "View Guest Note" : isEdit ? "Edit Guest Note" : "Add Guest Note"}
            width={500}
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
                        isPending={upsertMutation.isPending}
                    />
                )
            }>
            {isLoading && !isAdd ? (
                <Loader />
            ) : (
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <div className="grid grid-cols-12 gap-y-2">

                        <div className="col-span-12">
                            {isView ? (
                                /* 1. Use a standard Form.Item without a 'name' attribute 
                                      so it doesn't force the UUID into the Input */
                                <Form.Item label="Guest Name" className="mb-2">
                                    <Input
                                        readOnly
                                        value={data?.guest.name}
                                    />
                                </Form.Item>
                            ) : (
                                /* 2. Use the named Form.Item only for Edit/Add modes */
                                <Form.Item
                                    label="Guest Name"
                                    name="guest"
                                    className="mb-2"
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        options={guestList}
                                        showSearch
                                        placeholder="Select Guest Name"
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())}
                                    />
                                </Form.Item>
                            )}
                        </div>

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