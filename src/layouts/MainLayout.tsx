import React from "react";
import { Layout, Menu, Button } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth.context";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsible>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]}>
          <Menu.Item key="dashboard" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="profile" onClick={() => navigate("/profile")}>
            Profile
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Main Layout</h2>
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Header>
        <Content style={{ margin: "16px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
