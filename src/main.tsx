import React from "react";
import ReactDOM from "react-dom/client";
import { Navbar } from "@/components/Navbar/Navbar.tsx";
import "./global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./screens/Home";
import { RegisterStudent } from "./screens/register-student/RegisterStudent";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register/students" element={<RegisterStudent />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
