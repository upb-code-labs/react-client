import { GridContainer } from "@/components/GridContainer";
import { EmptyContentText } from "@/components/Texts/EmptyContentText";
import { AuthContext } from "@/context/AuthContext";
import { UserCoursesContext } from "@/context/courses/UserCoursesContext";
import { SessionRole } from "@/hooks/useSession";
import { useContext } from "react";

import { CourseCard } from "./components/CourseCard";
import { CourseCardSkeleton } from "./components/CourseCardSkeleton";
import { CreateCourseDialog } from "./dialogs/create-course/CreateCourseDialog";
import { JoinCourseDialog } from "./dialogs/join-course/JoinCourseDialog";
import { RenameCourseDialog } from "./dialogs/rename-course/RenameCourseDialog";

export const CoursesHome = () => {
  const { isLoading, userCourses } = useContext(UserCoursesContext);
  const { user } = useContext(AuthContext);
  const role = user?.role || "student";

  const getActionButtonByRole = (role: SessionRole) => {
    if (role === "teacher") {
      return <CreateCourseDialog />;
    } else {
      return <JoinCourseDialog />;
    }
  };

  return (
    <main className="mx-auto max-w-7xl p-4">
      {/* Modals */}
      <RenameCourseDialog />
      {/* "Accordion element" to show the visible courses*/}
      <details open>
        <summary className="py-4">Your courses</summary>
        <GridContainer>
          {getActionButtonByRole(role)}
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <CourseCardSkeleton key={`course-skeleton-${i}`} />
              ))
            : userCourses.courses.map((course) => {
                return (
                  <CourseCard
                    key={course.uuid}
                    course={course}
                    isHidden={false}
                  />
                );
              })}
        </GridContainer>
      </details>
      {/* "Accordion element" to show the hidden courses*/}
      <details className="mt-4">
        <summary className="py-4">Hidden courses</summary>
        {userCourses.hiddenCourses.length > 0 ? (
          <GridContainer>
            {userCourses.hiddenCourses.map((course) => (
              <CourseCard key={course.uuid} course={course} isHidden />
            ))}
          </GridContainer>
        ) : (
          <EmptyContentText text="You don't have any hidden courses" />
        )}
      </details>
    </main>
  );
};
