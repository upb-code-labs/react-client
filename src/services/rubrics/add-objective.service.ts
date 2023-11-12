import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export type AddObjectiveResponse = {
  uuid: string;
  success: boolean;
  message: string;
};

export const addObjectiveService = async (
  rubricUUID: string,
  description: string
): Promise<AddObjectiveResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.post(`/rubrics/${rubricUUID}/objectives`, {
      description
    });
    return {
      uuid: data.uuid,
      success: true,
      message: "Objective was added successfully"
    };
  } catch (error) {
    let errorMessage = "There was an error adding the objective";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return {
      uuid: "",
      success: false,
      message: errorMessage
    };
  }
};
