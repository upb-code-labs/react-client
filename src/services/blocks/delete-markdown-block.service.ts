import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

export const deleteMarkdownBlockService = async (
  markdownBlockUUID: string
): Promise<GenericResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.delete(`/blocks/markdown_blocks/${markdownBlockUUID}`);

    return {
      success: true,
      message: "The markdown block has been deleted successfully"
    };
  } catch (error) {
    let errorMessage = "There was an error deleting the markdown block";

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
