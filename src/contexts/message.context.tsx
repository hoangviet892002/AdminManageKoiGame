import { createContext, useContext } from "react";
import { message, notification } from "antd";

interface IMessageContext {
  showMessage: (type: "success" | "error" | "info", text: string) => void;
}

const MessageContext = createContext<IMessageContext>({
  showMessage: () => {},
});

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const showMessage = (type: "success" | "error" | "info", text: string) => {
    console.log(`Message Type: ${type}, Text: ${text}`);
    messageApi.open({
      type: type,
      content: text,
    });
  };

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
