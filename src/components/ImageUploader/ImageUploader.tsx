import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { ImageUploaderType } from "./types";
import { Config } from "../../constant/config";
export interface ImageUploaderRef {
  triggerUpload: () => void;
  uploadManually: () => Promise<string | null>; // trả về URL
}
const ImageUploader = forwardRef<ImageUploaderRef, ImageUploaderType>(
  (
    {
      onUploadSuccess,
      onUploadError,
      buttonText = "Upload",
      maxFiles = 1,
      accept = "image/*",
      disabled = false,
      value,
      listType = "picture-card",
    },
    ref
  ) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileRef = useRef<File | null>(null);
    const triggerUpload = () => {
      fileInputRef.current?.click();
    };
    const cloudName = Config.CLOUDINARY_NAME;
    const presetKey = Config.CLOUDINARY_KEY;
    const uploadManually = async (): Promise<string | null> => {
      if (value && !fileRef.current) {
        return value; // Nếu đã có giá trị, không cần upload lại
      }
      if (!fileRef.current) return null;
      const file = fileRef.current;

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", presetKey);
        const endPoint = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
        const response = await fetch(endPoint, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`Failed to upload`);
        }
        return (await response.json()).secure_url;
      } catch (err) {
        return null;
      }
    };

    const beforeUpload = (file: File) => {
      fileRef.current = file;
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      return false;
    };
    useImperativeHandle(ref, () => ({
      triggerUpload,
      uploadManually,
    }));
    const handlePreview = (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    };

    const handleChange = (info: any) => {
      if (info.file.status === "removed") {
        setPreviewUrl(null);
      } else if (info.file.originFileObj) {
        handlePreview(info.file.originFileObj);
      }
    };

    const imageSource = previewUrl ?? value;

    return (
      <div className="">
        <Upload
          beforeUpload={beforeUpload}
          name="image"
          action={undefined}
          onChange={handleChange}
          showUploadList={false}
          maxCount={maxFiles}
          accept={accept}
          disabled={disabled}
          listType={listType}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) beforeUpload(file);
            }}
          />
          <Button icon={<UploadOutlined />} disabled={disabled}></Button>
        </Upload>

        {imageSource && (
          <img
            src={imageSource}
            alt="Preview"
            style={{
              marginTop: 10,
              width: "200px",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        )}
      </div>
    );
  }
);
export default ImageUploader;
