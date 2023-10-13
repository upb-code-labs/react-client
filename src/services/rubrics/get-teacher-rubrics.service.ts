import { CreatedRubric } from "@/types/entities/rubric";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export type GetTeacherRubricsResponse = {
  success: boolean;
  message: string;
  rubrics: CreatedRubric[];
};

export const getTeacherRubricsService =
  async (): Promise<GetTeacherRubricsResponse> => {
    const { axios } = HttpRequester.getInstance();

    try {
      const { data } = await axios.get("/rubrics");
      return {
        success: true,
        message: "Rubrics were retrieved successfully",
        rubrics: data.rubrics
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
        rubrics: []
      };
    }
  };
