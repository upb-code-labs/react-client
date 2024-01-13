// Import components and views
import { Footer } from "@/components/Footer/Footer";
import { Navbar } from "@/components/Navbar/Navbar.tsx";
import { AuthMiddleware } from "@/components/session/AuthMiddleware";
import { AuthContextProvider } from "@/context/AuthContext";
import { UserCoursesDialogsProvider } from "@/context/courses/UserCoursesDialogsContext";
import { EditLaboratoryProvider } from "@/context/laboratories/EditLaboratoryContext";
import { AdminsView } from "@/screens/admins-list/AdminsView";
import { StudentsLaboratoryView } from "@/screens/complete-laboratory/StudentsLaboratoryView";
import { CoursePageLayout } from "@/screens/course-page/CoursePageLayout";
import { CourseLaboratories } from "@/screens/course-page/laboratories/CourseLaboratories";
import { CourseParticipants } from "@/screens/course-page/participants/CourseParticipants";
import { CoursesHome } from "@/screens/courses-list/CoursesHome";
import { EditLaboratory } from "@/screens/edit-laboratory/EditLaboratory";
import { EditRubricView } from "@/screens/edit-rubric/EditRubricView";
import { RubricsHome } from "@/screens/rubrics-list/RubricsHome";
import { FormContainer } from "@/screens/session/FormContainer";
import { Login } from "@/screens/session/login/Login";
import { Logout } from "@/screens/session/logout/Logout";
import { RegisterAdminForm } from "@/screens/session/register-admin/Form";
import { RegisterStudentForm } from "@/screens/session/register-student/Form";
import { RegisterTeacherForm } from "@/screens/session/register-teacher/Form";
// Import fonts
import "@fontsource/ibm-plex-mono/400.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Home } from "lucide-react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

// Apply global styles
import "./global.css";
import { LaboratoryProgressView } from "./screens/laboratory-progress/LaboratoryProgressView";

// Define query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, refetchOnReconnect: false }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <QueryClientProvider client={queryClient}>
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
              <UserCoursesDialogsProvider>
                <AuthMiddleware mustBeLoggedIn roles={["teacher", "student"]}>
                  <CoursesHome />
                </AuthMiddleware>
              </UserCoursesDialogsProvider>
            }
          />
          <Route
            path="/courses/:courseUUID"
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
              path="laboratories/:laboratoryUUID/edit"
              element={
                <AuthMiddleware mustBeLoggedIn roles={["teacher"]}>
                  <EditLaboratoryProvider>
                    <EditLaboratory />
                  </EditLaboratoryProvider>
                </AuthMiddleware>
              }
            />
            <Route
              path="laboratories/:laboratoryUUID/complete"
              element={
                <AuthMiddleware mustBeLoggedIn roles={["student"]}>
                  <StudentsLaboratoryView />
                </AuthMiddleware>
              }
            />
            <Route
              path="laboratories/:laboratoryUUID/progress"
              element={
                <AuthMiddleware mustBeLoggedIn roles={["teacher"]}>
                  <LaboratoryProgressView />
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
            path="/rubrics/:rubricUUID"
            element={
              <AuthMiddleware roles={["teacher"]} mustBeLoggedIn>
                <EditRubricView />
              </AuthMiddleware>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  </AuthContextProvider>
);
