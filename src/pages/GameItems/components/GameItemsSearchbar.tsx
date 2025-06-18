import { Button, Input } from "antd";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import useQueryParams, {
  createQueryParams,
} from "../../../hooks/query/useQueryParams";

const GameItemsSearchbar = () => {
  const query = useQueryParams();
  const [keyword, setKeyword] = useState(query.keyword || "");
  const navigate = useNavigate();

  const handleSearch = () => {
    const newQuery = createQueryParams({
      ...query,
      keyword: keyword.trim(),
    });
    navigate({ search: newQuery });
  };

  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
      <Input
        placeholder="Search game items..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ flex: 1 }}
      />
      <Button type="primary" onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
};

export default GameItemsSearchbar;
