import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type AddCriteriaToObjectiveResponse = {
  uuid: string;
  success: boolean;
  message: string;
};

export const addCriteriaToObjectiveService = async (
  objectiveUUID: string,
  description: string,
  weight: number
): Promise<AddCriteriaToObjectiveResponse> => {
  const { axios } = HttpRequester.getInstance();
  console.log({ description, weight });

  try {
    const { data } = await axios.post(
      `/rubrics/objectives/${objectiveUUID}/criteria`,
      {
        description,
        weight
      }
    );
    return {
      uuid: data.uuid,
      success: true,
      message: "Criteria was added successfully"
    };
  } catch (error) {
    let errorMessage = "There was an error adding the criteria";

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
