import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Dropdown, Space, Table } from "antd";
import { PERMISSIONS } from "../../variables/permission";


const GuestInformationTable = ({
    guestInfoTable,
    setGuestInfoTable,
    contactPersonInfo,
    setContactPersonInfo
}) => {

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            render: (text) => <div>{text}</div>
        }

    ];

    return (
        <Table
            columns={columns}
            dataSource={[contactPersonInfo]}
            pagination={false}
        
        />
    )
}


export default GuestInformationTable;