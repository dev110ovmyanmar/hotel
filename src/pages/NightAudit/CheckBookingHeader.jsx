import { DatePicker, Input } from "antd";
import {
    Bs1Circle,
    Bs1CircleFill,
    Bs2Circle,
    Bs2CircleFill,
    Bs3Circle,
    Bs4Circle,
    Bs5Circle
} from "react-icons/bs";
import StepsComponent from "../../component/Steps/StepsComponent";
import { useState } from "react";
import dayjs from "dayjs";


const CheckBookingHeader = ({
    colorClick,
}) => {

    return (
        <div className="mb-5">
            <div className="flex justify-between mb-3">
                <div >
                    <Input 
                        placeholder="Search"
                        className="w-50! md:w-70! lg:w-95! rounded-[5px]! dark:text-white dark:placeholder-white" 
                    />
                </div>
                <div>
                    <DatePicker defaultValue={dayjs()}/>
                </div>
            </div>

            <StepsComponent stepValue={colorClick} />

        </div>
    )
}

export default CheckBookingHeader


