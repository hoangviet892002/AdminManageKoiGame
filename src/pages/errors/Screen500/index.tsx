import React from "react";
import { Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

const Screen500: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Title level={2} className="text-yellow-500">
        500 - Internal Server Error
      </Title>
      <Paragraph>Something went wrong. Please try again later.</Paragraph>
      <Button type="primary" href="/">
        Go Back
      </Button>
    </div>
  );
};

export default Screen500;
