import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

interface updateProfileParams {
  full_name: string;
  email: string;
  password: string;
  institutional_id?: string;
}

export async function updateProfileService(
  params: updateProfileParams
): Promise<void> {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.put("/accounts/profile", params);
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We had an error updating your profile";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
