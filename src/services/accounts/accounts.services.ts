import { AxiosError } from "axios";

import { GenericResponse, HttpRequester } from "../axios";

// --- Register student ----
type registerStudentDTO = {
  full_name: string;
  email: string;
  institutional_id: string;
  password: string;
};

export const registerStudentService = async (
  data: registerStudentDTO
): Promise<GenericResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.post("/accounts/students", data);
    return { success: true, message: "Your account has been created!" };
  } catch (error) {
    let errorMessage = "There was an error";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return { success: false, message: errorMessage };
  }
};

// --- Register admin ---
type registerAdminDTO = {
  full_name: string;
  email: string;
  password: string;
};

export const registerAdminService = async (
  data: registerAdminDTO
): Promise<GenericResponse> => {
  const { axios } = HttpRequester.getInstance();

  try {
    await axios.post("/accounts/admins", data);
    return { success: true, message: "The new admin account was created!" };
  } catch (error) {
    let errorMessage = "There was an error";

    if (error instanceof AxiosError) {
      const { message } = error.response?.data || "";
      if (message) errorMessage = message;
    }

    return { success: false, message: errorMessage };
  }
};

// --- Get registered admins ---
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
