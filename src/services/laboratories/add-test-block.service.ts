import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type createTestBlockResponse = GenericResponse & {
  uuid: string;
};

type createTestBlockRequest = {
  laboratoryUUID: string;
  blockLanguageUUID: string;
  blockName: string;
  blockTestArchive: File;
};

export const createTestBlockService = async ({
  blockLanguageUUID,
  laboratoryUUID,
  blockName,
  blockTestArchive
}: createTestBlockRequest): Promise<createTestBlockResponse> => {
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

    // Parse the request
    return {
      success: true,
      message: "The new test block has been created",
      uuid: data.uuid
    };
  } catch (error) {
    let errorMessage = "There was an error creating the new test block";

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
};
