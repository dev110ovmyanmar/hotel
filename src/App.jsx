import React from "react";
import { fetchInitData } from "./api/initDataApi";
import Routes from "./app/router.jsx";
import useApiQuery from "./hooks/useApiQuery.js";

const App = () => {
  useApiQuery({
  fetchQueryName: "initData",
  fetchQueryFunction: fetchInitData,
  persist: true,
  options: {
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },
});

  return <Routes />;
};

export default App;