import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export type summarizedGradeDTO = {
  student_uuid: string;
  student_full_name: string;
  grade?: number;
};

type summarizedGrades = {
  grades: summarizedGradeDTO[];
};

export async function getSummarizedGradesInLaboratoryService(
  laboratory_uuid: string
): Promise<summarizedGrades> {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(`grades/laboratories/${laboratory_uuid}`);
    return data;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE =
      "We had a problem obtaining the grades in the laboratory";

    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
