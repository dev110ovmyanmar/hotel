// import { useEffect, useRef, useState } from "react";
// import { Input, Button } from "antd";
// import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
// import _ from "lodash";
// import { Drawer } from "antd";

// const ListHeader = ({
//   // title,
//   keyword,
//   setKeyword,
//   addButtonText,
//   onAdd,
//   searchPlaceholder,
//   setCityMode,
//   setCreateDrawerOpen,
//   page,
//   setPage

// }) => {
//   const [inputValue, setInputValue] = useState(keyword || "");
//   const debouncedSearchRef = useRef(null);

//   if (!debouncedSearchRef.current) {
//     debouncedSearchRef.current = _.debounce((value) => {
//       setKeyword(value);
//     }, 500);
//   }

//   useEffect(() => {
//     return () => {
//       debouncedSearchRef.current?.cancel();
//     };
//   }, []);

//   const cityFunction = () => {
//     setCityMode("cityAdd");
//     setCreateDrawerOpen(true);
//   }

//   return (
//     <div className="bg-white rounded-lg space-y-2">
//       {/* <h2 className="text-sm font-semibold text-gray-600 mt-[-20px]">{title}</h2> */}

//       <div className={(!setCreateDrawerOpen && !setCityMode) ? "flex items-center justify-between gap-2" :"flex" }>
//         {!setCreateDrawerOpen && !setCityMode && (
//           <Input
//             // placeholder="Search..."
//             placeholder={searchPlaceholder}
//             prefix={<SearchOutlined />}
//             allowClear
//             value={inputValue}
//             onChange={(e) => {
//               const value = e.target.value;
//               setInputValue(value);
//               debouncedSearchRef.current(value);
//             }}
//             className="xs:w-50 md:w-80"
//           />)}

//         <Button
//           type="primary"
//           // icon={<PlusOutlined />}
//           onClick={!setCreateDrawerOpen && !setCityMode ? onAdd : cityFunction}
//           className={(!setCreateDrawerOpen && !setCityMode) ? "bg-blue-600 xs:w-auto w-50 xs:ml-50 md:ml-80 lg:ml-180" :"w-auto ml-auto" }
//         >
//           {addButtonText}
//         </Button>
//       </div>

//       <Drawer>
        
//       </Drawer>
//     </div>
//   );
// };

// export default ListHeader;
import { useEffect, useRef, useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import _ from "lodash";

const ListHeader = ({
  keyword,
  setKeyword,
  addButtonText,
  onAdd,
  searchPlaceholder,
}) => {
  const [inputValue, setInputValue] = useState(keyword || "");
  const debouncedSearchRef = useRef(null);

  if (!debouncedSearchRef.current) {
    debouncedSearchRef.current = _.debounce((value) => {
      setKeyword(value);
    }, 500);
  }

  useEffect(() => {
    return () => {
      debouncedSearchRef.current?.cancel();
    };
  }, []);

  return (
    <div className="flex flex-row justify-between items-center w-full gap-2">
      <div>
        <Input
          placeholder={searchPlaceholder}
          prefix={<SearchOutlined />}
          allowClear
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;
            setInputValue(value);
            debouncedSearchRef.current(value);
          }}
          className="w-50 rounded-[5px]!"
        />
      </div>
      <div className="w-full flex justify-end">
        <Button type="primary" onClick={onAdd} className="bg-blue-600">
          {addButtonText}
        </Button>
      </div>
    </div>
  );
};

export default ListHeader;