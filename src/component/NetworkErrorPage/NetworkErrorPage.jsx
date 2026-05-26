import { Button, Modal } from "antd";
import { useSelector } from "react-redux";
import { appSelector } from "../../services/appSlice";

const NetworkErrorPage = () => {

    const { networkFailed } = useSelector(appSelector);

    const handleReload = () => {
        window.location.reload()
    };

    return (
        <>
            <div
                style={{
                    display: networkFailed ? "block" : "none",
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    background: "white",
                    zIndex: "1000000"
                }}
            >
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <p className="text-2xl text-gray-900 mb-5">Oops! Something Went Wrong. Please Try Again ... </p>
                    <Button onClick={handleReload} type="primary" >Try Again</Button>
                </div>

            </div>

        </>

    );
};

export default NetworkErrorPage;