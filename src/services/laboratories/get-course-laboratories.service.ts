import { LaboratoryBaseInfo } from "@/types/entities/laboratory";
import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type getCourseLaboratoriesResponse = GenericResponse & {
  laboratories: LaboratoryBaseInfo[];
};

export const getCourseLaboratoriesService = async (
  courseUUID: string
): Promise<getCourseLaboratoriesResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(`/courses/${courseUUID}/laboratories`);

    return {
      success: true,
      message: "Laboratories were fetched successfully",
      laboratories: data.laboratories
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
      laboratories: []
    };
  }
};
