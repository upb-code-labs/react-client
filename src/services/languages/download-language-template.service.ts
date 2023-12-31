import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

type downloadLanguateTemplateResponse = GenericResponse & {
  template: Blob
};

export const downloadLanguageTemplateService = async (
  languageUUID: string
): Promise<downloadLanguateTemplateResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    const response = await axios.get(`/languages/${languageUUID}/template`, {
      responseType: "blob"
    });
    return {
      success: true,
      message: "Language template was downloaded successfully", 
      template: response.data
    };
  } catch (error) {
    let errorMessage = "There was an error downloading the language template";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return { success: false, message: errorMessage, template: new Blob() };
  }
}