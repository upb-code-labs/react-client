import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

interface swapBlocksIndexServiceArguments {
  first_block_uuid: string;
  second_block_uuid: string;
}

export async function swapBlocksIndexService(
  args: swapBlocksIndexServiceArguments
): Promise<void> {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.patch(`/blocks/swap_index`, args);
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We couldn't swap the index of the blocks";
    let errorMessage = DEFAULT_ERROR_MESSAGE;

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    throw new Error(errorMessage);
  }
}
