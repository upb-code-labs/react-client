import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

type updateLaboratoryDetailsParams = {
  laboratoryUUID: string;
  name: string;
  rubric_uuid: string | null;
  opening_date: string;
  due_date: string;
};

export async function updateLaboratoryDetailsService({
  laboratoryUUID,
  name,
  opening_date,
  due_date,
  rubric_uuid
}: updateLaboratoryDetailsParams): Promise<void> {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.put(`/laboratories/${laboratoryUUID}`, {
      name,
      rubric_uuid,
      opening_date,
      due_date
    });
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "We had an error updating the laboratory";
    let errorMessage = DEFAULT_ERROR_MESSAGE;

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
