import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type ToggleCourseVisibilityNewResponse = {
  visible: boolean;
};

export const toggleCourseVisibilityService = async (
  courseId: string
): Promise<ToggleCourseVisibilityNewResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.patch(`/courses/${courseId}/visibility`);
    return {
      visible: data.visible
    };
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "There was an error";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
};
