// import React, { useEffect, useState } from "react";
// import { LIMITS } from "../../variables/constants";
// import ContentBanner from "../../component/ContentBanner/ContentBanner";
// import FilterBar from "../../component/FilterBar/FilterBar";
// import useApiQuery from "../../hooks/useApiQuery";
// import { locationListFunctionApi } from "../../api/locationFunctionApi";
// import LocationTable from "./Components/LocationTable";
// import LocationForm from "./Components/LocationForm/LocationForm";

// const LocationList = () => {
//   const [keyword, setKeyword] = useState("");
//   const [status, setStatus] = useState("all");
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const normalStatus = status === "all" ? null : status;

//   const { data, isLoading, error } = useApiQuery({
//     fetchQueryName: "locations",
//     fetchQueryFunction: locationListFunctionApi,
//     params: {
//       pagination: {
//         page: page,
//         perPage: perPage,
//       },
//       keyword,
//       status: normalStatus,
//     },
//   });

//   if (data) {
//     console.log(data?.data, "DataInLocationListPagination");
//   }

//   useEffect(() => {
//     setPage(1);
//   }, [keyword, status, perPage]);

//   return (
//     <div className="w-full px-6 py-2">
//       <ContentBanner
//         title="Location"
//         btntext="Create Location"
//         setModalOpen={setModalOpen}
//       />

//       <FilterBar
//         keyword={keyword}
//         setKeyword={setKeyword}
//         status={status}
//         setStatus={setStatus}
//         isProduct={false}
//       />

//       <LocationTable
//         data={data?.data || []}
//         page={data?.pagination.currentPage}
//         perPage={data?.pagination.perPage}
//         total={data?.pagination?.total}
//         changePage={(page) => setPage(page)}
//         changePerPage={(perPage) => setPerPage(perPage)}
//       />

//       <LocationForm
//         modalOpen={modalOpen}
//         setModalOpen={setModalOpen}
//         mode="add"
//       />
//     </div>
//   );
// };

// export default LocationList;
import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import ContentBanner from "../../component/ContentBanner/ContentBanner";
import FilterBar from "../../component/FilterBar/FilterBar";
import useApiQuery from "../../hooks/useApiQuery";
import { locationListFunctionApi } from "../../api/locationFunctionApi";
import LocationTable from "./Components/LocationTable";
import LocationForm from "./Components/LocationForm/LocationForm";
import ListHeader from "../../component/ListHeader/ListHeader";

const LocationList = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const normalStatus = status === "all" ? null : status;

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "locations",
    fetchQueryFunction: locationListFunctionApi,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
      status: normalStatus,
    },
  });

  if (data) {
    console.log(data?.data, "DataInLocationListPagination");
  }

  useEffect(() => {
    setPage(1);
  }, [keyword, status, perPage]);

  const handleAdd = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
  };

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          title="Location List"
          searchPlaceholder="Search Location ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Location"
          onAdd={handleAdd}
        />
      </div>

      <LocationTable
        data={data?.data || []}
        page={data?.pagination.currentPage}
        perPage={data?.pagination.perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
      />

      <LocationForm
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        mode="add"
      />
    </div>
  );
};

export default LocationList;
