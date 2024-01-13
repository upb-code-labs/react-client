import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export async function addObjectiveService(
  rubricUUID: string,
  description: string
): Promise<string> {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.post(`/rubrics/${rubricUUID}/objectives`, {
      description
    });

    return data.uuid;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "There was an error adding the objective";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
