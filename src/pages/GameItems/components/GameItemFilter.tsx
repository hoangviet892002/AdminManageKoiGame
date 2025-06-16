import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
  Popover,
} from "antd";
import useQueryParams, {
  createQueryParams,
} from "../../../hooks/query/useQueryParams";
import { useNavigate } from "react-router-dom";
import { FilterOutlined } from "@ant-design/icons";
import { parseArrayParam } from "../../../utils/helper";

const { Text } = Typography;
const { Option } = Select;

const TYPES = ["food", "medicine", "upgrade", "decoration", "special"];
const RARITIES = ["common", "uncommon", "rare", "epic", "legendary"];

const GameItemsFilter = () => {
  const query = useQueryParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    parseArrayParam(query.type)
  );
  const [selectedRarities, setSelectedRarities] = useState<string[]>(
    parseArrayParam(query.rarity)
  );
  const [minPrice, setMinPrice] = useState<number | undefined>(
    query.minPrice ? Number(query.minPrice) : undefined
  );
  const [maxPrice, setMaxPrice] = useState<number | undefined>(
    query.maxPrice ? Number(query.maxPrice) : undefined
  );

  const handleApplyFilters = () => {
    const newQuery = createQueryParams({
      ...query,
      type: selectedTypes.length > 0 ? selectedTypes.join(",") : undefined,
      rarity:
        selectedRarities.length > 0 ? selectedRarities.join(",") : undefined,
      minPrice: minPrice,
      maxPrice: maxPrice,
      page: 1,
    });
    navigate({ search: newQuery });
    setOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedTypes([]);
    setSelectedRarities([]);
    setMinPrice(undefined);
    setMaxPrice(undefined);

    const newQuery = createQueryParams({
      ...query,
      type: undefined,
      rarity: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      page: 1,
    });
    navigate({ search: newQuery });
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const FilterContent = () => (
    <div style={{ width: 300 }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {/* Filter theo Type */}
        <div>
          <Text strong>Type</Text>
          <Checkbox.Group
            style={{ width: "100%", marginTop: "8px" }}
            value={selectedTypes}
            onChange={(values) => setSelectedTypes(values as string[])}
          >
            <Row gutter={[8, 8]}>
              {TYPES.map((type) => (
                <Col span={8} key={type}>
                  <Checkbox value={type}>{type}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>

        <Divider style={{ margin: "8px 0" }} />

        {/* Filter theo Rarity */}
        <div>
          <Text strong>Rarity</Text>
          <Select
            mode="multiple"
            style={{ width: "100%", marginTop: "8px" }}
            placeholder="Select rarities"
            value={selectedRarities}
            onChange={setSelectedRarities}
            allowClear
          >
            {RARITIES.map((rarity) => (
              <Option key={rarity} value={rarity}>
                {rarity}
              </Option>
            ))}
          </Select>
        </div>

        <Divider style={{ margin: "8px 0" }} />

        {/* Filter theo Price Range */}
        <div>
          <Text strong>Price Range</Text>
          <Space style={{ width: "100%", marginTop: "8px" }}>
            <InputNumber
              placeholder="Min price"
              value={minPrice}
              onChange={(value) => setMinPrice(value ?? undefined)}
              min={0}
              style={{ width: "48%" }}
            />
            <InputNumber
              placeholder="Max price"
              value={maxPrice}
              onChange={(value) => setMaxPrice(value ?? undefined)}
              min={minPrice || 0}
              style={{ width: "48%" }}
            />
          </Space>
        </div>

        {/* Action buttons */}
        <Space
          style={{
            marginTop: "16px",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <Button onClick={handleResetFilters}>Reset</Button>
          <Button type="primary" onClick={handleApplyFilters}>
            Apply
          </Button>
        </Space>
      </Space>
    </div>
  );

  return (
    <Popover
      content={<FilterContent />}
      title="Filter Items"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement="bottomRight"
    >
      <Button icon={<FilterOutlined />}>
        Filters
        {Object.keys(query).some((key) =>
          ["type", "rarity", "minPrice", "maxPrice"].includes(key)
        ) && <span style={{ color: "#1890ff", marginLeft: 4 }}>•</span>}
      </Button>
    </Popover>
  );
};

export default GameItemsFilter;
