import React, { useState } from "react";
import { Input, Select, Button, Popover, Typography } from "antd";
import useQueryParams, {
  createQueryParams,
} from "../../../hooks/query/useQueryParams";
import { useNavigate } from "react-router-dom";
import { FilterOutlined } from "@ant-design/icons";
const { Option } = Select;
const { Text } = Typography;

const RARITIES = ["common", "uncommon", "rare", "epic", "legendary"];

const KoiTypeFilter = () => {
  const query = useQueryParams();
  const [filters, setFilters] = useState({
    rarity: query.rarity || [],
    minPrice: query.minPrice || undefined,
    maxPrice: query.maxPrice || undefined,
  });
  const navigate = useNavigate();

  const handleFilterChange = (
    key: string,
    value: string | number | string[] | undefined
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const newQuery = createQueryParams({
      ...query,
      rarity:
        Array.isArray(filters.rarity) && filters.rarity.length > 0
          ? filters.rarity.join(",")
          : undefined,
      minPrice: filters.minPrice !== undefined ? filters.minPrice : undefined,
      maxPrice: filters.maxPrice !== undefined ? filters.maxPrice : undefined,
    });
    navigate({ search: newQuery });
  };

  const content = (
    <div style={{ width: "300px" }}>
      {/* Filter by Rarity */}
      <div style={{ marginBottom: "16px" }}>
        <Text strong>Rarity</Text>
        <Select
          mode="multiple"
          style={{ width: "100%", marginTop: "8px" }}
          placeholder="Select rarities"
          value={filters.rarity}
          onChange={(value) => handleFilterChange("rarity", value)}
          allowClear
        >
          {RARITIES.map((rarity) => (
            <Option key={rarity} value={rarity}>
              {rarity}
            </Option>
          ))}
        </Select>
      </div>

      {/* Filter by Price */}
      <div style={{ marginBottom: "16px" }}>
        <Text strong>Min Price</Text>
        <Input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) =>
            handleFilterChange("minPrice", Number(e.target.value))
          }
          style={{ width: "100%", marginTop: "8px" }}
        />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <Text strong>Max Price</Text>
        <Input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) =>
            handleFilterChange("maxPrice", Number(e.target.value))
          }
          style={{ width: "100%", marginTop: "8px" }}
        />
      </div>

      <Button type="primary" onClick={applyFilters} style={{ width: "100%" }}>
        Apply Filters
      </Button>
    </div>
  );

  return (
    <Popover content={content} title="Filters" trigger="click">
      <Button icon={<FilterOutlined />}>Filters</Button>
    </Popover>
  );
};

export default KoiTypeFilter;
