import { useEffect, useRef, useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import _ from "lodash";
import usePermission from "../../hooks/usePermission";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { appSelector } from "../../services/appSlice";

const ListHeader = ({
  keyword,
  setKeyword,
  addButtonText,
  onAdd,
  searchPlaceholder,
  setCityMode,
  setCreateDrawerOpen,
  permission,
  showCreateButton = true,
  extra,
  radioButtonsForTableAndGrid,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  isHouseKeepingTask,
}) => {
  const { hasPermission } = usePermission(); // permission checker
  const canCreate = hasPermission(permission);
  const { RangePicker } = DatePicker;

  const { collapsed, openDrawer } = useSelector(appSelector);
  const isCollapsed = collapsed && !openDrawer;
  // const isMediumScreen = window?.innerWidth >= 766;
  // const isSmallScreen = window?.innerWidth <= 768;
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

useEffect(() => {
  const handleResize = () => setScreenWidth(window.innerWidth);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

const isMediumScreen = screenWidth >= 766;
const isSmallScreen = screenWidth <= 768;

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

  const cityFunction = () => {
    setCityMode("cityAdd");
    setCreateDrawerOpen(true);
  };

  // const containerClass =
  //   !isCollapsed && !isMediumScreen
  //     ? "flex-col gap-y-3 items-start"
  //     : isSmallScreen
  //       ? "flex-col gap-y-3 items-start"
  //       : "flex-row justify-between items-center w-full";
  const containerClass = isSmallScreen
  ? "flex-col gap-y-3 items-start"
  : "flex-row justify-between items-center w-full";

  return (
    // <div className={`flex ${containerClass}`}>
    <div className={`flex flex-wrap ${containerClass}`}>
      <div
        className={
          !setCreateDrawerOpen && !setCityMode
            ? "flex items-center justify-between gap-3"
            : "flex"
        }
      >
        {!setCreateDrawerOpen && !setCityMode && (
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
            className="w-50! md:w-70! lg:w-95! rounded-[5px]! dark:text-white dark:placeholder-white"
          // className="w-full md:w-70 lg:w-95 rounded-[5px] dark:text-white dark:placeholder-white"
          />
        )}
         <div className="w-50! md:w-60! lg:w-60! xs:flex-1 ">
         {/* <div className="w-full md:w-60 lg:w-70 xs:flex-1"> */}
          {setStartDate && setEndDate && (
            <RangePicker
              style={{ width: "100%" }}
              value={
                startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : null
              }
              onChange={(dates) => {
                if (dates) {
                  setStartDate(dates[0].format("YYYY-MM-DD"));
                  setEndDate(dates[1].format("YYYY-MM-DD"));
                } else {
                  setStartDate(null);
                  setEndDate(null);
                }
              }}
              className="dark:text-white"
            />
          )}
        </div>
      </div>

      {/* <div className="flex justify-end md:flex-1"> */}
      <div className="flex justify-end md:flex-1 w-full md:w-auto">
        <div
          className={`flex justify-end flex-1 ${isHouseKeepingTask ? "mr-2" : ""}`}
        >
          {radioButtonsForTableAndGrid}
        </div>
        <div>
          {canCreate && showCreateButton && (
            <Button
              type="primary"
              onClick={
                !setCreateDrawerOpen && !setCityMode ? onAdd : cityFunction
              }
              className={
                !setCreateDrawerOpen && !setCityMode ? "bg-blue-600" : "w-auto"
              }
            >
              {addButtonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListHeader;
