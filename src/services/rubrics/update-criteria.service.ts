import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type updateCriteriaServiceParams = {
  criteriaUUID: string;
  description: string;
  weight: number;
};

export const updateCriteriaService = async ({
  criteriaUUID,
  description,
  weight
}: updateCriteriaServiceParams): Promise<GenericResponse> => {
  try {
    const { axios } = HttpRequester.getInstance();
    await axios.put(`/rubrics/criteria/${criteriaUUID}`, {
      description,
      weight
    });
    return {
      success: true,
      message: "The criteria has been updated successfully"
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
