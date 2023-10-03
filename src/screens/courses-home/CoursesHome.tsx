import { ButtonIconContainer } from "@/components/CourseCard/ButtonIconContainer";
import { CourseCard } from "@/components/CourseCard/CourseCard";
import { CourseCardSkeleton } from "@/components/CourseCard/CourseCardSkeleton";
import { GridContainer } from "@/components/GridContainer";
import { AuthContext } from "@/context/AuthContext";
import { UserCoursesContext } from "@/context/courses/UserCoursesContext";
import { SessionRole } from "@/hooks/useSession";
import { LogIn } from "lucide-react";
import { useContext } from "react";

import { CreateCourseDialog } from "./dialogs/create-course/CreateCourseDialog";

export const CoursesHome = () => {
  const { isLoading, userCourses } = useContext(UserCoursesContext);
  const { user } = useContext(AuthContext);
  const role = user?.role || "student";

  const getActionButtonByRole = (role: SessionRole) => {
    if (role === "teacher") {
      return <CreateCourseDialog />;
    } else {
      return (
        <button className="mx-auto flex aspect-square w-full max-w-xs flex-col items-center justify-center gap-4 rounded-xl border p-4 shadow-md transition-shadow hover:shadow-lg">
          <ButtonIconContainer Icon={<LogIn color="#fff" size={42} />} />
          <span className="text-lg">Join with an invitation code</span>
        </button>
      );
    }
  };

  return (
    <main className="mx-auto max-w-7xl p-4">
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
          <p className="text-lg text-muted-foreground">
            You don't have any hidden courses 🤷
          </p>
        )}
      </details>
    </main>
  );
};
