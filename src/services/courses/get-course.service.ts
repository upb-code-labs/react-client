import { Course } from "@/types/entities/general-entities";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type GetCourseResponse = {
  success: boolean;
  message: string;
  course: Course;
};

export const getCourseService = async (
  id: string
): Promise<GetCourseResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(`/courses/${id}`);
    return {
      success: true,
      message: "Course information was retrieved successfully",
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
