import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export async function createRubricService(name: string): Promise<string> {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.post("/rubrics", { name });
    return data.uuid;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "There was an error creating the rubric";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
