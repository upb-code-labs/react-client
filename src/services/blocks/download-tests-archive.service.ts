import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type downloadTestsArchiveResponse = GenericResponse & {
  testsArchive: Blob;
};

export async function downloadTestsArchiveService(
  testBlockUUID: string
): Promise<downloadTestsArchiveResponse> {
  const { axios } = HttpRequester.getInstance();

  try {
    const response = await axios.get(
      `/blocks/test_blocks/${testBlockUUID}/tests_archive`,
      {
        responseType: "blob"
      }
    );
    return {
      success: true,
      message: "Tests archive was downloaded successfully",
      testsArchive: response.data
    };
  } catch (error) {
    let errorMessage = "There was an error downloading the tests archive";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return { success: false, message: errorMessage, testsArchive: new Blob() };
  }
}
