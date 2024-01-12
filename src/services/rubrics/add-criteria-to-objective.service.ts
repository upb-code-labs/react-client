import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type AddCriteriaToObjectiveReq = {
  objectiveUUID: string;
  description: string;
  weight: number;
};

export async function addCriteriaToObjectiveService({
  objectiveUUID,
  description,
  weight
}: AddCriteriaToObjectiveReq): Promise<string> {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.post(
      `/rubrics/objectives/${objectiveUUID}/criteria`,
      {
        description,
        weight
      }
    );
    return data.uuid;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "There was an error adding the criteria";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
