import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export async function deleteRubricService(rubricUUID: string): Promise<void> {
  const { axios } = HttpRequester.getInstance();
  try {
    await axios.delete(`/rubrics/${rubricUUID}`);
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "There was an error deleting the rubric";

    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
