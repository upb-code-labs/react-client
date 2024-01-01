import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

export const deleteTestBlockService = async (
  testBlockUUID: string
): Promise<GenericResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.delete(`/blocks/test_blocks/${testBlockUUID}`);

    return {
      success: true,
      message: "The test block has been deleted successfully"
    };
  } catch (error) {
    let errorMessage = "There was an error deleting the test block";

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
