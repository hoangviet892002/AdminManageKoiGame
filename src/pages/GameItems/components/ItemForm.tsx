import React, { useEffect, useCallback, useRef } from "react";
import { Form, Input, Button, Modal, Select, Switch, Divider } from "antd";
import { useForm } from "../../../hooks/useForm";
import { addOneItemValidation } from "../../../schemas/item.scheme";
import useGameItemsStore from "../stores/gameItemsStore";
import type { ItemType } from "../../../types/ItemType";
import { ImageUploader } from "../../../components/ImageUploader";
import { itemApi } from "../../../apis/item.api";
import { useMessage } from "../../../contexts/message.context";
import type { ImageUploaderRef } from "../../../components/ImageUploader/ImageUploader";
import { useQueryClient } from "@tanstack/react-query";
import queryKey from "../../../constant/query-key";

const { Option } = Select;
const { TextArea } = Input;

const RARITY_OPTIONS = [
  { value: "common", label: "Common" },
  { value: "uncommon", label: "Uncommon" },
  { value: "rare", label: "Rare" },
  { value: "epic", label: "Epic" },
  { value: "legendary", label: "Legendary" },
];

const TYPE_OPTIONS = [
  { value: "food", label: "Food" },
  { value: "medicine", label: "Medicine" },
  { value: "upgrade", label: "Upgrade" },
  { value: "decoration", label: "Decoration" },
  { value: "special", label: "Special" },
];

