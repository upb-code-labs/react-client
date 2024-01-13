import { Language } from "@/types/entities/general-entities";
import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type createMarkdownBlockResponse = GenericResponse & {
  languages: Language[];
};

// TODO: Refactor to be compatible with TanStack Query
export const getSupportedLanguagesService =
  async (): Promise<createMarkdownBlockResponse> => {
    const { axios } = HttpRequester.getInstance();

    try {
      const { data } = await axios.get("/languages");
      return {
        success: true,
        message: "Languages were obtained successfully",
        languages: data["languages"]
      };
    } catch (error) {
      let errorMessage = "There was an error obtaining the languages";

      if (error instanceof AxiosError) {
        const { message } = error.response?.data || "";
        if (message) errorMessage = message;
      }

      return { success: false, message: errorMessage, languages: [] };
    }
  };
