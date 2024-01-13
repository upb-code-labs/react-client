import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type updateMarkdownBlockContentParams = {
  markdownBlockUUID: string;
  content: string;
};

export async function updateMarkdownBlockContentService({
  markdownBlockUUID,
  content
}: updateMarkdownBlockContentParams): Promise<void> {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.patch(`/blocks/markdown_blocks/${markdownBlockUUID}/content`, {
      content
    });
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE =
      "There was an error updating the markdown block";
    let errorMessage = DEFAULT_ERROR_MESSAGE;

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    throw new Error(errorMessage);
  }
}
