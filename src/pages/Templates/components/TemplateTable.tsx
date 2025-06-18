import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Drawer,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  type TableProps,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { templateApi } from "../../../apis/template.api";
import { useMessage } from "../../../contexts/message.context";
import useQueryParams, {
  createQueryParams,
} from "../../../hooks/query/useQueryParams";
import type { ITemplate, TemplateFormData } from "../../../types/template.type";
import { useTemplateStore } from "../stores/templateStore";
import { TemplateForm } from "./AddTemplateForm";
import TemplateFilter from "./TemplateFilter";
import TemplateSearch from "./TemplateSearch";

const TemplateTable: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(
    null
  );
  const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const query = useQueryParams();
  const { showMessage } = useMessage();

  const {
    isCreateModalOpen,
    isEditModalOpen,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
  } = useTemplateStore();

  // Fetch templates with query params directly
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["templates", query],
    queryFn: async () => await templateApi.fetchTemplates(query),
  });

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: ({
      templateId,
      isActive,
    }: {
      templateId: string;
      isActive: boolean;
    }) => {
      const updateData: Partial<ITemplate> = { isActive };
      return templateApi.updateTemplate(templateId, updateData as ITemplate);
    },
    onSuccess: (response) => {
      if (response.isSuccess) {
        showMessage("success", "Template status updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["templates"] });
      } else {
        showMessage(
          "error",
          response.message || "Failed to update template status"
        );
      }
    },
    onError: () => {
      showMessage("error", "Failed to update template status");
    },
  });

  // Handle toggle active status
  const handleToggleActive = (template: ITemplate) => {
    if (template._id) {
      toggleActiveMutation.mutate({
        templateId: template._id,
        isActive: !template.isActive,
      });
    }
  };

  // Handle edit template
  const handleEdit = (template: ITemplate) => {
    const templateFormData: TemplateFormData = {
      _id: template._id,
      name: template.name,
      type: template.type,
      version: template.version,
      description: template.description || "",
      data: {
        items: template.data.items || [],
        koiTypes: template.data.koiTypes || [],
      },
    };
    openEditModal(templateFormData);
  };

  // Handle preview template
  const handlePreview = (template: ITemplate) => {
    setSelectedTemplate(template);
    setIsPreviewDrawerOpen(true);
  };

  // Handle delete template
  const handleDelete = async (template: ITemplate) => {
    try {
      const res = await templateApi.deleteTemplate(template._id as string);
      if (res.isSuccess) {
        showMessage("success", res.message || "Template deleted successfully");
        await queryClient.invalidateQueries({ queryKey: ["templates"] });
      } else {
        showMessage("error", res.message || "Failed to delete template");
      }
    } catch (error) {
      showMessage("error", "An error occurred while deleting the template");
    }
  };

  // Handle table change (pagination, sorting)
  const onChange: TableProps<ITemplate>["onChange"] = (
    pagination,
    _filters,
    _sorter,
    _extra
  ) => {
    const newQuery = createQueryParams({
      ...query,
      page: pagination.current,
      limit: pagination.pageSize,
    });
    navigate({ search: newQuery });
  };

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: ITemplate) => (
        <div
          className="cursor-pointer hover:text-blue-600"
          onClick={() => handlePreview(record)}
        >
          <div className="font-medium">{text}</div>
          {record.description && (
            <div className="text-xs text-gray-500 truncate max-w-xs">
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          starter: "blue",
          event: "green",
          seasonal: "orange",
          vip: "purple",
        };
        return (
          <Tag color={colorMap[type] || "default"} className="capitalize">
            {type}
          </Tag>
        );
      },
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      render: (version: string) => (
        <Badge count={version} style={{ backgroundColor: "#52c41a" }} />
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: ITemplate) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleActive(record)}
          loading={toggleActiveMutation.isPending}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: ITemplate) => (
        <Space size="small">
          <Tooltip title="Preview">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
              size="small"
            />
          </Tooltip>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the template"
            description="Are you sure to delete this template?"
            onConfirm={() => handleDelete(record)}
            placement="topRight"
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header with search, filter and create button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <TemplateSearch />
          <TemplateFilter />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
        >
          Create Template
        </Button>
      </div>

      {/* Template Table */}
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="_id"
        loading={isLoading || isFetching}
        pagination={{
          current: query.page ? Number(query.page) : 1,
          pageSize: query.limit ? Number(query.limit) : 10,
          total: data?.pagination?.total || 0,
        }}
        onChange={onChange}
      />

      {/* Create Modal */}
      <Modal
        title="Create Template"
        open={isCreateModalOpen}
        onCancel={closeCreateModal}
        footer={null}
        width={1200}
        destroyOnClose
      >
        <TemplateForm
          mode="create"
          onSuccess={() => {
            closeCreateModal();
            queryClient.invalidateQueries({ queryKey: ["templates"] });
          }}
          onCancel={closeCreateModal}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Template"
        open={isEditModalOpen}
        onCancel={closeEditModal}
        footer={null}
        width={1200}
        destroyOnClose
      >
        <TemplateForm
          mode="update"
          initialValues={
            useTemplateStore.getState().selectedTemplate || undefined
          }
          onSuccess={() => {
            closeEditModal();
            queryClient.invalidateQueries({ queryKey: ["templates"] });
          }}
          onCancel={closeEditModal}
        />
      </Modal>

      {/* Preview Drawer */}
      <Drawer
        title="Template Preview"
        placement="right"
        width={600}
        onClose={() => setIsPreviewDrawerOpen(false)}
        open={isPreviewDrawerOpen}
      >
        {selectedTemplate && (
          <div className="space-y-6">
            <Descriptions title="Basic Information" bordered column={1}>
              <Descriptions.Item label="Name">
                {selectedTemplate.name}
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag color="blue" className="capitalize">
                  {selectedTemplate.type}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Version">
                <Badge
                  count={selectedTemplate.version}
                  style={{ backgroundColor: "#52c41a" }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Badge
                  status={selectedTemplate.isActive ? "success" : "default"}
                  text={selectedTemplate.isActive ? "Active" : "Inactive"}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {selectedTemplate.description || "No description"}
              </Descriptions.Item>
            </Descriptions>

            {/* Items */}
            <Card title="Items" size="small">
              {selectedTemplate.data.items &&
              selectedTemplate.data.items.length > 0 ? (
                <div className="space-y-2">
                  {selectedTemplate.data.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span>{item.itemName}</span>
                      <Badge count={item.quantity} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">No items</div>
              )}
            </Card>

            {/* Koi Types */}
            <Card title="Koi Types" size="small">
              {selectedTemplate.data.koiTypes &&
              selectedTemplate.data.koiTypes.length > 0 ? (
                <div className="space-y-2">
                  {selectedTemplate.data.koiTypes.map((koiType, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span>{koiType.koiTypeName}</span>
                      <Badge count={koiType.quantity} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">
                  No koi types
                </div>
              )}
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default TemplateTable;
