import { getCoursesService } from "@/services/courses/get-user-courses.service";
import { Course } from "@/types/entities/general-entities";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export type CoursesState = {
  courses: Course[];
  hiddenCourses: Course[];
};

export const useCourses = () => {
  const {
    data: courses,
    isLoading: loading,
    isError,
    error
  } = useQuery({
    queryKey: ["courses"],
    queryFn: getCoursesService
  });

  // Handle error
  if (isError) {
    toast.error(error?.message);
  }

  return {
    loading,
    courses
  };
};
