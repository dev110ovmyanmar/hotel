import React, { useEffect } from "react";
import Routes from "./app/router.jsx";
import { useDispatch, useSelector } from "react-redux";
import { appSelector, initTheme } from "./services/appSlice.js";
import { ConfigProvider, Spin, theme as antTheme } from "antd";
import { setUserData } from "./services/authSlice.js";
import { fetchInitData } from "./api/initDataApi.js";
import { loadState } from "./utils/Utils.js";
import { LOCAL_STORAGE_KEYS } from "./variables/constants.js";
import useApiQuery from "./hooks/useApiQuery.js";
import SystemLocked from "./component/SystemLocked/SystemLocked.jsx";

const App = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector(appSelector);
  const sessionId = loadState(LOCAL_STORAGE_KEYS.sessionId);

  // Call initData globally
  const { data: initData, isFetching } = useApiQuery({
    fetchQueryName: "initData",
    params: sessionId ? "authenticated" : "public",
    fetchQueryFunction: fetchInitData,
    persist: true,
    options: {
      staleTime: 24 * 60 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: 1,
    },
  });

  // 3. Sync with Redux whenever initData is fetched or changed
  useEffect(() => {
    if (initData) {
      dispatch(setUserData({ permissions: initData.permissions }));
    }
  }, [initData, dispatch]);

  // Initialize Tailwind dark class on mount
  useEffect(() => {
    dispatch(initTheme());
  }, [dispatch]);

  return (
    <ConfigProvider
      theme={{
        // Swaps Ant Design components between Light and Dark mode
        algorithm:
          theme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          fontFamily: "var(--site-font)",
          borderRadius: 0,
        },
      }}
    >
      <div className="min-h-screen bg-background text-foreground transition-all duration-200">
        <SystemLocked />
        <Routes />
      </div>
    </ConfigProvider>
  );
};

export default App;
