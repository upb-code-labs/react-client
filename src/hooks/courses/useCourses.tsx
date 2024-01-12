import { getCoursesService } from "@/services/courses/get-user-courses.service";
import { Course } from "@/types/entities/general-entities";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useReducer } from "react";
import { toast } from "sonner";

import { CoursesActionType, coursesReducer } from "./coursesReducer";

export type CoursesState = {
  courses: Course[];
  hiddenCourses: Course[];
};

export const useCourses = () => {
  // State
  const [courses, coursesDispatcher] = useReducer(coursesReducer, {
    courses: [],
    hiddenCourses: []
  });

  const {
    data,
    isLoading: loading,
    status,
    isError,
    error
  } = useQuery({
    queryKey: ["courses"],
    queryFn: getCoursesService
  });

  // Update courses state
  useEffect(() => {
    if (status === "success") {
      coursesDispatcher({
        type: CoursesActionType.SET_COURSES,
        payload: data
      });
    }
  }, [data, status]);

  // Handle error
  if (isError) {
    toast.error(error?.message);
  }

  return {
    loading,
    courses,
    coursesDispatcher
  };
};
