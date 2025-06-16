import { type FormikValues, useFormik } from "formik";
import { useState, useCallback } from "react";
import { ObjectSchema } from "yup";

interface UseFormProps<T extends FormikValues> {
  initialValues: T;
  validationSchema: ObjectSchema<any>;
  onSubmit: (values: T) => Promise<void>;
}

export function useForm<T extends FormikValues>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormProps<T>) {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        setLoading(true);
        setSubmitError(null);
        await onSubmit(values);
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "Submission failed"
        );
        helpers.setSubmitting(false);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleChange = useCallback(
    (field: string, value: unknown) => {
      formik.setFieldValue(field, value);
    },
    [formik]
  );

  const handleSubmit = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  return {
    values: formik.values,
    errors: formik.errors,
    touched: formik.touched,
    loading,
    submitError,
    handleChange,
    handleSubmit,
    setValues: formik.setValues,
    setFieldValue: formik.setFieldValue,
    setFieldTouched: formik.setFieldTouched,
    resetForm: formik.resetForm,
  };
}
