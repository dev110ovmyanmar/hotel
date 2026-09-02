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
import dayjs from "dayjs";
import NightAuditTopBar from "./NightAuditTopBar";
import PreAuditCheckStatus from "./PreAuditCheckStatus";


const CheckBookingHeader = ({
    colorClick,
    preAuditChecksData,
    preNightAudit
}) => {
    
    return (
        <div className="my-5">
            {/* <NightAuditTopBar preAuditChecksData={preAuditChecksData}/> */}

            {/* <div className="flex justify-between mb-3">
                <div >
                    <Input
                        placeholder="Search"
                        className="w-50! md:w-70! lg:w-95! rounded-[5px]! dark:text-white dark:placeholder-white"
                    />
                </div>
                <div>
                    <DatePicker defaultValue={dayjs()} />
                </div>
            </div> */}

            <StepsComponent stepValue={colorClick} />

            <PreAuditCheckStatus preAuditChecksData={preAuditChecksData} preNightAudit={preNightAudit}/>
        </div>
    )
}

export default CheckBookingHeader


