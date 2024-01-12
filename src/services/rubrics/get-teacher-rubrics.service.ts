import { CreatedRubric } from "@/types/entities/rubric-entities";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export async function getTeacherRubricsService(): Promise<CreatedRubric[]> {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get("/rubrics");
    return data["rubrics"];
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We had an error obtaining the rubrics list";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
