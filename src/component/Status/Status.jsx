import { Form, Select, Input } from 'antd';

const Status = ({ needBlock, isView, statusValue , facilityStatus }) => {
    const options = statusValue
        ?.filter((item) => (needBlock ? true : item?.code !== "blocked"))
        .map((item) => ({
            label: item.name,
            value: item.uuid,
        }));

    return (
        <Form.Item
            label={facilityStatus? "Facility Status" : "Status"}
            name={["status", "uuid"]}
            rules={[{ required: true, message: "Status is Required" }]}
            getValueProps={(value) => ({
                value: isView
                    ? statusValue?.find(item => item?.uuid === value)?.name
                    : value
            })}
        >
            {isView ? (
                <Input readOnly />
            ) : (
                <Select
                    options={options}
                    placeholder="Select Status"
                />
            )}
        </Form.Item>
    );
};

export default Status;