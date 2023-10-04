import { getCoursesService } from "@/services/courses/get-user-courses.service";
import { Course } from "@/types/entities/course";
import { useEffect, useReducer, useState } from "react";
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

  const [loading, setLoading] = useState(false);

  // Get the courses on load
  const getCourses = async () => {
    console.log("[INFO]: Getting courses");
    setLoading(true);
    const { success, ...res } = await getCoursesService();

    if (!success) {
      toast.error(res.message);
      setLoading(false);
      return;
    }

    coursesDispatcher({
      type: CoursesActionType.SET_COURSES,
      payload: res
    });
    setLoading(false);
  };

  useEffect(() => {
    getCourses();
  }, []);

  return {
    loading,
    courses,
    coursesDispatcher
  };
};
