import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export async function createMarkdownBlockService(
  laboratoryUUID: string
): Promise<string> {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.post(
      `/laboratories/markdown_blocks/${laboratoryUUID}`
    );
    return data.uuid;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE =
      "We had an error creating the new markdown block";
    let errorMessage = DEFAULT_ERROR_MESSAGE;

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
