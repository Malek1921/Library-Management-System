import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RouterIndex from "./RouterIndex.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterIndex />
  </StrictMode>
);
