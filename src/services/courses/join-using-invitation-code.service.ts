import { Course } from "@/types/entities/general-entities";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export async function joinUsingInvitationCodeService(
  code: string
): Promise<Course> {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.post(`/courses/join/${code}`);
    return data.course;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We had a problem adding you to the course";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
