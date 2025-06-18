import * as yup from "yup";

export const templateFormSchema = yup.object({
  name: yup
    .string()
    .required("Template name is required")
    .min(3, "Template name must be at least 3 characters")
    .max(100, "Template name must not exceed 100 characters"),

  type: yup
    .string()
    .oneOf(["starter", "event", "seasonal", "vip"], "Invalid template type")
    .required("Template type is required"),

  version: yup
    .string()
    .required("Version is required")
    .matches(/^\d+\.\d+\.\d+$/, "Version must follow the x.y.z format"),

  description: yup
    .string()
    .max(500, "Description must not exceed 500 characters")
    .required("Description is required"),

  data: yup.object({
    items: yup.array().of(
      yup.object({
        itemId: yup.string().required("Item ID is required"),
        itemName: yup.string().required("Item name is required"),
        quantity: yup
          .number()
          .required("Quantity is required")
          .min(1, "Quantity must be greater than 0")
          .max(999, "Quantity must not exceed 999"),
      })
    ),
    koiTypes: yup.array().of(
      yup.object({
        koiTypeId: yup.string().required("Koi type ID is required"),
        koiTypeName: yup.string().required("Koi type name is required"),
        quantity: yup
          .number()
          .required("Quantity is required")
          .min(1, "Quantity must be greater than 0")
          .max(999, "Quantity must not exceed 999"),
      })
    ),
  }),
});
