import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type updateMarkdownBlockContentParams = {
  markdownBlockUUID: string;
  content: string;
};

export const updateMarkdownBlockContentService = async ({
  markdownBlockUUID,
  content
}: updateMarkdownBlockContentParams): Promise<GenericResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.patch(`/blocks/markdown_blocks/${markdownBlockUUID}/content`, {
      content
    });

    return {
      success: true,
      message: "The markdown block has been updated successfully"
    };
  } catch (error) {
    let errorMessage = "There was an error updating the markdown block";

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
