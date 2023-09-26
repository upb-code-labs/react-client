import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

export type registeredAdminDTO = {
  full_name: string;
  created_at: string;
};

type registeredAdminsResponse = GenericResponse & {
  admins: registeredAdminDTO[];
};

export const getRegisteredAdminsService =
  async (): Promise<registeredAdminsResponse> => {
    const { axios } = HttpRequester.getInstance();

    try {
      const { data } = await axios.get("/accounts/admins");
      return {
        success: true,
        message: "Admins were obtained successfully",
        admins: data["admins"]
      };
    } catch (error) {
      let errorMessage = "There was an error";

      if (error instanceof AxiosError) {
        const { message } = error.response?.data || "";
        if (message) errorMessage = message;
      }

      return { success: false, message: errorMessage, admins: [] };
    }
  };
