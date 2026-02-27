import './index.css';
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ToastProvider } from "./components/ToastProvider";
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <ToastProvider>
      <App />
    </ToastProvider>
  );
}