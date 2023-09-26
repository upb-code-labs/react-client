import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type registerTeacherDTO = {
  full_name: string;
  email: string;
  password: string;
};

export const registerTeacherService = async (
  data: registerTeacherDTO
): Promise<GenericResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.post("/accounts/teachers", data);
    return { success: true, message: "The teacher has been registered!" };
  } catch (error) {
    let errorMessage = "There was an error";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return { success: false, message: errorMessage };
  }
};
