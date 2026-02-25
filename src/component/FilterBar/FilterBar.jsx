import  { useEffect, useRef, useState } from "react";
import {  ConfigProvider, Input, Select } from "antd";
import _ from "lodash";

const { Search } = Input;

const gradientButtonTheme = {
  token: {},
  components: {
    Button: {
      // apply custom class
      className: "gradient-btn",
    },
  },
};

const FilterBar = ({
  keyword,
  status,
  setKeyword,
  setStatus,
}) => {
  const [inputValue, setInputValue] = useState(keyword);
  
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
    <ConfigProvider theme={gradientButtonTheme}>
      <div className="flex flex-row justify-between items-center w-full gap-2 my-3">
        <Search
          placeholder="Search Something"
          value={inputValue}
          onChange={
            (e) => {
              setInputValue(e.target.value),
              debouncedSearchRef.current(e.target.value)
            }}
          className="w-full sm:max-w-[220px]"

        />

        {/* <Select
          value={status}
          onChange={(value) => setStatus(value)}
          className="w-full sm:w-[130px] "
        >
          <Select.Option value="active">
            Active 
          </Select.Option>

          <Select.Option value="inactive">
            Inactive 
          </Select.Option>

          <Select.Option value="blocked">
            Blocked 
          </Select.Option>

          <Select.Option value="all">
            All 
          </Select.Option>
        </Select> */}

      </div>
    </ConfigProvider >

  )
};

export default FilterBar;