import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export async function updateObjectiveService(
  objectiveUUID: string,
  description: string
): Promise<void> {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.put(`/rubrics/objectives/${objectiveUUID}`, {
      description
    });
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "There was an error updating the objective";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
