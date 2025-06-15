import { type FormikValues, useFormik } from "formik";
import { useState } from "react";
import { ObjectSchema } from "yup";

interface UseFormProps<T extends FormikValues> {
  initialValues: T;
  validationSchema: ObjectSchema<T>;
  onSubmit: (values: T) => Promise<void>;
}

export function useForm<T extends FormikValues>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormProps<T>) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await onSubmit(values);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleChange = (field: keyof T, value: string) => {
    formik.setFieldValue(field as string, value);
  };

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  return {
    values: formik.values,
    errors: formik.errors,
    touched: formik.touched,
    loading,
    handleChange,
    handleSubmit,
    setFieldValue: formik.setFieldValue,
    setFieldTouched: formik.setFieldTouched,
    resetForm: formik.resetForm,
  };
}
