import { Rubric } from "@/types/entities/rubric";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export const getRubricByUuidService = async (uuid: string): Promise<Rubric> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(`/rubrics/${uuid}`);
    return data.rubric;
  } catch (error) {
    let errorMessage = "There was an error";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    throw new Error(errorMessage);
  }
};
