import { EnrolledStudent } from "@/types/entities/enrolled-student";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type GetEnrolledStudentsResponse = {
  success: boolean;
  message: string;
  students: EnrolledStudent[];
};

export const getEnrolledStudentsService = async (
  id: string
): Promise<GetEnrolledStudentsResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(`/courses/${id}/students`);
    return {
      success: true,
      message: "Students were retrieved successfully",
      students: data.students
    };
  } catch (error) {
    let errorMessage = "There was an error retrieving the students";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return {
      success: false,
      message: errorMessage,
      students: []
    };
  }
};