const ItemForm: React.FC = () => {
  const { currentItem, isModalOpen, setModalOpen } = useGameItemsStore();
  const queryClient = useQueryClient();
  const { showMessage } = useMessage();
  const imageUploaderRef = useRef<ImageUploaderRef>(null);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    loading,
    setValues,
    setFieldTouched,
  } = useForm<ItemType>({
    initialValues: {
      name: "",
      description: "",
      price: { coins: 0, gems: 0 },
      image: "",
      rarity: "common",
      type: "decoration",
      stackable: false,
      effects: {},
      duration: 0,
    },
    validationSchema: addOneItemValidation,
    onSubmit: async (values) => {
      try {
        const uploadedImage = await imageUploaderRef.current?.uploadManually();
        const submittedValues = {
          ...values,
          image: uploadedImage || values.image,
          price: {
            coins: Number(values.price.coins) || 0,
            gems: Number(values.price.gems) || 0,
          },
        };

        const response = currentItem
          ? await itemApi.updateItem(currentItem._id || "", submittedValues)
          : await itemApi.createItem(submittedValues);

        if (response.isSuccess) {
          showMessage("success", response.message || "Item saved successfully");
          await queryClient.invalidateQueries({
            queryKey: [queryKey.getGameItems],
          });
          setModalOpen(false);
        } else {
          showMessage("error", response.message || "Failed to save item");
        }
      } catch (error) {
        console.error("Error saving item:", error);
        showMessage("error", "An error occurred while saving the item");
      }
    },
  });

  useEffect(() => {
    if (currentItem) {
      setValues({
        ...currentItem,
        price: {
          coins: currentItem.price.coins,
          gems: currentItem.price.gems,
        },
      });
    } else {
      setValues({
        name: "",
        description: "",
        price: { coins: 0, gems: 0 },
        image: "",
        rarity: "common",
        type: "decoration",
        stackable: false,
        effects: {},
        duration: 0,
      });
    }
  }, [currentItem, isModalOpen, setValues]);

  const handleCancel = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  const handleImageUploadSuccess = useCallback(
    (urls: string[]) => {
      if (urls.length > 0) {
        handleChange("image", urls[0]);
        setFieldTouched("image", true);
        showMessage("success", "Image uploaded successfully");
      }
    },
    [handleChange, setFieldTouched, showMessage]
  );

  const handleImageUploadError = useCallback(() => {
    showMessage("error", "Image upload failed");
  }, [showMessage]);

  const handlePriceChange = useCallback(
    (field: "coins" | "gems", e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || /^\d*$/.test(value)) {
        handleChange(`price.${field}`, Number(value) || 0);
      }
    },
    [handleChange]
  );

  return (
    <Modal
      title={
        <div className="text-xl font-bold text-gray-800">
          {currentItem ? "Edit Item" : "Create New Item"}
        </div>
      }
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      width={800}
      className="rounded-lg overflow-hidden"
    >
      <Form
        layout="vertical"
        className="item-form px-1"
        onFinish={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <Form.Item
              label={<span className="font-medium text-gray-700">Name</span>}
              validateStatus={touched.name && errors.name ? "error" : ""}
              help={touched.name && errors.name ? errors.name : undefined}
            >
              <Input
                value={values.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter item name"
                onBlur={() => setFieldTouched("name", true)}
                className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-medium text-gray-700">Description</span>
              }
              validateStatus={
                touched.description && errors.description ? "error" : ""
              }
              help={
                touched.description && errors.description
                  ? errors.description
                  : undefined
              }
            >
              <TextArea
                rows={3}
                value={values.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter item description"
                onBlur={() => setFieldTouched("description", true)}
                className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label={
                  <span className="font-medium text-gray-700">Rarity</span>
                }
                validateStatus={touched.rarity && errors.rarity ? "error" : ""}
                help={
                  touched.rarity && errors.rarity ? errors.rarity : undefined
                }
              >
                <Select
                  value={values.rarity}
                  onChange={(value) => handleChange("rarity", value)}
                  onBlur={() => setFieldTouched("rarity", true)}
                  placeholder="Select rarity"
                  className="w-full"
                >
                  {RARITY_OPTIONS.map((option) => (
                    <Option key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <span
                          className={`inline-block w-3 h-3 rounded-full mr-2 ${
                            option.value === "common"
                              ? "bg-gray-400"
                              : option.value === "uncommon"
                              ? "bg-green-400"
                              : option.value === "rare"
                              ? "bg-blue-400"
                              : option.value === "epic"
                              ? "bg-purple-400"
                              : "bg-yellow-400"
                          }`}
                        />
                        {option.label}
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={<span className="font-medium text-gray-700">Type</span>}
                validateStatus={touched.type && errors.type ? "error" : ""}
                help={touched.type && errors.type ? errors.type : undefined}
              >
                <Select
                  value={values.type}
                  onChange={(value) => handleChange("type", value)}
                  onBlur={() => setFieldTouched("type", true)}
                  placeholder="Select type"
                  className="w-full"
                >
                  {TYPE_OPTIONS.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              label={
                <span className="font-medium text-gray-700">Stackable</span>
              }
              validateStatus={
                touched.stackable && errors.stackable ? "error" : ""
              }
              help={
                touched.stackable && errors.stackable
                  ? errors.stackable
                  : undefined
              }
            >
              <div className="flex items-center">
                <Switch
                  checked={values.stackable}
                  onChange={(checked) => handleChange("stackable", checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">
                  {values.stackable ? "Yes" : "No"}
                </span>
              </div>
            </Form.Item>
          </div>

          {/* Image and Pricing Section */}
          <div className="space-y-4">
            <Form.Item
              label={<span className="font-medium text-gray-700">Image</span>}
              validateStatus={touched.image && errors.image ? "error" : ""}
              help={touched.image && errors.image ? errors.image : undefined}
              required
            >
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <ImageUploader
                  ref={imageUploaderRef}
                  value={values.image}
                  onUploadSuccess={handleImageUploadSuccess}
                  onUploadError={handleImageUploadError}
                  buttonText={values.image ? "Change Image" : "Upload Image"}
                  maxFiles={1}
                />
                {values.image && (
                  <div className="mt-2 text-xs text-gray-500">
                    Image preview will appear after upload
                  </div>
                )}
              </div>
            </Form.Item>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label={<span className="text-sm text-gray-600">Coins</span>}
                  validateStatus={
                    touched.price?.coins && errors.price?.coins ? "error" : ""
                  }
                  help={
                    touched.price?.coins && errors.price?.coins
                      ? errors.price.coins
                      : undefined
                  }
                >
                  <Input
                    value={values.price.coins}
                    onChange={(e) => handlePriceChange("coins", e)}
                    placeholder="Enter price"
                    onBlur={() => setFieldTouched("price.coins", true)}
                    prefix={
                      <span className="text-yellow-500 font-medium">🪙</span>
                    }
                    className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-sm text-gray-600">Gems</span>}
                  validateStatus={
                    touched.price?.gems && errors.price?.gems ? "error" : ""
                  }
                  help={
                    touched.price?.gems && errors.price?.gems
                      ? errors.price.gems
                      : undefined
                  }
                >
                  <Input
                    value={values.price.gems}
                    onChange={(e) => handlePriceChange("gems", e)}
                    placeholder="Enter price"
                    onBlur={() => setFieldTouched("price.gems", true)}
                    prefix={
                      <span className="text-purple-500 font-medium">💎</span>
                    }
                    className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>

        {/* Effects Section */}
        <Divider orientation="left" className="font-medium text-gray-700">
          Effects
        </Divider>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Pet Effects</h4>
            <Form.Item
              label={<span className="text-sm text-gray-600">Health</span>}
            >
              <Input
                placeholder="Health effect value"
                value={values.effects?.health || ""}
                onChange={(e) =>
                  handleChange(
                    "effects.health",
                    Number(e.target.value) || undefined
                  )
                }
                className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm text-gray-600">Happiness</span>}
            >
              <Input
                placeholder="Happiness effect value"
                value={values.effects?.happiness || ""}
                onChange={(e) =>
                  handleChange(
                    "effects.happiness",
                    Number(e.target.value) || undefined
                  )
                }
                className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm text-gray-600">Energy</span>}
            >
              <Input
                placeholder="Energy effect value"
                value={values.effects?.energy || ""}
                onChange={(e) =>
                  handleChange(
                    "effects.energy",
                    Number(e.target.value) || undefined
                  )
                }
                className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Environment Effects</h4>
            <Form.Item
              label={<span className="text-sm text-gray-600">Temperature</span>}
            >
              <Input
                placeholder="Temperature effect value"
                value={values.effects?.environment?.temperature || ""}
                onChange={(e) =>
                  handleChange(
                    "effects.environment.temperature",
                    Number(e.target.value) || undefined
                  )
                }
                className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm text-gray-600">pH Level</span>}
            >
              <Input
                placeholder="pH effect value"
                value={values.effects?.environment?.pH || ""}
                onChange={(e) =>
                  handleChange(
                    "effects.environment.pH",
                    Number(e.target.value) || undefined
                  )
                }
                className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm text-gray-600">Oxygen</span>}
            >
              <Input
                placeholder="Oxygen effect value"
                value={values.effects?.environment?.oxygen || ""}
                onChange={(e) =>
                  handleChange(
                    "effects.environment.oxygen",
                    Number(e.target.value) || undefined
                  )
                }
                className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>
          </div>
        </div>

        {/* Additional Properties */}
        <Divider orientation="left" className="font-medium text-gray-700">
          Additional Properties
        </Divider>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            label={
              <span className="font-medium text-gray-700">
                Duration (hours)
              </span>
            }
            validateStatus={touched.duration && errors.duration ? "error" : ""}
            help={
              touched.duration && errors.duration ? errors.duration : undefined
            }
          >
            <Input
              type="number"
              value={values.duration || ""}
              onChange={(e) =>
                handleChange("duration", Number(e.target.value) || undefined)
              }
              placeholder="Enter duration in hours"
              className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-medium text-gray-700">Max Stack Size</span>
            }
            validateStatus={touched.maxStack && errors.maxStack ? "error" : ""}
            help={
              touched.maxStack && errors.maxStack ? errors.maxStack : undefined
            }
          >
            <Input
              type="number"
              value={values.maxStack || ""}
              onChange={(e) =>
                handleChange("maxStack", Number(e.target.value) || undefined)
              }
              placeholder="Enter max stack size"
              className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500"
            />
          </Form.Item>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currentItem ? "Update Item" : "Create Item"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ItemForm;
