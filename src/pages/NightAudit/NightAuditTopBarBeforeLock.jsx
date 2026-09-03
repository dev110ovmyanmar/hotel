import { FaMoon } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const NightAuditTopBarBeforeLock = () => {
    const location = useLocation();

    return (
        <div className="flex justify-between items-center my-2">
            <div className="flex items-center gap-4 px-6 py-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-100">
                    <FaMoon className="text-blue-600 text-xl" />
                </div>

                <h1 className="text-md font-bold">
                    Night Audit
                </h1>

            </div>

            
        </div>
    );
};

export default NightAuditTopBarBeforeLock;
