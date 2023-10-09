import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type EnrollStudentResponse = {
  success: boolean;
  message: string;
};

export const enrollStudentService = async (
  courseId: string,
  studentId: string
): Promise<EnrollStudentResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.post(`/courses/${courseId}/students`, {
      student_uuid: studentId
    });
    return {
      success: true,
      message: "Student was enrolled successfully"
    };
  } catch (error) {
    let errorMessage = "There was an error";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};
