import { Navbar } from "@/components/Navbar/Navbar.tsx";
import { AuthMiddleware } from "@/components/session/AuthMiddleware";
import { AuthContextProvider } from "@/context/AuthContext";
import { Home } from "@/screens/Home";
import { AdminsView } from "@/screens/admins-view/AdminsView";
import { CoursesHome } from "@/screens/courses-home/CoursesHome";
import { Login } from "@/screens/login/Login";
import { RegisterAdmin } from "@/screens/register-admin/RegisterAdmin";
import { RegisterStudent } from "@/screens/register-student/RegisterStudent";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import "./global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <Toaster expand closeButton richColors />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <AuthMiddleware>
                <Login />
              </AuthMiddleware>
            }
          />
          <Route
            path="/register/students"
            element={
              <AuthMiddleware>
                <RegisterStudent />
              </AuthMiddleware>
            }
          />
          <Route
            path="/register/admins"
            element={
              <AuthMiddleware mustBeLoggedIn roles={["admin"]}>
                <RegisterAdmin />
              </AuthMiddleware>
            }
          />
          <Route path="/courses" element={<CoursesHome />} />
          <Route
            path="/admins"
            element={
              <AuthMiddleware mustBeLoggedIn roles={["admin"]}>
                <AdminsView />
              </AuthMiddleware>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);
