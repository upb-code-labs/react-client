import { EnrolledStudent } from "@/types/entities/general-entities";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export const enrollStudentService = async (
  student: EnrolledStudent,
  courseUUID: string
): Promise<void> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.post(`/courses/${courseUUID}/students`, {
      student_uuid: student.uuid
    });
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We had an error enrolling the student";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
};
