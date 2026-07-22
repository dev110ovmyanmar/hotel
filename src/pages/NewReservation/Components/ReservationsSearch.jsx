import { useEffect, useRef, useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import _ from "lodash";
import usePermission from "../../../hooks/usePermission";
import { DatePicker } from "antd";

const ReservationSearchBar = ({
  keyword,
  setKeyword,
  searchPlaceholder,
  permission,
  showCreateButton = true,
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
    setInputValue(keyword || "");
  }, [keyword]);

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
        style={{ width: "400px" }}
      />

    </div>
  );
};

export default ReservationSearchBar;
