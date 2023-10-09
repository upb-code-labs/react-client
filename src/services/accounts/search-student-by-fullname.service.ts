import { Student } from "@/types/entities/student";
import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type searchStudentResponse = GenericResponse & {
  students: Student[];
};

export const searchStudentByFullNameService = async (
  fullName: string
): Promise<searchStudentResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(`/accounts/students?fullName=${fullName}`);
    return {
      success: true,
      message: "Students were obtained successfully",
      students: data["students"]
    };
  } catch (error) {
    let errorMessage = "There was an error searching the students";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return { success: false, message: errorMessage, students: [] };
  }
};
