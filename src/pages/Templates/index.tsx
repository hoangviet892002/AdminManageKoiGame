import React from "react";
import { Typography, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import TemplateTable from "./components/TemplateTable";

const { Title, Text } = Typography;

const TemplatesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb
            items={[
              {
                title: <HomeOutlined />,
                href: "/dashboard",
              },
              {
                title: "Templates",
              },
            ]}
            className="mb-4"
          />
          <Title level={2} className="mb-2">
            Template Management
          </Title>
          <Text type="secondary">Manage game templates and configurations</Text>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Table Section with integrated search and filter */}
        <TemplateTable />
      </div>
    </div>
  );
};

export default TemplatesPage;
