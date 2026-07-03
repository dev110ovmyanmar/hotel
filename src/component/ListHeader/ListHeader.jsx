import { useEffect, useRef, useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import _ from "lodash";
import usePermission from "../../hooks/usePermission";
import { DatePicker } from "antd";
import dayjs from "dayjs";

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
}) => {
  const { hasPermission } = usePermission(); // permission checker
  const canCreate = hasPermission(permission);
  const { RangePicker } = DatePicker;

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

  return (
    <div className="flex flex-row w-full ">
      <div
        className={
          !setCreateDrawerOpen && !setCityMode
            ? "flex items-center justify-between gap-4"
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
            className="w-100! rounded-[5px]! "
          />
        )}
        <div className="w-70!">
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
            />
          )}
        </div>
      </div>

      <div className="w-full flex justify-end">
        <div className="w-full flex justify-end pr-2">
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
