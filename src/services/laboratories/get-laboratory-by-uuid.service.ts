import { Laboratory } from "@/types/entities/laboratory";
import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type getLaboratoryByUUIDResponse = GenericResponse & {
  laboratory: Laboratory | null;
};

export const getLaboratoryByUUIDService = async (
  laboratoryUUID: string
): Promise<getLaboratoryByUUIDResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(`/laboratories/${laboratoryUUID}`);

    // Parse data
    const laboratory: Laboratory = {
      uuid: data.uuid,
      name: data.name,
      opening_date: data.opening_date,
      due_date: data.due_date,
      rubricUUID: data.rubric_uuid,
      blocks: [...data.markdown_blocks, ...data.test_blocks]
    };

    // Sort blocks by index
    laboratory.blocks.sort((a, b) => a.index - b.index);

    return {
      success: true,
      message: "Laboratory data has been fetched successfully",
      laboratory
    };
  } catch (error) {
    let errorMessage = "There was an error";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return {
      success: false,
      message: errorMessage,
      laboratory: null
    };
  }
};
