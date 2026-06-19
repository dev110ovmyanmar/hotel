import { useEffect, useRef, useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import _ from "lodash";
import usePermission from "../../../hooks/usePermission";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const ReservationSearchBar = ({
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

  return (
    <div className="flex flex-row justify-between items-center w-full mb-3 gap-20 ">
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
        style={{ width: "280px" }}
      />

      {/* <div className="w-110 flex justify-end">
        {setStartDate && setEndDate && (
          <RangePicker
            style={{ width: "250px" }}
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
      </div> */}
    </div>
  );
};

export default ReservationSearchBar;
