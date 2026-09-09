import React from "react";
import { Button } from "antd";

const FormButtons = ({ mode, isPending, onClick, disabled }) => {
  const isAdd = mode === "add" || mode === "item-add";

  return (
    <div className="flex justify-between gap-4">
      <Button type="primary" onClick={onClick} loading={isPending} disabled={disabled}>
        {isAdd ? "Create" : "Update"}
      </Button>
    </div>
  );
};

export default FormButtons;
