import ReactDOM from "react-dom/client";
import React from "react";
import { Toaster } from "sonner";
import { RegisterStudent } from "./screens/register-student/RegisterStudent";
import { Navbar } from "@/components/Navbar/Navbar.tsx";
import { Home } from "./screens/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./global.css";
import { Login } from "./screens/login/Login";
import { CoursesHome } from "./screens/courses-home/CoursesHome";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster expand closeButton richColors />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/students" element={<RegisterStudent />} />
        <Route path="/courses" element={<CoursesHome />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
