import React, { useState } from "react";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import useQueryParams, {
  createQueryParams,
} from "../../../hooks/query/useQueryParams";

const TemplateSearch: React.FC = () => {
  const query = useQueryParams();
  const [keyword, setKeyword] = useState(query.keyword || "");
  const navigate = useNavigate();

  const handleSearch = () => {
    const newQuery = createQueryParams({
      ...query,
      keyword: keyword.trim(),
      page: 1, // Reset to first page when searching
    });
    navigate({ search: newQuery });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
      <Input
        placeholder="Search templates by name or description..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{ flex: 1 }}
        allowClear
      />
      <Button type="primary" onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
};

export default TemplateSearch;
