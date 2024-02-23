import { AuthMiddleware } from "@/components/AuthMiddleware";
import { Footer } from "@/components/Footer/Footer";
import { Navbar } from "@/components/Navbar/Navbar.tsx";
import { GenericFormSkeleton } from "@/components/Skeletons/GenericFormSkeleton";
import { AuthContextProvider } from "@/context/AuthContext";
import { UserCoursesDialogsProvider } from "@/context/courses/UserCoursesDialogsContext";
import { EditLaboratoryProvider } from "@/context/laboratories/EditLaboratoryContext";
import { AdminsViewSkeleton } from "@/screens/admins-list/skeletons/AdminsViewSkeleton";
import { CompleteLaboratoryViewSkeleton } from "@/screens/complete-laboratory/skeletons/CompleteLaboratoryViewSkeleton";
import { CourseLaboratoriesOutletSkeleton } from "@/screens/course-page/laboratories/skeletons/CourseLaboratoriesOutletSkeleton";
import { CourseParticipantsOutletSkeleton } from "@/screens/course-page/participants/skeletons/CourseParticipantsOutletSkeleton";
import { CoursePageLayoutSkeleton } from "@/screens/course-page/skeletons/CoursePageLayoutSkeleton";
import { CoursesHomeSkeleton } from "@/screens/courses-list/skeletons/CoursesHomeSkeleton";
import { EditLaboratoryPageSkeleton } from "@/screens/edit-laboratory/skeletons/EditLaboratoryPageSkeleton";
import { EditRubricViewSkeleton } from "@/screens/edit-rubric/skeletons/EditRubricViewSkeleton";
import { EditStudentGradeLayoutSkeleton } from "@/screens/edit-student-grade/skeletons/EditStudentGradeLayoutSkeleton";
import { Home } from "@/screens/home/Home";
import { LaboratoryGradesViewSkeleton } from "@/screens/laboratory-grades/skeletons/LaboratoryGradesViewSkeleton";
import { LaboratoryProgressDashboardSkeleton } from "@/screens/laboratory-progress/skeletons/LaboratoryProgressDashboardSkeleton";
import { UpdateProfileSkeleton } from "@/screens/profile/skeletons/UpdateProfileSkeleton";
import { RubricsHomeSkeleton } from "@/screens/rubrics-list/skeletons/RubricsHomeSkeleton";
import { FormContainer } from "@/screens/session/FormContainer";
import { Login } from "@/screens/session/login/Login";
import { Logout } from "@/screens/session/logout/Logout";
import { RegisterStudentForm } from "@/screens/session/register-student/Form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { lazily } from "react-lazily";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

// Apply global styles
import "./global.css";

const { RegisterAdminView } = lazily(
  () => import("@/screens/session/register-admin/RegisterAdminView")
);

const { RegisterTeacherView } = lazily(
  () => import("@/screens/session/register-teacher/RegisterTeacherView")
);

const { ProfileView } = lazily(() => import("@/screens/profile/ProfileView"));

const { AdminsView } = lazily(() => import("@/screens/admins-list/AdminsView"));

const { CoursesHome } = lazily(
  () => import("@/screens/courses-list/CoursesHome")
);

const { CoursePageLayout } = lazily(
  () => import("@/screens/course-page/CoursePageLayout")
);

const { CourseLaboratories } = lazily(
  () => import("@/screens/course-page/laboratories/CourseLaboratories")
);

const { EditLaboratory } = lazily(
  () => import("@/screens/edit-laboratory/EditLaboratory")
);

const { StudentsLaboratoryView } = lazily(
  () => import("@/screens/complete-laboratory/StudentsLaboratoryView")
);

const { LaboratoryProgressView } = lazily(
  () => import("@/screens/laboratory-progress/LaboratoryProgressView")
);

const { CourseParticipants } = lazily(
  () => import("@/screens/course-page/participants/CourseParticipants")
);

const { RubricsHome } = lazily(
  () => import("@/screens/rubrics-list/RubricsHome")
);

const { EditRubricView } = lazily(
  () => import("@/screens/edit-rubric/EditRubricView")
);

const { LaboratoryGrades } = lazily(
  () => import("@/screens/laboratory-grades/LaboratoryGrades")
);

const { EditStudentGradeView } = lazily(
  () => import("@/screens/edit-student-grade/EditStudentGradeView")
);

const { MyGradeView } = lazily(() => import("@/screens/my-grade/MyGradeView"));

