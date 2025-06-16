import React from "react";
import { Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

const Screen501: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Title level={2} className="text-blue-500">
        501 - Not Implemented
      </Title>
      <Paragraph>
        This feature is not yet implemented. Please check back later.
      </Paragraph>
      <Button type="primary" href="/">
        Go Back
      </Button>
    </div>
  );
};

export default Screen501;
