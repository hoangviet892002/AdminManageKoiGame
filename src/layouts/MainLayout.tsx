import React from "react";
import { Layout, Menu, Button } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth.context";
import logo from "../assets/logo.png"; // Import logo từ module assets

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
        <div style={{ padding: "16px", textAlign: "center" }}>
          <img
            src={logo}
            alt="App Logo"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]}>
          <Menu.Item key="dashboard" onClick={() => navigate("/")}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="profile" onClick={() => navigate("/profile")}>
            Profile
          </Menu.Item>
          <Menu.Item key="koi-types" onClick={() => navigate("/koi-types")}>
            Manage Koi Types
          </Menu.Item>
          <Menu.Item key="game-items" onClick={() => navigate("/game-items")}>
            Manage Game Items
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
          <img src={logo} alt="App Logo" style={{ height: "40px" }} />
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
