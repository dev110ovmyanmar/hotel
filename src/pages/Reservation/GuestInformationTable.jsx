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
            render: (text) => <div>{(text?.length === 10 && text?.startsWith("9"))  ? `+95 ${text}` : (text?.length === 11 && text?.startsWith("09"))? `+95 ${text.slice(1)}`: `+959 ${text}`}</div>
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