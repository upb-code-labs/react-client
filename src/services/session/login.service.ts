import { SessionUser } from "@/hooks/useSession";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type loginDTO = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  user?: SessionUser;
};

export const loginService = async (data: loginDTO): Promise<LoginResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const response = await axios.post("/session/login", data);
    return {
      success: true,
      message: "You have been logged in!",
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
