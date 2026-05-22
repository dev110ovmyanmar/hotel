import { Divider, Drawer } from "antd";
import { useState } from "react";

const ThemeDrawer = ({
    open,
    onClose,
    headerColor,
    setHeaderColor,
    bodyColor,
    setBodyColor,
    sideBarColor,
    setSideBarColor,
    footerColor,
    setFooterColor
}) => {

    const handleHeaderColorChange = (color) => {
        setHeaderColor(color);
        localStorage.setItem("headerColor", color);
    };

    const handleBodyColorChange = (color) => {
        setBodyColor(color);
        localStorage.setItem("bodyColor", color);
    };

    const handleSiderColorChange = (color) => {
        setSideBarColor(color);
        localStorage.setItem("sideBarColor", color);
    };

    const handleFooterColorChange = (color) => {
        setFooterColor(color);
        localStorage.setItem("footerColor", color);
    };
    return (
        <Drawer
            title="ThemeDrawer"
            open={open}
            onClose={onClose}
            
        >
            <div>
                <h1 className="font-bold mb-3">Header</h1>
                <div className="flex gap-2 cursor-pointer">
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-red-500" onClick={() => handleHeaderColorChange("!bg-red-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-green-500" onClick={() => handleHeaderColorChange("!bg-green-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-yellow-500" onClick={() => handleHeaderColorChange("!bg-yellow-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-gray-500" onClick={() => handleHeaderColorChange("!bg-gray-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-white-500" onClick={() => handleHeaderColorChange("!bg-white")} ></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-blue-500" onClick={() => handleHeaderColorChange("!bg-blue-500")}></span>
                </div>
            </div>

            {/* <Divider />

            <div className="my-6">
                <h1 className="font-bold my-3">Body</h1>
                <div className="flex gap-2 cursor-pointer">
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-red-500" onClick={() => handleBodyColorChange("!bg-red-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-green-500" onClick={() => handleBodyColorChange("!bg-green-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-yellow-500" onClick={() => handleBodyColorChange("!bg-yellow-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-gray-500" onClick={() => handleBodyColorChange("!bg-gray-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-white-500" onClick={() => handleBodyColorChange("!bg-white-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-blue-500" onClick={() => handleBodyColorChange("!bg-blue-500")}></span>
                </div>
            </div> */}

            <Divider />

            <div>
                <h1 className="font-bold mb-3">SideBar</h1>
                <div className="flex gap-2 cursor-pointer">
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-red-500" onClick={() => handleSiderColorChange("!bg-red-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-green-500" onClick={() => handleSiderColorChange("!bg-green-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-yellow-500" onClick={() => handleSiderColorChange("!bg-yellow-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-gray-500" onClick={() => handleSiderColorChange("!bg-gray-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-white-500" onClick={() => handleSiderColorChange("!bg-white-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-blue-500" onClick={() => handleSiderColorChange("!bg-blue-500")}></span>
                </div>
            </div>

            <Divider />

            <div>
                <h1 className="font-bold mb-3">Footer</h1>
                <div className="flex gap-2 cursor-pointer">
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-red-500" onClick={() => handleFooterColorChange("!bg-red-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-green-500" onClick={() => handleFooterColorChange("!bg-green-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-yellow-500" onClick={() => handleFooterColorChange("!bg-yellow-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-gray-500" onClick={() => handleFooterColorChange("!bg-gray-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-white-500" onClick={() => handleFooterColorChange("!bg-white-500")}></span>
                    <span className="block w-[3px] h-[3px] border-1 p-2 bg-blue-500" onClick={() => handleFooterColorChange("!bg-blue-500")}></span>
                </div>
            </div>

        </Drawer>
    )
}

export default ThemeDrawer;