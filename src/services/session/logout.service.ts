import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

export const logoutService = async (): Promise<GenericResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.delete("/session/logout");
    return { success: true, message: "You have successfully logged out!" };
  } catch (error) {
    let errorMessage = "There was an error";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return { success: false, message: errorMessage };
  }
};
