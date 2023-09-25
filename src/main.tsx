import { Navbar } from "@/components/Navbar/Navbar.tsx";
import { Home } from "@/screens/Home";
import { CoursesHome } from "@/screens/courses-home/CoursesHome";
import { Login } from "@/screens/login/Login";
import { RegisterStudent } from "@/screens/register-student/RegisterStudent";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import "./global.css";

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
