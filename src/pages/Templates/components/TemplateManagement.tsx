import React, { useState } from "react";
import { Button, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AddTemplateForm } from "./AddTemplateForm";

export const TemplateManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSuccess = () => {
    message.success("Template created successfully!");
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Game Template Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          size="large"
        >
          Add New Template
        </Button>
      </div>

      <Modal
        title="Add New Template"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        destroyOnClose
      >
        <AddTemplateForm
          mode="create"
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Modal>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Template List</h2>
        <p className="text-gray-500">
          The list of templates will be displayed here...
        </p>
      </div>
    </div>
  );
};
