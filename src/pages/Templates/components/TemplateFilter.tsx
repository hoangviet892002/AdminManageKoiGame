import { FilterOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Input,
  Popover,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useQueryParams, {
  createQueryParams,
} from "../../../hooks/query/useQueryParams";
import { parseArrayParam } from "../../../utils/helper";

const { Text } = Typography;
const { Option } = Select;

const TEMPLATE_TYPES = ["starter", "event", "seasonal", "vip"];

const TemplateFilter: React.FC = () => {
  const query = useQueryParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    parseArrayParam(query.type)
  );
  const [status, setStatus] = useState<boolean | undefined>(
    query.isActive !== undefined ? query.isActive === "true" : undefined
  );
  const [version, setVersion] = useState<string>(query.version || "");

  const handleApplyFilters = () => {
    const newQuery = createQueryParams({
      ...query,
      type: selectedTypes.length > 0 ? selectedTypes.join(",") : undefined,
      isActive: status,
      version: version.trim() || undefined,
      page: 1,
    });
    navigate({ search: newQuery });
    setOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedTypes([]);
    setStatus(undefined);
    setVersion("");

    const newQuery = createQueryParams({
      ...query,
      type: undefined,
      isActive: undefined,
      version: undefined,
      page: 1,
    });
    navigate({ search: newQuery });
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      setStatus(undefined);
    } else {
      setStatus(value === "active");
    }
  };

  const FilterContent = () => (
    <div style={{ width: 300 }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {/* Filter theo Type */}
        <div>
          <Text strong>Template Type</Text>
          <Checkbox.Group
            style={{ width: "100%", marginTop: "8px" }}
            value={selectedTypes}
            onChange={(values) => setSelectedTypes(values as string[])}
          >
            <Row gutter={[8, 8]}>
              {TEMPLATE_TYPES.map((type) => (
                <Col span={12} key={type}>
                  <Checkbox value={type}>{type}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>

        <Divider style={{ margin: "8px 0" }} />

        {/* Filter theo Status */}
        <div>
          <Text strong>Status</Text>
          <Select
            style={{ width: "100%", marginTop: "8px" }}
            value={
              status === undefined ? "all" : status ? "active" : "inactive"
            }
            onChange={handleStatusChange}
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active Only</Option>
            <Option value="inactive">Inactive Only</Option>
          </Select>
        </div>

        <Divider style={{ margin: "8px 0" }} />

        {/* Filter theo Version */}
        <div>
          <Text strong>Version</Text>
          <Input
            placeholder="e.g., 1.0.0"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            style={{ width: "100%", marginTop: "8px" }}
            allowClear
          />
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
      title="Filter Templates"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement="bottomRight"
    >
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <Button icon={<FilterOutlined />}>Filters</Button>
      </div>
    </Popover>
  );
};

export default TemplateFilter;
