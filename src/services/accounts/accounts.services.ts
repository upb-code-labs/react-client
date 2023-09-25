import { AxiosError } from "axios";
import { GenericResponse, HttpRequester } from "../axios";

type registerStudentDTO = {
  full_name: string;
  email: string;
  institutional_id: string;
  password: string;
};

export const registerStudent = async (
  data: registerStudentDTO
): Promise<GenericResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.post("/accounts/students", data);
    return { success: true, message: "Your account has been created!" };
  } catch (error) {
    let errorMessage = "There was an error";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return { success: false, message: errorMessage };
  }
};
