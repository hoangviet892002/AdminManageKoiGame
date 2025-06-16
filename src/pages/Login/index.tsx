import React from "react";
import { useForm } from "../../hooks/useForm";
import { loginSchema } from "../../schemas/auth.schema";
import { useAuth } from "../../contexts/auth.context";
import logo from "../../assets/logo.png"; // Import logo từ module assets
import { Form, Input, Button, Card } from "antd";

interface LoginFormValues {
  username: string;
  password: string;
}

const Login = () => {
  const { login } = useAuth();

  const { values, errors, touched, handleChange, handleSubmit, loading } =
    useForm<LoginFormValues>({
      initialValues: {
        username: "",
        password: "",
      },
      validationSchema: loginSchema,
      onSubmit: async (values) => {
        await login(values);
      },
    });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-96 shadow-lg">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="App Logo" className="h-16" />
        </div>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            validateStatus={touched.username && errors.username ? "error" : ""}
            help={touched.username && errors.username}
          >
            <Input
              id="username"
              value={values.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="rounded-md"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            validateStatus={touched.password && errors.password ? "error" : ""}
            help={touched.password && errors.password}
          >
            <Input.Password
              id="password"
              value={values.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="rounded-md"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full rounded-md"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
