import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "antd/dist/reset.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/auth.context.tsx";
import { MessageProvider } from "./contexts/message.context.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MessageProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </MessageProvider>
  </StrictMode>
);
