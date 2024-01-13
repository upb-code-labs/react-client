import { Course } from "@/types/entities/general-entities";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type GetCoursesResponse = {
  courses: Course[];
  hiddenCourses: Course[];
};

export const getCoursesService = async (): Promise<GetCoursesResponse> => {
  try {
    const { data } = await HttpRequester.getInstance().axios.get("/courses");
    return {
      courses: data["courses"],
      hiddenCourses: data["hidden_courses"]
    };
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We had an error obtaining your courses";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
};
