import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Dropdown, Space, Table } from "antd";
import { PERMISSIONS } from "../../variables/permission";


const GuestInformationTable = ({
    contactPersonInfo,
}) => {

    const columns = [
        {
            title: "Name",
            dataIndex: "fullName",
            key: "fullName",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            render: (text) => <div>{(text?.length === 10 && text?.startsWith("9"))  ? ` ${text}` : (text?.length === 11 && text?.startsWith("09"))? ` ${text.slice(1)}`: ` ${text}`}</div>
        },
        contactPersonInfo?.secondaryPhone && 
        {
            title: "Secondary Phone",
            dataIndex: "secondaryPhone",
            key: "secondaryPhone",
            render: (text) => <div>{(text?.length === 10 && text?.startsWith("9"))  ? ` ${text}` : (text?.length === 11 && text?.startsWith("09"))? ` ${text.slice(1)}`: ` ${text}`}</div>
        },

    ].filter(Boolean);

    return (
        <Table
            columns={columns}
            dataSource={[contactPersonInfo]}
            pagination={false}
        
        />
    )
}


export default GuestInformationTable;