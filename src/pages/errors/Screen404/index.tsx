import React from "react";
import { Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

const Screen404: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Title level={2} className="text-red-500">
        404 - Page Not Found
      </Title>
      <Paragraph>Sorry, the page you are looking for does not exist.</Paragraph>
      <Button type="primary" href="/">
        Go Back
      </Button>
    </div>
  );
};

export default Screen404;
