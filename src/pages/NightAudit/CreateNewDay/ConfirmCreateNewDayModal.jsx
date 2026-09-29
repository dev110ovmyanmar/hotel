import { InfoCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { CalendarRange } from "lucide-react";

const ConfirmCreateNewDayModal = ({
    cardDesign,
    nextBusinessDay,
    open,
    onCancel,
    onOk,
    confirmLoading
}) => {
    return (
        <Modal
            open={open}
            onCancel={onCancel}
            onOk={onOk}
            okText="Confirm"
            confirmLoading={confirmLoading}
            title={
                <div className="!flex !items-center !gap-x-3 !py-3">
                    <CalendarRange
                        className="!h-8 !w-8 !shrink-0 !text-blue-500"
                    />
                    <div className="!font-bold">
                        Confrim Create New Day
                    </div>
                </div>
            }
        >
            <div>
                <div className="!my-2 text-sm leading-6 text-gray-500">
                    Are you sure you want to create a new business day for
                    <span className="!font-bold"> {nextBusinessDay} </span>
                    and unlock the system?
                </div>

                <div className={cardDesign}>

                    <div className="flex justify-center sm:justify-start">
                        <InfoCircleOutlined
                            className="h-7 w-7 shrink-0 !text-blue-500"
                        />
                    </div>

                    <div className="min-w-0 text-center sm:text-left">
                        <div className="font-medium">
                            This action will :
                        </div>

                        <ul className="list-disc">
                            <li>Create a new business date (next day)</li>
                            <li>Unlock the system for noraml operation</li>
                            <li>Reset night audit status</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ConfirmCreateNewDayModal;