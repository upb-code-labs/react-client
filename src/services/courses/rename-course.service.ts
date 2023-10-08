import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type RenameCourseResponse = {
  success: boolean;
  message: string;
};

export const renameCourseService = async (
  id: string,
  name: string
): Promise<RenameCourseResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.patch(`/courses/${id}/name`, { name });
    return {
      success: true,
      message: "Course was renamed successfully"
    };
  } catch (error) {
    let errorMessage = "There was an error renaming the course";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};
