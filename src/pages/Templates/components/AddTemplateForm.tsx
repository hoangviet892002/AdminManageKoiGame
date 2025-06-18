import React, { useState, useMemo } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  Space,
  Divider,
  Alert,
  Spin,
} from "antd";
import { PlusOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "../../../hooks/useForm";
import { templateFormSchema } from "../../../schemas/template.schema";
import { itemApi } from "../../../apis/item.api";
import { koiBreedApi } from "../../../apis/koi-breed.api";
import { templateApi } from "../../../apis/template.api";
import type { TemplateFormData } from "../../../types/template.type";
import type { ItemType } from "../../../types/ItemType";
import type { KoiBreedType } from "../../../types/koi-breed.type";
import { useMessage } from "../../../contexts/message.context";

const { TextArea } = Input;
const { Option } = Select;

interface TemplateFormProps {
  mode: "create" | "update";
  initialValues?: TemplateFormData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const defaultValues: TemplateFormData = {
  name: "",
  type: "starter",
  version: "1.0.0",
  description: "",
  data: {
    items: [],
    koiTypes: [],
  },
};

export const TemplateForm: React.FC<TemplateFormProps> = ({
  mode,
  initialValues,
  onSuccess,
  onCancel,
}) => {
  const [showPreview, setShowPreview] = useState(false);

  // Use initialValues if provided, otherwise use default
  const formInitialValues = initialValues || defaultValues;

  // Fetch items data
  const { data: itemsData, isLoading: itemsLoading } = useQuery({
    queryKey: ["items"],
    queryFn: () => itemApi.fetchItems({ limit: 1000 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch koi types data
  const { data: koiTypesData, isLoading: koiTypesLoading } = useQuery({
    queryKey: ["koi-types"],
    queryFn: () => koiBreedApi.fetchKoiTypes({ limit: 1000 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { showMessage } = useMessage();
  const {
    values,
    errors,
    touched,
    loading,
    submitError,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useForm({
    initialValues: formInitialValues,
    validationSchema: templateFormSchema,
    onSubmit: async (values: TemplateFormData) => {
      let res;

      if (mode === "create") {
        res = await templateApi.createTemplate(values);
      } else {
        res = await templateApi.updateTemplate(
          initialValues?._id || "",
          values
        );
      }

      if (res.isSuccess) {
        showMessage(
          "success",
          res.message ||
            `Template ${
              mode === "create" ? "created" : "updated"
            } successfully!`
        );
        onSuccess?.();
      } else {
        throw new Error(res.message || `Failed to ${mode} template.`);
      }
    },
  });

  // Memoized options for selects
  const itemOptions = useMemo(() => {
    return (
      itemsData?.data?.map((item: ItemType) => ({
        label: `${item.name} (${item.type})`,
        value: item._id,
        item,
      })) || []
    );
  }, [itemsData]);

  const koiTypeOptions = useMemo(() => {
    return (
      koiTypesData?.data?.map((koiType: KoiBreedType) => ({
        label: `${koiType.breedName} (${koiType.rarity})`,
        value: koiType._id,
        koiType,
      })) || []
    );
  }, [koiTypesData]);

  const handleAddItem = () => {
    const newItems = [
      ...values.data.items,
      { itemId: "", itemName: "", quantity: 1 },
    ];
    setFieldValue("data.items", newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = values.data.items.filter(
      (_: { itemId: string; itemName: string; quantity: number }, i: number) =>
        i !== index
    );
    setFieldValue("data.items", newItems);
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newItems = [...values.data.items];
    newItems[index] = { ...newItems[index], [field]: value };

    // If itemId changed, update itemName
    if (field === "itemId") {
      const selectedItem = itemOptions.find((option) => option.value === value);
      if (selectedItem) {
        newItems[index].itemName = selectedItem.item.name;
      }
    }

    setFieldValue("data.items", newItems);
  };

  const handleAddKoiType = () => {
    const newKoiTypes = [
      ...values.data.koiTypes,
      { koiTypeId: "", koiTypeName: "", quantity: 1 },
    ];
    setFieldValue("data.koiTypes", newKoiTypes);
  };

  const handleRemoveKoiType = (index: number) => {
    const newKoiTypes = values.data.koiTypes.filter(
      (
        _: { koiTypeId: string; koiTypeName: string; quantity: number },
        i: number
      ) => i !== index
    );
    setFieldValue("data.koiTypes", newKoiTypes);
  };

  const handleKoiTypeChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newKoiTypes = [...values.data.koiTypes];
    newKoiTypes[index] = { ...newKoiTypes[index], [field]: value };

    // If koiTypeId changed, update koiTypeName
    if (field === "koiTypeId") {
      const selectedKoiType = koiTypeOptions.find(
        (option) => option.value === value
      );
      if (selectedKoiType) {
        newKoiTypes[index].koiTypeName = selectedKoiType.koiType.breedName;
      }
    }

    setFieldValue("data.koiTypes", newKoiTypes);
  };

  const handleReset = () => {
    resetForm();
  };

  return (
    <Card
      title={`${mode === "create" ? "Add New" : "Edit"} Template`}
      className="max-w-4xl mx-auto"
      extra={
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Hide" : "View"} Preview
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      }
    >
      <Form layout="vertical" className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Template Name"
            required
            validateStatus={touched.name && errors.name ? "error" : ""}
            help={touched.name && errors.name}
          >
            <Input
              value={values.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter template name"
            />
          </Form.Item>

          <Form.Item
            label="Template Type"
            required
            validateStatus={touched.type && errors.type ? "error" : ""}
            help={touched.type && errors.type}
          >
            <Select
              value={values.type}
              onChange={(value) => handleChange("type", value)}
              placeholder="Select template type"
            >
              <Option value="starter">Starter</Option>
              <Option value="event">Event</Option>
              <Option value="seasonal">Seasonal</Option>
              <Option value="vip">VIP</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Version"
            required
            validateStatus={touched.version && errors.version ? "error" : ""}
            help={touched.version && errors.version}
          >
            <Input
              value={values.version}
              onChange={(e) => handleChange("version", e.target.value)}
              placeholder="1.0.0"
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Description"
          validateStatus={
            touched.description && errors.description ? "error" : ""
          }
          help={touched.description && errors.description}
        >
          <TextArea
            value={values.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter template description (optional)"
            rows={3}
          />
        </Form.Item>

        <Divider>Template Data</Divider>

        {/* Items Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium">Items</h4>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddItem}
              loading={itemsLoading}
            >
              Add Item
            </Button>
          </div>

          {itemsLoading && <Spin />}

          {values.data.items.map((item, index) => (
            <Card key={index} size="small" className="bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  label="Select Item"
                  required
                  validateStatus={
                    touched.data?.items?.[index]?.itemId &&
                    (errors.data?.items?.[index] as { itemId?: string })?.itemId
                      ? "error"
                      : ""
                  }
                  help={
                    touched.data?.items?.[index]?.itemId &&
                    (errors.data?.items?.[index] as { itemId?: string })?.itemId
                  }
                >
                  <Select
                    value={item.itemId}
                    onChange={(value) =>
                      handleItemChange(index, "itemId", value)
                    }
                    placeholder="Search items..."
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase() || "").includes(
                        input.toLowerCase()
                      )
                    }
                    options={itemOptions}
                  />
                </Form.Item>

                <Form.Item label="Item Name" required>
                  <Input
                    value={item.itemName}
                    onChange={(e) =>
                      handleItemChange(index, "itemName", e.target.value)
                    }
                    placeholder="Item name"
                    disabled
                  />
                </Form.Item>

                <div className="flex items-end gap-2">
                  <Form.Item
                    label="Quantity"
                    required
                    className="flex-1"
                    validateStatus={
                      touched.data?.items?.[index]?.quantity &&
                      (errors.data?.items?.[index] as { quantity?: string })
                        ?.quantity
                        ? "error"
                        : ""
                    }
                    help={
                      touched.data?.items?.[index]?.quantity &&
                      (errors.data?.items?.[index] as { quantity?: string })
                        ?.quantity
                    }
                  >
                    <InputNumber
                      value={item.quantity}
                      onChange={(value) =>
                        handleItemChange(index, "quantity", value ?? 0)
                      }
                      min={1}
                      max={999}
                      className="w-full"
                    />
                  </Form.Item>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(index)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Koi Types Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium">Koi Types</h4>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddKoiType}
              loading={koiTypesLoading}
            >
              Add Koi Type
            </Button>
          </div>

          {koiTypesLoading && <Spin />}

          {values.data.koiTypes.map((koiType, index) => (
            <Card key={index} size="small" className="bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  label="Select Koi Type"
                  required
                  validateStatus={
                    touched.data?.koiTypes?.[index]?.koiTypeId &&
                    (errors.data?.koiTypes?.[index] as { koiTypeId?: string })
                      ?.koiTypeId
                      ? "error"
                      : ""
                  }
                  help={
                    touched.data?.koiTypes?.[index]?.koiTypeId &&
                    (errors.data?.koiTypes?.[index] as { koiTypeId?: string })
                      ?.koiTypeId
                  }
                >
                  <Select
                    value={koiType.koiTypeId}
                    onChange={(value) =>
                      handleKoiTypeChange(index, "koiTypeId", value)
                    }
                    placeholder="Search koi types..."
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase() || "").includes(
                        input.toLowerCase()
                      )
                    }
                    options={koiTypeOptions}
                  />
                </Form.Item>

                <Form.Item label="Koi Type Name" required>
                  <Input
                    value={koiType.koiTypeName}
                    onChange={(e) =>
                      handleKoiTypeChange(index, "koiTypeName", e.target.value)
                    }
                    placeholder="Koi type name"
                    disabled
                  />
                </Form.Item>

                <div className="flex items-end gap-2">
                  <Form.Item
                    label="Quantity"
                    required
                    className="flex-1"
                    validateStatus={
                      touched.data?.koiTypes?.[index]?.quantity &&
                      (errors.data?.koiTypes?.[index] as { quantity?: string })
                        ?.quantity
                        ? "error"
                        : ""
                    }
                    help={
                      touched.data?.koiTypes?.[index]?.quantity &&
                      (errors.data?.koiTypes?.[index] as { quantity?: string })
                        ?.quantity
                    }
                  >
                    <InputNumber
                      value={koiType.quantity}
                      onChange={(value) =>
                        handleKoiTypeChange(index, "quantity", value ?? 0)
                      }
                      min={1}
                      max={999}
                      className="w-full"
                    />
                  </Form.Item>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveKoiType(index)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* JSON Preview */}
        {showPreview && (
          <div className="space-y-2">
            <h4 className="text-lg font-medium">Preview JSON Data</h4>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
              {JSON.stringify(values, null, 2)}
            </pre>
          </div>
        )}

        {/* Error Display */}
        {submitError && (
          <Alert
            message="Error"
            description={submitError}
            type="error"
            showIcon
            closable
          />
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button onClick={handleReset}>Reset</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {loading
              ? `${mode === "create" ? "Creating" : "Updating"}...`
              : `${mode === "create" ? "Create" : "Update"} Template`}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

// Keep the old export for backward compatibility
export const AddTemplateForm = TemplateForm;
