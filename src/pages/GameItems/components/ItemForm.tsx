import React, { useEffect, useCallback, useRef } from "react";
import { Form, Input, Button, Modal, Select, Switch } from "antd";
import { useForm } from "../../../hooks/useForm";
import { addOneItemValidation } from "../../../schemas/item.scheme";
import useGameItemsStore from "../stores/gameItemsStore";
import type { ItemType } from "../../../types/ItemType";
import { ImageUploader } from "../../../components/ImageUploader";
import { itemApi } from "../../../apis/item.api";
import { useMessage } from "../../../contexts/message.context";
import type { ImageUploaderRef } from "../../../components/ImageUploader/ImageUploader";

const { Option } = Select;
const { TextArea } = Input;

// "common" | "uncommon" | "rare" | "epic" | "legendary";
const RARITY_OPTIONS = [
  { value: "common", label: "Common" },
  { value: "uncommon", label: "Uncommon" },
  { value: "rare", label: "Rare" },
  { value: "epic", label: "Epic" },
  { value: "legendary", label: "Legendary" },
];

//"food" | "medicine" | "upgrade" | "decoration" | "special";

const TYPE_OPTIONS = [
  { value: "food", label: "Food" },
  { value: "medicine", label: "Medicine" },
  { value: "upgrade", label: "Upgrade" },
  { value: "decoration", label: "Decoration" },
  { value: "special", label: "Special" },
];

const ItemForm: React.FC = () => {
  const { currentItem, setCurrentItem, isModalOpen, setModalOpen } =
    useGameItemsStore();

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
    [handleChange, setFieldTouched]
  );

  const handleImageUploadError = useCallback(() => {
    showMessage("error", "Image upload failed");
  }, []);

  const handlePriceChange = useCallback(
    (field: "coins" | "gems", e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Allow empty string or numeric values
      if (value === "" || /^\d*$/.test(value)) {
        handleChange(`price.${field}`, Number(value) || 0);
      }
    },
    [handleChange]
  );

  return (
    <Modal
      title={currentItem ? "Edit Item" : "Add Item"}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      width={800}
    >
      <Form layout="vertical" className="item-form" onFinish={handleSubmit}>
        <Form.Item
          label="Name"
          validateStatus={touched.name && errors.name ? "error" : ""}
          help={touched.name && errors.name ? errors.name : undefined}
        >
          <Input
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter item name"
            onBlur={() => setFieldTouched("name", true)}
          />
        </Form.Item>

        <Form.Item
          label="Description"
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
          />
        </Form.Item>

        <div style={{ display: "flex", gap: 16 }}>
          <Form.Item
            label="Rarity"
            style={{ flex: 1 }}
            validateStatus={touched.rarity && errors.rarity ? "error" : ""}
            help={touched.rarity && errors.rarity ? errors.rarity : undefined}
          >
            <Select
              value={values.rarity}
              onChange={(value) => handleChange("rarity", value)}
              onBlur={() => setFieldTouched("rarity", true)}
              placeholder="Select rarity"
            >
              {RARITY_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Type"
            style={{ flex: 1 }}
            validateStatus={touched.type && errors.type ? "error" : ""}
            help={touched.type && errors.type ? errors.type : undefined}
          >
            <Select
              value={values.type}
              onChange={(value) => handleChange("type", value)}
              onBlur={() => setFieldTouched("type", true)}
              placeholder="Select type"
            >
              {TYPE_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <Form.Item
            label="Price (Coins)"
            style={{ flex: 1 }}
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
              placeholder="Enter price in coins"
              onBlur={() => setFieldTouched("price.coins", true)}
            />
          </Form.Item>

          <Form.Item
            label="Price (Gems)"
            style={{ flex: 1 }}
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
              placeholder="Enter price in gems"
              onBlur={() => setFieldTouched("price.gems", true)}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Stackable"
          validateStatus={touched.stackable && errors.stackable ? "error" : ""}
          help={
            touched.stackable && errors.stackable ? errors.stackable : undefined
          }
        >
          <Switch
            checked={values.stackable}
            onChange={(checked) => handleChange("stackable", checked)}
          />
        </Form.Item>

        <Form.Item
          label="Image"
          validateStatus={touched.image && errors.image ? "error" : ""}
          help={touched.image && errors.image ? errors.image : undefined}
          required
        >
          <ImageUploader
            ref={imageUploaderRef}
            value={values.image}
            onUploadSuccess={handleImageUploadSuccess}
            onUploadError={handleImageUploadError}
            buttonText={values.image ? "Change Image" : "Upload Image"}
            maxFiles={1}
          />
        </Form.Item>

        <Form.Item
          label="Effects"
          validateStatus={touched.effects && errors.effects ? "error" : ""}
          help={
            touched.effects && errors.effects
              ? JSON.stringify(errors.effects)
              : undefined
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input
              placeholder="Health"
              value={values.effects?.health || ""}
              onChange={(e) =>
                handleChange(
                  "effects.health",
                  Number(e.target.value) || undefined
                )
              }
            />
            <Input
              placeholder="Happiness"
              value={values.effects?.happiness || ""}
              onChange={(e) =>
                handleChange(
                  "effects.happiness",
                  Number(e.target.value) || undefined
                )
              }
            />
            <Input
              placeholder="Energy"
              value={values.effects?.energy || ""}
              onChange={(e) =>
                handleChange(
                  "effects.energy",
                  Number(e.target.value) || undefined
                )
              }
            />
            <Input
              placeholder="Growth"
              value={values.effects?.growth || ""}
              onChange={(e) =>
                handleChange(
                  "effects.growth",
                  Number(e.target.value) || undefined
                )
              }
            />
            <Input
              placeholder="Breeding"
              value={values.effects?.breeding || ""}
              onChange={(e) =>
                handleChange(
                  "effects.breeding",
                  Number(e.target.value) || undefined
                )
              }
            />
            <div style={{ marginTop: 16 }}>
              <h4>Environment Effects</h4>
              <Input
                placeholder="Temperature"
                value={values.effects?.environment?.temperature || ""}
                onChange={(e) =>
                  handleChange(
                    "effects.environment.temperature",
                    Number(e.target.value) || undefined
                  )
                }
              />
              <Input
                placeholder="pH"
                value={values.effects?.environment?.pH || ""}
                onChange={(e) =>
                  handleChange(
                    "effects.environment.pH",
                    Number(e.target.value) || undefined
                  )
                }
              />
              <Input
                placeholder="Oxygen"
                value={values.effects?.environment?.oxygen || ""}
                onChange={(e) =>
                  handleChange(
                    "effects.environment.oxygen",
                    Number(e.target.value) || undefined
                  )
                }
              />
              <Input
                placeholder="Cleanliness"
                value={values.effects?.environment?.cleanliness || ""}
                onChange={(e) =>
                  handleChange(
                    "effects.environment.cleanliness",
                    Number(e.target.value) || undefined
                  )
                }
              />
            </div>
          </div>
        </Form.Item>

        <Form.Item
          label="Duration (hours)"
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
          />
        </Form.Item>

        <Form.Item
          label="Max Stack"
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
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {currentItem ? "Update Item" : "Add Item"}
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ItemForm;
