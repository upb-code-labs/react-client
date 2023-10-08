import { Footer } from "@/components/Footer/Footer";
import { Navbar } from "@/components/Navbar/Navbar.tsx";
import { AuthMiddleware } from "@/components/session/AuthMiddleware";
import { AuthContextProvider } from "@/context/AuthContext";
import { Home } from "@/screens/Home";
import { AdminsView } from "@/screens/admins-view/AdminsView";
import { CoursesHome } from "@/screens/courses-home/CoursesHome";
import { FormContainer } from "@/screens/session/FormContainer";
import { Login } from "@/screens/session/login/Login";
import { Logout } from "@/screens/session/logout/Logout";
import { RegisterAdminForm } from "@/screens/session/register-admin/Form";
import { RegisterStudentForm } from "@/screens/session/register-student/Form";
import { RegisterTeacherForm } from "@/screens/session/register-teacher/Form";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import { UserCoursesProvider } from "./context/courses/UserCoursesContext";
import "./global.css";
import { CoursePageLayout } from "./screens/course-page/CoursePageLayout";
import { CourseLaboratories } from "./screens/course-page/laboratories/CourseLaboratories";
import { CourseParticipants } from "./screens/course-page/participants/CourseParticipants";

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
            path="/logout"
            element={
              <AuthMiddleware mustBeLoggedIn>
                <Logout />
              </AuthMiddleware>
            }
          />
          <Route
            path="/register/students"
            element={
              <AuthMiddleware>
                <FormContainer form={<RegisterStudentForm />} />
              </AuthMiddleware>
            }
          />
          <Route
            path="/register/admins"
            element={
              <AuthMiddleware mustBeLoggedIn roles={["admin"]}>
                <FormContainer form={<RegisterAdminForm />} />
              </AuthMiddleware>
            }
          />
          <Route
            path="/register/teachers"
            element={
              <AuthMiddleware mustBeLoggedIn roles={["admin"]}>
                <FormContainer form={<RegisterTeacherForm />} />
              </AuthMiddleware>
            }
          />
          <Route
            path="/admins"
            element={
              <AuthMiddleware mustBeLoggedIn roles={["admin"]}>
                <AdminsView />
              </AuthMiddleware>
            }
          />
          <Route
            path="/courses"
            element={
              <UserCoursesProvider>
                <AuthMiddleware mustBeLoggedIn roles={["teacher", "student"]}>
                  <CoursesHome />
                </AuthMiddleware>
              </UserCoursesProvider>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <AuthMiddleware mustBeLoggedIn roles={["teacher", "student"]}>
                <CoursePageLayout />
              </AuthMiddleware>
            }
          >
            <Route
              path="laboratories"
              element={
                <AuthMiddleware mustBeLoggedIn roles={["teacher", "student"]}>
                  <CourseLaboratories />
                </AuthMiddleware>
              }
            />
            <Route
              path="participants"
              element={
                <AuthMiddleware mustBeLoggedIn roles={["teacher"]}>
                  <CourseParticipants />
                </AuthMiddleware>
              }
            />
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);
