import { Rubric } from "@/types/entities/rubric-entities";
import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type GetRubricByUuidResponse = GenericResponse & {
  rubric: Rubric;
};

export const getRubricByUuidService = async (
  uuid: string
): Promise<GetRubricByUuidResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(`/rubrics/${uuid}`);
    return {
      success: true,
      message: "Rubric retrieved successfully",
      rubric: data.rubric
    };
  } catch (error) {
    let errorMessage = "There was an error";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return {
      success: false,
      message: errorMessage,
      rubric: {} as Rubric
    };
  }
};
