import { Course } from "@/types/entities/course";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type JoinUsingInvitationCodeResponse = {
  success: boolean;
  message: string;
  course?: Course;
};

export const joinUsingInvitationCodeService = async (
  code: string
): Promise<JoinUsingInvitationCodeResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const response = await axios.post(`/courses/join/${code}`);

    return {
      success: true,
      message: "You have joined the course",
      course: response.data.course
    };
  } catch (error) {
    let errorMessage = "There was an error";

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
