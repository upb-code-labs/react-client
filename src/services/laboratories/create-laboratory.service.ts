import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type createLaboratoryResponse = GenericResponse & {
  laboratoryUUID: string;
};

interface createLaboratoryServiceParams {
  courseUUID: string;
  name: string;
  openingDate: string;
  dueDate: string;
}

export const createLaboratoryService = async ({
  courseUUID,
  name,
  openingDate,
  dueDate
}: createLaboratoryServiceParams): Promise<createLaboratoryResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const { data } = await axios.post("/laboratories", {
      course_uuid: courseUUID,
      name: name,
      opening_date: openingDate,
      due_date: dueDate
    });

    return {
      success: true,
      message: "Laboratory was created successfully",
      laboratoryUUID: data.uuid
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
      laboratoryUUID: ""
    };
  }
};
