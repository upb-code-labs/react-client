import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type UpdateRubricNameResponse = {
  success: boolean;
  message: string;
};

export const updateRubricNameService = async (
  rubricUUID: string,
  name: string
): Promise<UpdateRubricNameResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.patch(`/rubrics/${rubricUUID}/name`, {
      name
    });
    return {
      success: true,
      message: "Rubric name was updated successfully"
    };
  } catch (error) {
    let errorMessage = "There was an error updating the rubric name";

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
