import { laboratoryInformation } from "@/types/entities/laboratory-entities";
import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

export async function getLaboratoryInformationByUUIDService(
  laboratoryUUID: string
): Promise<laboratoryInformation> {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.get(
      `/laboratories/${laboratoryUUID}/information`
    );

    return data;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We couldn't get the laboratory information";

    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
