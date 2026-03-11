import React, { useEffect } from "react";
import Routes from "./app/router.jsx";
import { useDispatch, useSelector } from "react-redux";
import { appSelector, initTheme } from "./services/appSlice.js";
import { ConfigProvider, theme as antTheme } from "antd";

const App = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector(appSelector);

  // Initialize Tailwind dark class on mount
  useEffect(() => {
    dispatch(initTheme());
  }, [dispatch]);

  return (
    <ConfigProvider
    theme={{
        // Swaps Ant Design components between Light and Dark mode
        algorithm: theme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          fontFamily: 'var(--site-font)',
          borderRadius: 0,
        },
      }}
    >
        <div className="min-h-screen bg-background text-foreground transition-all duration-200">
        <Routes />
      </div>
    </ConfigProvider>
  );
};

export default App;
