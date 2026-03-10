import React from "react";
import { fetchInitData } from "./api/initDataApi";
import Routes from "./app/router.jsx";
import useApiQuery from "./hooks/useApiQuery.js";

const App = () => {
  return <Routes />;
};

export default App;