import React, { useEffect, useCallback, useRef } from "react";
import { Form, Input, Button, Modal, Select } from "antd";
import { useForm } from "../../../hooks/useForm";
import { addOneKoiBreedValidation } from "../../../schemas/koi-breed.schema";
import useKoiTypesStore from "../stores/koiTypesStore";
import type { KoiBreedType } from "../../../types/koi-breed.type";
import { ImageUploader } from "../../../components/ImageUploader";
import type { ImageUploaderRef } from "../../../components/ImageUploader/ImageUploader";

import { useMessage } from "../../../contexts/message.context";
import { useQueryClient } from "@tanstack/react-query";
import queryKey from "../../../constant/query-key";
import { koiBreedApi } from "../../../apis/koi-breed.api";

const { Option } = Select;

const RARITY_OPTIONS = [
  { value: "common", label: "Common" },
  { value: "uncommon", label: "Uncommon" },
  { value: "rare", label: "Rare" },
  { value: "epic", label: "Epic" },
  { value: "legendary", label: "Legendary" },
];

const KoiBreedForm: React.FC = () => {
  const { currentKoiType, isModalOpen, setModalOpen } = useKoiTypesStore();
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
  } = useForm<KoiBreedType>({
    initialValues: {
      breedName: "",
      description: "",
      basePrice: 0,
      rarity: "common",
      baseGrowthRate: 0,
      imgUrl: "",
    },
    validationSchema: addOneKoiBreedValidation,
    onSubmit: async (values) => {
      try {
        const uploadedImage = await imageUploaderRef.current?.uploadManually();
        const submittedValues = {
          ...values,
          imgUrl: uploadedImage || values.imgUrl,
        };

        const response = currentKoiType
          ? await koiBreedApi.updateKoiBreed(
              currentKoiType._id || "",
              submittedValues
            )
          : await koiBreedApi.createKoiBreed(submittedValues);

        if (response.isSuccess) {
          showMessage(
            "success",
            response.message || "Koi breed saved successfully"
          );
          await queryClient.invalidateQueries({
            queryKey: [queryKey.getKoiTypes],
          });
          setModalOpen(false);
        } else {
          showMessage("error", response.message || "Failed to save koi breed");
        }
      } catch (error) {
        console.error("Error saving koi breed:", error);
        showMessage("error", "An error occurred while saving the koi breed");
      }
    },
  });

  useEffect(() => {
    if (currentKoiType) {
      setValues(currentKoiType);
    } else {
      setValues({
        breedName: "",
        description: "",
        basePrice: 0,
        rarity: "common",
        baseGrowthRate: 0,
        imgUrl: "",
      });
    }
  }, [currentKoiType, isModalOpen, setValues]);

  const handleCancel = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  const handleImageUploadSuccess = useCallback(
    (urls: string[]) => {
      if (urls.length > 0) {
        handleChange("imgUrl", urls[0]);
        setFieldTouched("imgUrl", true);
        showMessage("success", "Image uploaded successfully");
      }
    },
    [handleChange, setFieldTouched, showMessage]
  );

  const handleImageUploadError = useCallback(() => {
    showMessage("error", "Image upload failed");
  }, [showMessage]);

  return (
    <Modal
      title={
        <div className="text-xl font-bold text-gray-800">
          {currentKoiType ? "Edit Koi Breed" : "Create New Koi Breed"}
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
        className="koi-breed-form px-1"
        onFinish={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <Form.Item
              label={
                <span className="font-medium text-gray-700">Breed Name</span>
              }
              validateStatus={
                touched.breedName && errors.breedName ? "error" : ""
              }
              help={
                touched.breedName && errors.breedName
                  ? errors.breedName
                  : undefined
              }
            >
              <Input
                value={values.breedName}
                onChange={(e) => handleChange("breedName", e.target.value)}
                placeholder="Enter breed name"
                onBlur={() => setFieldTouched("breedName", true)}
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
              <Input.TextArea
                rows={3}
                value={values.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter description"
                onBlur={() => setFieldTouched("description", true)}
                className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-medium text-gray-700">Base Price</span>
              }
              validateStatus={
                touched.basePrice && errors.basePrice ? "error" : ""
              }
              help={
                touched.basePrice && errors.basePrice
                  ? errors.basePrice
                  : undefined
              }
            >
              <Input
                type="number"
                value={values.basePrice}
                onChange={(e) =>
                  handleChange("basePrice", Number(e.target.value))
                }
                placeholder="Enter base price"
                onBlur={() => setFieldTouched("basePrice", true)}
                className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>
          </div>

          {/* Image and Rarity Section */}
          <div className="space-y-4">
            <Form.Item
              label={<span className="font-medium text-gray-700">Image</span>}
              validateStatus={touched.imgUrl && errors.imgUrl ? "error" : ""}
              help={touched.imgUrl && errors.imgUrl ? errors.imgUrl : undefined}
              required
            >
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <ImageUploader
                  ref={imageUploaderRef}
                  value={values.imgUrl}
                  onUploadSuccess={handleImageUploadSuccess}
                  onUploadError={handleImageUploadError}
                  buttonText={values.imgUrl ? "Change Image" : "Upload Image"}
                  maxFiles={1}
                />
              </div>
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-gray-700">Rarity</span>}
              validateStatus={touched.rarity && errors.rarity ? "error" : ""}
              help={touched.rarity && errors.rarity ? errors.rarity : undefined}
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
              label={
                <span className="font-medium text-gray-700">
                  Base Growth Rate
                </span>
              }
              validateStatus={
                touched.baseGrowthRate && errors.baseGrowthRate ? "error" : ""
              }
              help={
                touched.baseGrowthRate && errors.baseGrowthRate
                  ? errors.baseGrowthRate
                  : undefined
              }
            >
              <Input
                type="number"
                value={values.baseGrowthRate}
                onChange={(e) =>
                  handleChange("baseGrowthRate", Number(e.target.value))
                }
                placeholder="Enter base growth rate"
                onBlur={() => setFieldTouched("baseGrowthRate", true)}
                className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>
          </div>
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
            {currentKoiType ? "Update Koi Breed" : "Create Koi Breed"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default KoiBreedForm;
