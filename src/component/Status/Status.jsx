
import { Form } from 'antd';
import { Select } from 'antd';
import { queryClient } from './../../app/queryClient';
import { Input } from 'antd';

const Status = ({
    needBlock,
    isView,
    statusValue
}) => {

    return (
        <>
            {
                needBlock ?
                    <Form.Item
                        label="Status"
                        name={["status", "uuid"]}
                        rules={[{ required: true, message: "Status  is Required" }]}
                        getValueProps={
                            (value) => {
                                return ({
                                    value: isView ?
                                        statusValue?.find(item => item?.uuid === value)?.name :
                                        value
                                })
                            }
                        }
                    >
                        {
                            isView ?
                                <Input readOnly={isView} /> :
                                <Select
                                    options={statusValue?.map((item) => ({
                                        label: item.name,
                                        value: item.uuid,
                                    }))}
                                    placeholder="Select Status"
                                    
                                ></Select>
                        }

                    </Form.Item>
                    :
                    <Form.Item
                        label="Status"
                        name={["status", "uuid"]}
                        rules={[{ required: true, message: "Status  is Required" }]}
                        getValueProps={
                            (value) => {
                                return ({
                                    value: isView ?
                                        statusValue?.find(item => item?.uuid === value)?.name :
                                        value
                                })
                            }
                        }
                    >
                        {
                            isView ?
                                <Input readOnly={isView} /> :
                                <Select
                                    options={statusValue?.filter(item =>
                                        item?.code !== "blocked"
                                    ).map((item) => ({
                                        label: item.name,
                                        value: item.uuid,
                                    }))}
                                    placeholder="Select Status"
                                    
                                ></Select>
                        }

                    </Form.Item>

            }

        </>



    )
}

export default Status;