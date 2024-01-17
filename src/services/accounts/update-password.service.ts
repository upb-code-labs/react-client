import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type updatePasswordParams = {
  old_password: string;
  new_password: string;
};

export async function updatePasswordService(
  params: updatePasswordParams
): Promise<GenericResponse> {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.patch("/accounts/password", params);
    return { success: true, message: "Your password has been updated" };
  } catch (error) {
    let errorMessage = "We couldn't update your password";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return { success: false, message: errorMessage };
  }
}
