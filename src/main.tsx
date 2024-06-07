import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/main.scss";
import { CubeProvider } from "./contexts/cubeContext.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <CubeProvider>
        <App />
      </CubeProvider>
    </Provider>
  </React.StrictMode>
);
