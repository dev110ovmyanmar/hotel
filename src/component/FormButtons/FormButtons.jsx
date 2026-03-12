import React from "react";
import { Button } from "antd";

const FormButtons = ({ mode, isPending, onClick }) => {
  const isAdd = mode === "add";
  

  return (
    <div className="flex justify-between gap-4">
      <Button type="primary" onClick={onClick} loading={isPending}>
        {isAdd ? "Create" : "Update"}
      </Button>
    </div>
  );
};

export default FormButtons;
