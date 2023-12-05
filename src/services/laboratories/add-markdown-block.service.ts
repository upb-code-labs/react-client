import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type createMarkdownBlockResponse = GenericResponse & {
  uuid: string;
};

export const createMarkdownBlockService = async (
  laboratoryUUID: string
): Promise<createMarkdownBlockResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.post(
      `/laboratories/markdown_blocks/${laboratoryUUID}`
    );

    return {
      success: true,
      message: "The new markdown block has been created successfully",
      uuid: data.uuid
    };
  } catch (error) {
    let errorMessage = "There was an error creating the new markdown block";

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
