import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/main.scss";
import { CubeProvider } from "./contexts/cubeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CubeProvider>
      <App />
    </CubeProvider>
  </React.StrictMode>
);
