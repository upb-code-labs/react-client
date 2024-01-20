import { submissionStatus } from "@/types/entities/submission-entities";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export type summarizedStudentSubmission = {
  uuid: string;
  archive_uuid: string;
  test_block_name: string;
  status: submissionStatus;
  is_passing: boolean;
};

type gerProgressOfStudentServiceResponse = {
  total_test_blocks: number;
  submissions: summarizedStudentSubmission[];
};

interface gerProgressOfStudentServiceParams {
  laboratoryUUID: string;
  studentUUID: string;
}

export async function getProgressOfStudentService({
  laboratoryUUID,
  studentUUID
}: gerProgressOfStudentServiceParams): Promise<gerProgressOfStudentServiceResponse> {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(
      `/laboratories/${laboratoryUUID}/students/${studentUUID}/progress`
    );

    return data;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE =
      "There was an error getting the progress of the student";

    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
