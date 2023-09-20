import React from "react";
import ReactDOM from "react-dom/client";
import { Navbar } from "@/components/Navbar/Navbar.tsx";
import "./global.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  </React.StrictMode>
);
