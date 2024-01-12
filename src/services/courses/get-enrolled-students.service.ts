import { EnrolledStudent } from "@/types/entities/general-entities";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export const getEnrolledStudentsService = async (
  courseUUID: string
): Promise<EnrolledStudent[]> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(`/courses/${courseUUID}/students`);
    return data.students;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We had an error obtaining the students";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
};
