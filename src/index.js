import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { ConfirmProvider } from "material-ui-confirm";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ConfirmProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfirmProvider>
  </React.StrictMode>
);
