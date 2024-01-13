import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export async function deleteMarkdownBlockService(
  markdownBlockUUID: string
): Promise<void> {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.delete(`/blocks/markdown_blocks/${markdownBlockUUID}`);
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE =
      "There was an error deleting the markdown block";
    let errorMessage = DEFAULT_ERROR_MESSAGE;

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    throw new Error(errorMessage);
  }
}
