import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export async function deleteCriteriaService(
  criteriaUUID: string
): Promise<void> {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.delete(`rubrics/criteria/${criteriaUUID}`);
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We had an error deleting the criteria";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
