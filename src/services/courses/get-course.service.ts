import { Course } from "@/types/entities/general-entities";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export async function getCourseService(id: string): Promise<Course> {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(`/courses/${id}`);
    return data;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "There was an error obtaining the course";
    let errorMessage = DEFAULT_ERROR_MESSAGE;

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    throw new Error(errorMessage);
  }
}
