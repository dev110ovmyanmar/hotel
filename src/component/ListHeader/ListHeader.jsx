import { useEffect, useRef, useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import _ from "lodash";
import usePermission from "../../hooks/usePermission";

const ListHeader = ({
  keyword,
  setKeyword,
  addButtonText,
  onAdd,
  searchPlaceholder,
  setCityMode,
  setCreateDrawerOpen,
  permission,
}) => {
  const { hasPermission } = usePermission(); // permission checker
  const canCreate = hasPermission(permission);

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
    <div className="flex flex-row justify-between items-center w-full gap-2">
      <div
        className={
          !setCreateDrawerOpen && !setCityMode
            ? "flex items-center justify-between gap-2"
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
            className="w-50 rounded-[5px]!"
          />
        )}
      </div>
      <div className="w-full flex justify-end">
        {canCreate && (
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
  );
};

export default ListHeader;
