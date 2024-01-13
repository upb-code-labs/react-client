import { Course } from "@/types/entities/general-entities";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export async function createCourseService(name: string): Promise<Course> {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.post("/courses", { name });
    return data;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We had a problem creating the course";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
