import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export type registeredAdminDTO = {
  uuid: string;
  full_name: string;
  created_by: string;
  created_at: string;
};

export async function getRegisteredAdminsService(): Promise<
  registeredAdminDTO[]
> {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get("/accounts/admins");
    return data["admins"];
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We had an error getting the admins list";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
