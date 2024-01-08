import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

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
}: updateTestBlockRequest): Promise<GenericResponse> {
  const { axios } = HttpRequester.getInstance();

  try {
    // Create the multipart form data
    const formData = new FormData();
    formData.append("block_name", blockName);
    formData.append("language_uuid", blockLanguageUUID);
    if (blockTestArchive) formData.append("test_archive", blockTestArchive);

    // Send the request
    await axios.put(`/blocks/test_blocks/${blockUUID}`, formData);

    // Parse the request
    return {
      success: true,
      message: "The test block has been updated successfully"
    };
  } catch (error) {
    let errorMessage = "There was an error updating the test block";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return {
      success: false,
      message: errorMessage
    };
  }
}
