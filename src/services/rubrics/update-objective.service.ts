import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

/* 
export const updateObjectiveService = async (
  objectiveUUID: string,
  description: string
): Promise<GenericResponse> => {
  try {
    const { axios } = HttpRequester.getInstance();
    await axios.put(`/rubrics/objectives/${objectiveUUID}`, {
      description
    });
    return {
      success: true,
      message: "The objective has been updated successfully"
    };
  } catch (error) {
    let errorMessage = "There was an error";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};
*/

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
