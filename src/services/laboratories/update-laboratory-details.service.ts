import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type updateLaboratoryDetailsParams = {
  laboratoryUUID: string;
  name: string;
  rubric_uuid: string | null;
  opening_date: string;
  due_date: string;
};

type updateLaboratoryDetailsResponse = GenericResponse;

export const updateLaboratoryDetailsService = async ({
  laboratoryUUID,
  name,
  rubric_uuid,
  opening_date,
  due_date
}: updateLaboratoryDetailsParams): Promise<updateLaboratoryDetailsResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.put(`/laboratories/${laboratoryUUID}`, {
      name,
      rubric_uuid,
      opening_date,
      due_date
    });

    return {
      success: true,
      message: "The laboratory has been updated successfully"
    };
  } catch (error) {
    let errorMessage = "There was an error updating the laboratory";

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
