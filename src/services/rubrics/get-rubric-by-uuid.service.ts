import { Rubric } from "@/types/entities/rubric-entities";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export async function getRubricByUUIDService(uuid: string): Promise<Rubric> {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(`/rubrics/${uuid}`);
    return data.rubric;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We had an error obtaining the rubric";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
