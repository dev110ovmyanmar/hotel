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
          className="w-50"
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