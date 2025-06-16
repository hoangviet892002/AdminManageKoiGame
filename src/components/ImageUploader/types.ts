export interface ImageUploaderType {
  onUploadSuccess?: (urls: string[]) => void;
  onUploadError?: (error: any) => void;
  handleUpload?: () => void;
  buttonText?: string;
  uploadText?: string;
  maxFiles?: number;
  accept?: ".pdf" | ".docx" | ".txt" | "image/*";
  listType?: "text" | "picture" | "picture-card";
  disabled?: boolean;
  value?: string | null;
}
