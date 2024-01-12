import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export async function updateRubricNameService(
  rubricUUID: string,
  name: string
): Promise<void> {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.patch(`/rubrics/${rubricUUID}/name`, {
      name
    });
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We had an error updating the rubric name";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
