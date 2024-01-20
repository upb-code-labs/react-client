import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type selectCriteriaToGradeArgs = {
  laboratoryUUID: string;
  studentUUID: string;
  objective_uuid: string;
  criteria_uuid: string | null;
};

export async function selectCriteriaToGradeService({
  laboratoryUUID,
  studentUUID,
  objective_uuid,
  criteria_uuid
}: selectCriteriaToGradeArgs): Promise<void> {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.put(
      `grades/laboratories/${laboratoryUUID}/students/${studentUUID}`,
      {
        objective_uuid,
        criteria_uuid
      }
    );
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We had a problem selecting the criteria";

    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
