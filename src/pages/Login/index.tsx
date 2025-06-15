import React from "react";
import { useForm } from "../../hooks/useForm";
import { loginSchema } from "../../schemas/auth.schema";
import { useAuth } from "../../contexts/auth.context";
import { Form, Input, Button, Card, notification } from "antd";
import { useMessage } from "../../contexts/message.context";

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
    <div
      className="login-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card title="Login" style={{ width: 400 }}>
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
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
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
