import React, { useState } from "react";
import { Button, Card, Col, DatePicker, Divider, Drawer, Form, Input, message, Row, Select, Table, TimePicker } from "antd";
import { values } from "lodash";

const CreateGuestForm = ({
    guestDrawerOpen,
    setGuestDrawerOpen,
    guestInfoTable,
    setGuestInfoTable,
    clickCreateContact,
    setClickCreateContact
}) => {

    const onClick = () => {
        setGuestDrawerOpen(false),
        setGuestInfoTable(true),
        setClickCreateContact(true)
    };

    const options = [
        { label: "Mr.", value: "mr." },
        { label: "Mrs.", value: "mrs." }
    ];

    return (
        <Drawer
            size={550}
            open={guestDrawerOpen}
            onClose={() => setGuestDrawerOpen(false)}
            title={
                <div className="flex justify-between gap-4">
                    <span>Create Guest</span>
                    <Button type="primary" onClick={onClick}>Create</Button>
                </div>
            }
        >
            <Form
                layout="vertical"
            >
                <Row gutter={16}>
                    <Col span={4}>
                        <Form.Item
                            label="Title"
                            name="title"
                        >
                            <Select
                                defaultValue="mr."
                                options={options}
                            >
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={20}>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: "true", message: "Name is required." }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <h1 className="!mb-2 !font-bold">Contact Information</h1>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Phone No 1"
                            name="phoneNoOne"
                            rules={[{ required: "true", message: "Phone Number is required." }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Phone No 2"
                            name="phoneNoTwo"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
        </Drawer>
    )
};

export default CreateGuestForm;

