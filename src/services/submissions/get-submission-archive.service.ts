import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type getSubmissionArchiveServiceResponse = GenericResponse & {
  submissionArchive: Blob;
};

export async function getSubmissionArchiveService(
  submissionUUID: string
): Promise<getSubmissionArchiveServiceResponse> {
  const { axios } = HttpRequester.getInstance();

  try {
    const response = await axios.get(`/submissions/${submissionUUID}/archive`, {
      responseType: "blob"
    });
    return {
      success: true,
      message: "Submission archive was downloaded successfully",
      submissionArchive: response.data
    };
  } catch (error) {
    let errorMessage = "There was an error downloading the submission archive";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return {
      success: false,
      message: errorMessage,
      submissionArchive: new Blob()
    };
  }
}