// Define query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, refetchOnReconnect: false }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
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
                <Suspense fallback={<GenericFormSkeleton inputCount={3} />}>
                  <RegisterAdminView />
                </Suspense>
              </AuthMiddleware>
            }
          />
          <Route
            path="/register/teachers"
            element={
              <AuthMiddleware mustBeLoggedIn roles={["admin"]}>
                <Suspense fallback={<GenericFormSkeleton inputCount={3} />}>
                  <RegisterTeacherView />
                </Suspense>
              </AuthMiddleware>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthMiddleware mustBeLoggedIn>
                <Suspense fallback={<UpdateProfileSkeleton />}>
                  <ProfileView />
                </Suspense>
              </AuthMiddleware>
            }
          />
          <Route
            path="/admins"
            element={
              <AuthMiddleware mustBeLoggedIn roles={["admin"]}>
                <Suspense fallback={<AdminsViewSkeleton />}>
                  <AdminsView />
                </Suspense>
              </AuthMiddleware>
            }
          />
          <Route
            path="/courses"
            element={
              <UserCoursesDialogsProvider>
                <AuthMiddleware mustBeLoggedIn roles={["teacher", "student"]}>
                  <Suspense fallback={<CoursesHomeSkeleton />}>
                    <CoursesHome />
                  </Suspense>
                </AuthMiddleware>
              </UserCoursesDialogsProvider>
            }
          />
          <Route
            path="/courses/:courseUUID"
            element={
              <AuthMiddleware mustBeLoggedIn roles={["teacher", "student"]}>
                <Suspense fallback={<CoursePageLayoutSkeleton />}>
                  <CoursePageLayout />
                </Suspense>
              </AuthMiddleware>
            }
          >
            <Route
              path="laboratories"
              element={
                <AuthMiddleware mustBeLoggedIn roles={["teacher", "student"]}>
                  <Suspense fallback={<CourseLaboratoriesOutletSkeleton />}>
                    <CourseLaboratories />
                  </Suspense>
                </AuthMiddleware>
              }
            />
            <Route
              path="laboratories/:laboratoryUUID/edit"
              element={
                <AuthMiddleware mustBeLoggedIn roles={["teacher"]}>
                  <Suspense fallback={<EditLaboratoryPageSkeleton />}>
                    <EditLaboratoryProvider>
                      <EditLaboratory />
                    </EditLaboratoryProvider>
                  </Suspense>
                </AuthMiddleware>
              }
            />
            <Route
              path="laboratories/:laboratoryUUID/complete"
              element={
                <AuthMiddleware mustBeLoggedIn roles={["student"]}>
                  <Suspense fallback={<CompleteLaboratoryViewSkeleton />}>
                    <StudentsLaboratoryView />
                  </Suspense>
                </AuthMiddleware>
              }
            />
            <Route
              path="laboratories/:laboratoryUUID/progress"
              element={
                <AuthMiddleware mustBeLoggedIn roles={["teacher"]}>
                  <Suspense fallback={<LaboratoryProgressDashboardSkeleton />}>
                    <LaboratoryProgressView />
                  </Suspense>
                </AuthMiddleware>
              }
            />
            <Route
              path="laboratories/:laboratoryUUID/grades"
              element={
                <AuthMiddleware mustBeLoggedIn roles={["teacher"]}>
                  <Suspense fallback={<LaboratoryGradesViewSkeleton />}>
                    <LaboratoryGrades />
                  </Suspense>
                </AuthMiddleware>
              }
            />
            <Route
              path="laboratories/:laboratoryUUID/students/:studentUUID/edit-grade"
              element={
                <AuthMiddleware mustBeLoggedIn roles={["teacher"]}>
                  <Suspense fallback={<EditStudentGradeLayoutSkeleton />}>
                    <EditStudentGradeView />
                  </Suspense>
                </AuthMiddleware>
              }
            />
            <Route
              path="laboratories/:laboratoryUUID/my-grade"
              element={
                <AuthMiddleware mustBeLoggedIn roles={["student"]}>
                  <Suspense fallback={<EditStudentGradeLayoutSkeleton />}>
                    <MyGradeView />
                  </Suspense>
                </AuthMiddleware>
              }
            />
            <Route
              path="participants"
              element={
                <AuthMiddleware mustBeLoggedIn roles={["teacher"]}>
                  <Suspense fallback={<CourseParticipantsOutletSkeleton />}>
                    <CourseParticipants />
                  </Suspense>
                </AuthMiddleware>
              }
            />
          </Route>
          <Route
            path="/rubrics"
            element={
              <AuthMiddleware roles={["teacher"]} mustBeLoggedIn>
                <Suspense fallback={<RubricsHomeSkeleton />}>
                  <RubricsHome />
                </Suspense>
              </AuthMiddleware>
            }
          />
          <Route
            path="/rubrics/:rubricUUID"
            element={
              <AuthMiddleware roles={["teacher"]} mustBeLoggedIn>
                <Suspense fallback={<EditRubricViewSkeleton />}>
                  <EditRubricView />
                </Suspense>
              </AuthMiddleware>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </AuthContextProvider>
  </QueryClientProvider>
);
