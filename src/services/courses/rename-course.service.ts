import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export const renameCourseService = async (
  id: string,
  name: string
): Promise<void> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.patch(`/courses/${id}/name`, { name });
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "There was an error renaming the course";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
};
