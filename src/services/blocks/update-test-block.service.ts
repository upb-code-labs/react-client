import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type updateTestBlockRequest = {
  blockUUID: string;
  blockLanguageUUID: string;
  blockName: string;
  blockTestArchive?: File;
};

export async function updateTestBlockService({
  blockUUID,
  blockLanguageUUID,
  blockName,
  blockTestArchive
}: updateTestBlockRequest): Promise<void> {
  const { axios } = HttpRequester.getInstance();

  try {
    // Create the multipart form data
    const formData = new FormData();
    formData.append("block_name", blockName);
    formData.append("language_uuid", blockLanguageUUID);
    if (blockTestArchive) formData.append("test_archive", blockTestArchive);

    // Send the request
    await axios.put(`/blocks/test_blocks/${blockUUID}`, formData);
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "There was an error updating the test block";
    let errorMessage = DEFAULT_ERROR_MESSAGE;

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    throw new Error(errorMessage);
  }
}
