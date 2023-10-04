import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type ToggleCourseVisibilityResponse = {
  success: boolean;
  message: string;
  visible: boolean;
};

export const toggleCourseVisibilityService = async (
  courseId: string
): Promise<ToggleCourseVisibilityResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.patch(`/courses/${courseId}/visibility`);
    return {
      success: true,
      message: "Course visibility was updated successfully",
      visible: data.visible
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
      visible: false
    };
  }
};
