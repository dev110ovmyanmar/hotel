import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-gray-50 px-4 text-center">
      <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Sorry, Page Not Found
      </h2>

      <p className="max-w-md text-gray-600 mb-6">
        The link you followed probably broken, or the page has been removed.
      </p>
    </div>
  );
};

export default NotFound;
