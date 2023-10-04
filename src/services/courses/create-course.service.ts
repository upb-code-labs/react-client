import { Course } from "@/types/entities/course";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type CreateCourseResponse = {
  success: boolean;
  message: string;
  course: Course;
};

export const createCourseService = async (
  name: string
): Promise<CreateCourseResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.post("/courses", { name });
    return {
      success: true,
      message: "Course was created successfully",
      course: data
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
      course: {} as Course
    };
  }
};
