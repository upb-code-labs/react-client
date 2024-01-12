import { AxiosError } from "axios";

import { HttpRequester } from "../axios";

interface createLaboratoryServiceParams {
  courseUUID: string;
  name: string;
  openingDate: string;
  dueDate: string;
}

export async function createLaboratoryService({
  courseUUID,
  name,
  openingDate,
  dueDate
}: createLaboratoryServiceParams): Promise<string> {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.post("/laboratories", {
      course_uuid: courseUUID,
      name: name,
      opening_date: openingDate,
      due_date: dueDate
    });

    return data.uuid;
  } catch (error) {
    const DEFAULT_ERROR_MESSAGE = "There was an error creating the laboratory";

    // Try to get the error from the response
    let errorMessage = DEFAULT_ERROR_MESSAGE;
    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      errorMessage = message || DEFAULT_ERROR_MESSAGE;
    }

    throw new Error(errorMessage);
  }
}
