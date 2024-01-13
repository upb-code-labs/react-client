import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type setStudentEnrollmentStatusServiceArgs = {
  studentUUID: string;
  courseUUID: string;
  toActive: boolean;
};

export const setStudentEnrollmentStatusService = async ({
  studentUUID,
  courseUUID,
  toActive
}: setStudentEnrollmentStatusServiceArgs): Promise<void> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.patch(`/courses/${courseUUID}/students/${studentUUID}/status`, {
      to_active: toActive
    });
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We had an error updating the student status";

    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
};
