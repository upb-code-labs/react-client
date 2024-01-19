import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type submitToTestBlockRequest = {
  testBlockUUID: string;
  submissionArchive: File;
};

type submitToTestBlockResponse = GenericResponse & {
  uuid: string;
};

export async function submitToTestBlockService({
  testBlockUUID,
  submissionArchive
}: submitToTestBlockRequest): Promise<submitToTestBlockResponse> {
  const { axios } = HttpRequester.getInstance();

  try {
    // Create the multipart form data
    const formData = new FormData();
    formData.append("submission_archive", submissionArchive);

    // Send the request
    const response = await axios.post(
      `/submissions/test_blocks/${testBlockUUID}`,
      formData
    );
    return {
      success: true,
      message: "Your code has been submitted successfully",
      uuid: response.data.uuid
    };
  } catch (error) {
    let errorMessage = "There was an error submitting your code";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return {
      success: false,
      message: errorMessage,
      uuid: ""
    };
  }
}
