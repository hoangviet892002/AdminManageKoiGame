import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const ClearFilterButton = () => {
  const navigate = useNavigate();

  const handleClearFilters = () => {
    navigate({ search: "" });
  };

  return (
    <Button
      type="primary"
      onClick={handleClearFilters}
      style={{ marginLeft: "8px" }}
    >
      Clear Filters
    </Button>
  );
};

export default ClearFilterButton;
