import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type GetInvitationCodeResponse = {
  success: boolean;
  message: string;
  code: string;
};

export const getInvitationCodeService = async (
  courseId: string
): Promise<GetInvitationCodeResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(`/courses/${courseId}/invitation-code`);
    return {
      success: true,
      message: "Invitation code was obtained successfully",
      code: data["code"]
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
      code: ""
    };
  }
};
