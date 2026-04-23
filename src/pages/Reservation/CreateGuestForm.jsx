import React, { useState } from "react";
import { Button, Card, Col, DatePicker, Divider, Drawer, Form, Input, message, Row, Select, Table, TimePicker } from "antd";
import { values } from "lodash";

const CreateGuestForm = ({
    guestDrawerOpen,
    setGuestDrawerOpen,
    guestInfoTable,
    setGuestInfoTable
}) => {

    const onClick = () => {
        setGuestDrawerOpen(false),
        setGuestInfoTable(true)
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
            // footer={
            //     <>
            //         <Row gutter={16}>
            //             <Col span={12}>
            //                 <Button
            //                     style={{ width: "100%" }}
            //                 >
            //                     Cancel
            //                 </Button>
            //             </Col>
            //             <Col span={12}>
            //                 <Button
            //                     type="primary"
            //                     style={{ width: "100%" }}
            //                 >
            //                     Submit
            //                 </Button>
            //             </Col>
            //         </Row>


            //     </>
            // }
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

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Name Other Language"
                            name="nameOther"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Room No"
                            name="roomNo"
                        >
                            <Select
                                defaultValue="mr."
                                options={options}
                            >
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Divider />

                <h1>Contact Information</h1>

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

                <Form.Item
                    label="Email"
                    name="email"
                >
                    <Input />
                </Form.Item>

                <Divider />

                <h1>Address Information</h1>

                <Form.Item
                    label="Address"
                    name="address"
                >
                    <Input />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Country"
                            name="country"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="State"
                            name="state"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="City"
                            name="city"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Postal Code"
                            name="postalCode"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider />

                <h1>Personal Information</h1>

                <Form.Item
                    label="NRC No"
                    name="nrcno"
                    rules={[{ required: "true", message: "NRC Number is required." }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Passport No"
                    name="passportNo"
                    rules={[{ required: "true", message: "Passport Number is required." }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Nationality"
                    name="nationality"
                    rules={[{ required: "true", message: "Nationality is required." }]}
                >
                    <Input />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Gender"
                            name="gender"
                        >
                            <Select
                                defaultValue="Male"
                                options={options}
                            >
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Date Of Birth"
                            name="dob"
                        >
                            <DatePicker style={{width:"100%"}}/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Father Name"
                            name="fatherName"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Status"
                            name="status"
                        >
                            <Select
                                defaultValue="Active"
                                options={options}
                            >
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    )
};

export default CreateGuestForm;

