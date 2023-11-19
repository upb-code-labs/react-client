import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

export const deleteCriteriaService = async (
  criteriaUUID: string
): Promise<GenericResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.delete(`rubrics/criteria/${criteriaUUID}`);
    return {
      success: true,
      message: "The criteria has been deleted successfully"
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
