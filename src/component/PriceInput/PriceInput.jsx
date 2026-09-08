import React from "react";
import { Input } from "antd";

const formatWithCommas = (numStr) => {
  if (!numStr) return "";
  const negative = numStr.startsWith("-");
  const abs = negative ? numStr.slice(1) : numStr;
  const [intPart, decPart] = abs.split(".");
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const result = decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
  return negative ? `-${result}` : result;
};

const PriceInput = ({
  value,
  onChange,
  readOnly,
  disabled,
  placeholder,
  suffix = "MMK",
  min,
  ...rest
}) => {
  const handleChange = (e) => {
    let raw = e.target.value.replace(/,/g, "");

    // Allow empty (will be null)
    if (raw === "" || raw === "-") {
      onChange?.(raw === "-" ? "-" : null);
      return;
    }

    // Strip non-numeric chars (allow digits, one decimal point, leading minus)
    const cleaned = raw.replace(/[^\d.\-]/g, "");
    if (cleaned === "" || cleaned === "-") {
      onChange?.(cleaned === "-" ? "-" : null);
      return;
    }

    // Only one decimal point
    const parts = cleaned.split(".");
    const withSingleDot = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned;

    // Enforce min
    if (min !== undefined) {
      const num = Number(withSingleDot);
      if (!isNaN(num) && num < min) return;
    }

    onChange?.(withSingleDot);
  };

  const handleBlur = () => {
    if (value === null || value === undefined || value === "" || value === "-") return;
    const num = Number(value);
    if (!isNaN(num)) {
      // Reset to clean number string (removes extra leading zeros like "007" -> "7")
      const clean = String(num);
      if (clean !== value) {
        onChange?.(clean);
      }
    }
  };

  // The form value is a raw number string; display it with commas
  const displayValue =
    value !== null && value !== undefined
      ? formatWithCommas(String(value))
      : "";

  return (
    <Input
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      readOnly={readOnly}
      disabled={disabled}
      placeholder={placeholder}
      suffix={suffix}
      {...rest}
    />
  );
};

export default PriceInput;
