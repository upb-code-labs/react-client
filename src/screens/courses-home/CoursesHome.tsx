import { ButtonIconContainer } from "@/components/CourseCard/ButtonIconContainer";
import { CourseCard } from "@/components/CourseCard/CourseCard";
import { CourseCardSkeleton } from "@/components/CourseCard/CourseCardSkeleton";
import { GridContainer } from "@/components/GridContainer";
import { AuthContext } from "@/context/AuthContext";
import { SessionRole } from "@/hooks/useSession";
import { getCoursesService } from "@/services/courses/get-user-courses.service";
import { Course } from "@/types/entities/course";
import { LogIn } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { CreateCourseDialog } from "./dialogs/create-course/CreateCourseDialog";

export const CoursesHome = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role || "student";

  // State
  const [courses, setCourses] = useState<{
    courses: Course[];
    hiddenCourses: Course[];
  }>({ courses: [], hiddenCourses: [] });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCourses();
  }, []);

  // State setters
  const addCourse = (course: Course) => {
    setCourses((prev) => ({
      ...prev,
      courses: [...prev.courses, course]
    }));
  };

  // Services callers
  const getCourses = async () => {
    setLoading(true);
    const { success, ...res } = await getCoursesService();

    if (!success) {
      toast.error(res.message);
      return;
    }

    setCourses({
      courses: res.courses,
      hiddenCourses: res.hiddenCourses
    });
    setLoading(false);
  };

  const getActionButtonByRole = (role: SessionRole) => {
    if (role === "teacher") {
      return <CreateCourseDialog addNewCourseCallback={addCourse} />;
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
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <CourseCardSkeleton key={`course-skeleton-${i}`} />
              ))
            : courses.courses.map((course) => (
                <CourseCard key={course.uuid} course={course} />
              ))}
        </GridContainer>
      </details>
      {/* "Accordion element" to show the hidden courses*/}
      <details className="mt-4">
        <summary className="py-4">Hidden courses</summary>
        {courses.hiddenCourses.length > 0 ? (
          <GridContainer>
            {courses.hiddenCourses.map((course) => (
              <CourseCard key={course.uuid} course={course} />
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
