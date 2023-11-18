import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

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
