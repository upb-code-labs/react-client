import { Rubric } from "@/types/entities/rubric";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export type GetRubricByUuidResponse = {
  rubric: Rubric;
  success: boolean;
  message: string;
};

export const getRubricByUuidService = async (
  uuid: string
): Promise<GetRubricByUuidResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(`/rubrics/${uuid}`);
    return {
      rubric: data.rubric,
      success: true,
      message: "Rubric was retrieved successfully"
    };
  } catch (error) {
    let errorMessage = "There was an error";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return {
      rubric: {} as Rubric,
      success: false,
      message: errorMessage
    };
  }
};
