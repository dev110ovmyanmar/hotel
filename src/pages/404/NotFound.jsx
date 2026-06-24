import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-[#010101]">
      <h1 className="text-6xl font-extrabold text-gray-800 dark:text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
        Sorry, Page Not Found
      </h2>

      <p className="max-w-md text-gray-600 dark:text-gray-100 mb-6">
        The link you followed probably broken, or the page has been removed.
      </p>

      <Button type="primary" onClick={() => navigate("/dashboard")} size="large">
        Back to Dashboard
      </Button>
    </div>
  )
};

export default NotFound;
