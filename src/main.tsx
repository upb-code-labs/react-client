import { Navbar } from "@/components/Navbar/Navbar.tsx";
import { Home } from "@/screens/Home";
import { CoursesHome } from "@/screens/courses-home/CoursesHome";
import { Login } from "@/screens/login/Login";
import { RegisterStudent } from "@/screens/register-student/RegisterStudent";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import { AuthContextProvider } from "./context/AuthContext";
import "./global.css";
import { AdminsView } from "./screens/admins-view/AdminsView";
import { RegisterAdmin } from "./screens/register-admin/RegisterAdmin";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <Toaster expand closeButton richColors />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/students" element={<RegisterStudent />} />
          <Route path="/register/admins" element={<RegisterAdmin />} />
          <Route path="/courses" element={<CoursesHome />} />
          <Route path="/admins" element={<AdminsView />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);
