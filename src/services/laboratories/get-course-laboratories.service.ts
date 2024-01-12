import { LaboratoryBaseInfo } from "@/types/entities/laboratory-entities";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export async function getCourseLaboratoriesService(
  courseUUID: string
): Promise<LaboratoryBaseInfo[]> {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(`/courses/${courseUUID}/laboratories`);
    return data.laboratories;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE =
      "There was an error obtaining the laboratories";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
