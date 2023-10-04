import { Course } from "@/types/entities/course";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type GetCoursesREsponse = {
  success: boolean;
  message: string;
  courses: Course[];
  hiddenCourses: Course[];
};

export const getCoursesService = async (): Promise<GetCoursesREsponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get("/courses");
    return {
      success: true,
      message: "Courses were obtained successfully",
      courses: data["courses"],
      hiddenCourses: data["hidden_courses"]
    };
  } catch (error) {
    let errorMessage = "There was an error";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return {
      success: false,
      message: errorMessage,
      courses: [],
      hiddenCourses: []
    };
  }
};
