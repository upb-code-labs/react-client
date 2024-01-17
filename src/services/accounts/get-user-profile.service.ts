import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export type userProfile = {
  full_name: string;
  email: string;
  institutional_id: string;
};

export async function getUserProfileService(): Promise<userProfile> {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get("/accounts/profile");
    return data;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We had an error obtaining your profile";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
