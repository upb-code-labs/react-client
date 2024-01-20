import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

interface setGradeCommentServiceArgs {
  laboratoryUUID: string;
  studentUUID: string;
  comment: string;
}

export async function setGradeCommentService({
  laboratoryUUID,
  studentUUID,
  comment
}: setGradeCommentServiceArgs): Promise<void> {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.put(
      `grades/laboratories/${laboratoryUUID}/students/${studentUUID}/comment`,
      {
        comment
      }
    );
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We had a problem setting the grade comment";

    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
