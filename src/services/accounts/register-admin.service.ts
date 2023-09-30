import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type registerAdminDTO = {
  full_name: string;
  email: string;
  password: string;
};

export const registerAdminService = async (
  data: registerAdminDTO
): Promise<GenericResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.post("/accounts/admins", data);
    return { success: true, message: "The admin has been registered!" };
  } catch (error) {
    let errorMessage = "There was an error";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return { success: false, message: errorMessage };
  }
};
