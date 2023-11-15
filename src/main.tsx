import { Footer } from "@/components/Footer/Footer";
import { Navbar } from "@/components/Navbar/Navbar.tsx";
import { AuthMiddleware } from "@/components/session/AuthMiddleware";
import { AuthContextProvider } from "@/context/AuthContext";
import { UserCoursesProvider } from "@/context/courses/UserCoursesContext";
import {
  AdminsView,
  CourseLaboratories,
  CoursePageLayout,
  CourseParticipants,
  CoursesHome,
  EditRubricView,
  FormContainer,
  Login,
  Logout,
  RegisterAdminForm,
  RegisterStudentForm,
  RegisterTeacherForm,
  RubricsHome
} from "@/screens";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Home } from "lucide-react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import "./global.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
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
            <Route
              path="/rubrics"
              element={
                <AuthMiddleware roles={["teacher"]} mustBeLoggedIn>
                  <RubricsHome />
                </AuthMiddleware>
              }
            />
            <Route
              path="/rubrics/:id"
              element={
                <AuthMiddleware roles={["teacher"]} mustBeLoggedIn>
                  <EditRubricView />
                </AuthMiddleware>
              }
            />
          </Routes>
          <Footer />
        </BrowserRouter>
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </AuthContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
