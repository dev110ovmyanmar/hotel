// import React, { useEffect } from "react";
// import Routes from "./app/router";
// import useApiQuery from "./hooks/useApiQuery";
// import { fetchInitData } from "./api/initDataApi";
// import { useQuery } from "@tanstack/react-query";
// import { queryClient } from "./app/QueryClient";

// const App = () => {
//    const { data, isLoading, error } = useApiQuery({
//     fetchQueryName: "initData",
//     fetchQueryFunction: fetchInitData,
//   });

//     // Example: Access cached data directly at app start
//   useEffect(() => {
//   if (data) {
//     console.log("InitData after fetch:", data);

//     // Optional: you can also access cache via queryClient
//       const cached = queryClient.getQueryData(["initData"]);
//       console.log("Cached initData from queryClient:", cached);
//   }
// }, [data]);

//   return <Routes />;
// };

// export default App;

import React from "react";
import Routes from "./app/router";
import useApiQuery from "./hooks/useApiQuery";
import { fetchInitData } from "./api/initDataApi";

const App = () => {
  useApiQuery({
    fetchQueryName: "initData",
    fetchQueryFunction: fetchInitData,
    options: {
      staleTime: 24 * 60 * 60 * 1000, // 1 day
      cacheTime: 24 * 60 * 60 * 1000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  });

  return <Routes />;
};

export default App;