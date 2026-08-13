import { useState, useEffect } from "react";
import { Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { appSelector, setSystemLocked } from "../../services/appSlice";
import { LockOutlined, ReloadOutlined, UnlockOutlined } from "@ant-design/icons";

const SystemLocked = () => {
  const dispatch = useDispatch();
  const { systemLocked } = useSelector(appSelector);
  const [countdown, setCountdown] = useState(30);

  // Auto-refresh countdown
  useEffect(() => {
    if (!systemLocked) {
      setCountdown(30);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.reload();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [systemLocked]);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!systemLocked) return null;

  return (
    <div className="fixed inset-0 z-[1000000] flex flex-col items-center justify-center px-6 text-center bg-gray-50/90 dark:bg-[#010101]/90 selection:bg-blue-100 backdrop-blur-sm">
      <div className="flex flex-col items-center max-w-md w-full bg-white dark:bg-[#141414] p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
        {/* Lock Icon */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-50 dark:bg-amber-900/20 rounded-full animate-pulse"></div>
          <div className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center border-4 border-amber-500 dark:border-amber-600">
            <LockOutlined className="text-4xl sm:text-5xl text-amber-600 dark:text-amber-500" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3 tracking-tight">
          System Locked
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm sm:text-base leading-relaxed">
          The system is currently locked during Night Audit operations.
        </p>

        <p className="text-gray-400 dark:text-gray-500 mb-8 text-xs sm:text-sm">
          Please try again later. Auto-refresh in{" "}
          <span className="font-semibold text-amber-600 dark:text-amber-500">
            {countdown}s
          </span>
        </p>

        <Button
          onClick={handleRefresh}
          type="primary"
          size="large"
          icon={<ReloadOutlined />}
          className="px-8 h-12 text-base font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 w-full flex items-center justify-center"
        >
          Refresh Now
        </Button>
      </div>
    </div>
  );
};

export default SystemLocked;
