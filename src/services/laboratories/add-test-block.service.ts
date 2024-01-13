import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type createTestBlockParams = {
  laboratoryUUID: string;
  blockLanguageUUID: string;
  blockName: string;
  blockTestArchive: File;
};

export async function createTestBlockService({
  blockLanguageUUID,
  laboratoryUUID,
  blockName,
  blockTestArchive
}: createTestBlockParams): Promise<string> {
  const { axios } = HttpRequester.getInstance();

  try {
    // Create the multipart form data
    const formData = new FormData();
    formData.append("block_name", blockName);
    formData.append("language_uuid", blockLanguageUUID);
    formData.append("test_archive", blockTestArchive);

    // Send the request
    const { data } = await axios.post(
      `/laboratories/test_blocks/${laboratoryUUID}`,
      formData
    );

    return data.uuid;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE =
      "There was an error creating the new test block";
    let errorMessage = DEFAULT_ERROR_MESSAGE;

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    throw new Error(errorMessage);
  }
}
