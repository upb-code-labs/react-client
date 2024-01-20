import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export type selectedCriteriaInGrade = {
  objective_uuid: string;
  criteria_uuid: string | null;
};

export type studentGradeResponse = {
  grade: number;
  comment: string;
  selected_criteria: selectedCriteriaInGrade[];
};

type getGradeOfStudentInLaboratoryArgs = {
  laboratoryUUID: string;
  rubricUUID: string;
  studentUUID: string;
};

export async function getGradeOfStudentInLaboratoryService({
  laboratoryUUID,
  rubricUUID,
  studentUUID
}: getGradeOfStudentInLaboratoryArgs): Promise<studentGradeResponse> {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(
      `/grades/laboratories/${laboratoryUUID}/students/${studentUUID}/rubrics/${rubricUUID}`
    );

    return data as studentGradeResponse;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE =
      "We couldn't get the grade of the student in the laboratory";

    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
