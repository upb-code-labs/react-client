import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type updateCriteriaServiceParams = {
  criteriaUUID: string;
  description: string;
  weight: number;
};

export async function updateCriteriaService({
  criteriaUUID,
  description,
  weight
}: updateCriteriaServiceParams): Promise<void> {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.put(`/rubrics/criteria/${criteriaUUID}`, {
      description,
      weight
    });
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "There was an error updating the criteria";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
