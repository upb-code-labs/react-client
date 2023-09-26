import { AxiosError } from "axios";

import { HttpRequester } from "../axios";
import { LoginResponse } from "./login.service";

export const whoamiService = async (): Promise<LoginResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const response = await axios.get("/session/whoami");
    return {
      success: true,
      message: "You are logged in!",
      user: response.data.user
    };
  } catch (error) {
    let errorMessage = "There was an error";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return { success: false, message: errorMessage };
  }
};
