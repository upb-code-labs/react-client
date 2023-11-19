import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

export const deleteObjectiveService = async (
  objectiveUUID: string
): Promise<GenericResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.delete(`rubrics/objectives/${objectiveUUID}`);
    return {
      success: true,
      message: "The objective has been deleted successfully"
    };
  } catch (error) {
    let errorMessage = "There was an error deleting the objective";

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
