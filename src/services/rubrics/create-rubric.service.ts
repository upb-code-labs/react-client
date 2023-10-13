import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export type CreateRubricResponse = {
  uuid: string;
  success: boolean;
  message: string;
};

export const createRubricService = async (
  name: string
): Promise<CreateRubricResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.post("/rubrics", { name });
    return {
      uuid: data.uuid,
      success: true,
      message: "Rubric was created successfully"
    };
  } catch (error) {
    let errorMessage = "There was an error";

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
