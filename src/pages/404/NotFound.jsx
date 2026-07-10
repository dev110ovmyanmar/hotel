import React, { useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { textWhiteInDarkStyle } from "../../utils";

const NotFound = () => {
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);

  const handleGoBack = () => {
    setIsLeaving(true);
    // Wait for the door opening animation to finish before actually routing
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000); 
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-6 text-center bg-gray-50/90 dark:bg-[#010101]/90 selection:bg-blue-100 backdrop-blur-sm">
      <div className="flex flex-col items-center max-w-md w-full bg-white dark:bg-[#141414] p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
        
        {/* Real Door Animation Feature */}
        <div className="relative w-32 h-48 sm:w-40 sm:h-60 mx-auto mb-8" style={{ perspective: "1000px" }}>
          {/* The Room inside (revealed when door opens) */}
          <div className="absolute inset-0 bg-blue-50 dark:bg-gray-800 rounded-t-lg flex items-center justify-center overflow-hidden border-t-8 border-l-8 border-r-8 border-gray-200 dark:border-gray-700 shadow-inner">
            <span 
              className="text-blue-500 font-bold text-lg sm:text-xl whitespace-nowrap transition-all duration-[1500ms] ease-out" 
              style={{ 
                opacity: isLeaving ? 1 : 0, 
                transform: isLeaving ? 'scale(1)' : 'scale(0.8)',
                transitionDelay: '400ms'
              }}
            >
              Dashboard
            </span>
          </div>

          {/* The Door Frame Overlay */}
          <div className="absolute inset-0 border-t-[10px] border-l-[10px] border-r-[10px] border-gray-800 dark:border-gray-900 rounded-t-lg pointer-events-none z-10 shadow-lg"></div>

          {/* The Door */}
          <div 
            className="absolute bottom-0 left-[10px] w-[calc(100%-20px)] h-[calc(100%-10px)] bg-amber-700 origin-left transition-all duration-[2000ms] ease-in-out shadow-xl flex flex-col justify-between p-2 sm:p-3 border-r-2 border-t-2 border-amber-900 z-0"
            style={{ 
              transformStyle: "preserve-3d", 
              transform: isLeaving ? "rotateY(-105deg)" : "rotateY(0deg)" 
            }}
          >
            {/* Door Panels */}
            <div className="w-full h-[40%] bg-amber-600 border-2 border-amber-800 shadow-inner rounded-sm flex items-center justify-center">
                <span className="text-amber-900 font-black text-2xl sm:text-3xl opacity-60">404</span>
            </div>
            <div className="w-full h-[40%] bg-amber-600 border-2 border-amber-800 shadow-inner rounded-sm"></div>

            {/* Door Knob */}
            <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 bg-yellow-500 rounded-full shadow-md border border-yellow-600 flex items-center justify-center">
                <div className="w-1 h-1 bg-yellow-700 rounded-full"></div>
            </div>
          </div>
        </div>

        <h2 className={`text-2xl sm:text-3xl font-bold text-gray-800 mb-3 tracking-tight ${textWhiteInDarkStyle}`}>
          {isLeaving ? "Opening Door..." : "Page Not Found"}
        </h2>
        
        <p 
          className="text-gray-500 dark:text-gray-400 mb-8 text-sm sm:text-base leading-relaxed transition-opacity duration-300" 
          style={{ opacity: isLeaving ? 0 : 1 }}
        >
          The resource requested could not be found on this server. It might have been removed, renamed, or did not exist in the first place.
        </p>

        <Button 
          type="primary" 
          onClick={handleGoBack} 
          size="large"
          className="px-8 h-12 text-base font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 w-full flex items-center justify-center"
          loading={isLeaving}
        >
          {isLeaving ? "Navigating..." : "Back to Dashboard"}
        </Button>
      </div>
    </div>
  )
};

export default NotFound;
