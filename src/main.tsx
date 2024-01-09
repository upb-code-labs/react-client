// Import components and views
import { Footer } from "@/components/Footer/Footer";
import { Navbar } from "@/components/Navbar/Navbar.tsx";
import { AuthMiddleware } from "@/components/session/AuthMiddleware";
import { AuthContextProvider } from "@/context/AuthContext";
import { UserCoursesProvider } from "@/context/courses/UserCoursesContext";
import { CourseLaboratoriesProvider } from "@/context/laboratories/CourseLaboratoriesContext";
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
import { Home } from "lucide-react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

// Apply global styles
import "./global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
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
                <CourseLaboratoriesProvider>
                  <CourseLaboratories />
                </CourseLaboratoriesProvider>
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
  </AuthContextProvider>
);
