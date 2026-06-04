import React from 'react';
import { Button, Dropdown, Space } from 'antd';
import { KeyOutlined, LogoutOutlined, MenuOutlined, MoonOutlined, PlusOutlined, PrinterOutlined, ReloadOutlined, SunOutlined, UserOutlined } from '@ant-design/icons';

const TopBarDropDown = ({
    addReservation,
    darklighmode,
    refreshInitData,
    logoutmodal,
    changePassword,
    profileDrawer,
    refreshing
}) => {
    const theme = localStorage.getItem("theme");

    const items = [
        {
            key: '1',
            icon: <PlusOutlined />,
            label: (
                <a onClick={addReservation}>
                    Add Reservation
                </a>
            ),
        },
        {
            key: '2',
            icon: <PrinterOutlined />,
            label: (
                <a >
                    Print Reservation
                </a>
            ),
        },
        {
            key: '3',
            icon: <UserOutlined />,
            label: (
                <a onClick={profileDrawer}>
                    Profile
                </a>
            ),
        },
        {
            key: '4',
            icon: theme === "light" ? <MoonOutlined /> : <SunOutlined />,
            label: (
                <a onClick={darklighmode}>
                    Dark/Light Mode
                </a>
            ),
        },
        // {
        //     key: '5',
        //     icon: <ReloadOutlined />,
        //     label: (
        //         <a onClick={refreshInitData}>
        //             Refresh
        //         </a>
        //     ),
        // },
        {
            key: '6',
            icon: <KeyOutlined />,
            label: (
                <a onClick={changePassword}>
                    Change Password
                </a>
            ),
        },
        {
            key: '7',
            icon: <LogoutOutlined />,
            label: (
                <a onClick={logoutmodal}>
                    Logout
                </a>
            ),
        },

    ];
    return (
        <Space vertical className='!hidden sm:!flex lg:!hidden' >
            <div className='flex mt-3'>
                <Button
                    type="text"
                    loading={refreshing}
                    icon={<ReloadOutlined style={{ fontSize: 18 }} />}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 mx-6"
                    onClick={refreshInitData}
                />

                <Dropdown menu={{ items }} placement="bottomRight">
                    <MenuOutlined />
                </Dropdown>
            </div>
        </Space>
    )
};
export default TopBarDropDown;