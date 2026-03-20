
import { Form } from 'antd';
import { Select } from 'antd';
import { queryClient } from './../../app/queryClient';
import { Input } from 'antd';

const Status = ({
    needBlock,
    isView
}) => {
    const initData = queryClient.getQueryData(["initData", "authenticated"])?.statuses.status;

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
                                        initData?.find(item => item?.uuid === value)?.name :
                                        value
                                })
                            }
                        }
                    >
                        {
                            isView ?
                                <Input readOnly={isView} /> :
                                <Select
                                    options={initData?.map((item) => ({
                                        label: item.name,
                                        value: item.uuid,
                                    }))}
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
                                        initData?.find(item => item?.uuid === value)?.name :
                                        value
                                })
                            }
                        }
                    >
                        {
                            isView ?
                                <Input readOnly={isView} /> :
                                <Select
                                    options={initData?.filter(item =>
                                        item?.code !== "blocked"
                                    ).map((item) => ({
                                        label: item.name,
                                        value: item.uuid,
                                    }))}
                                ></Select>
                        }

                    </Form.Item>

            }

        </>



    )
}

export default Status;