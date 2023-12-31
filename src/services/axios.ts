import { CONSTANTS } from "@/config/constants";
import axios, { AxiosInstance } from "axios";

export type GenericResponse = {
  success: boolean;
  message: string;
};

export class HttpRequester {
  private static instance: HttpRequester;
  public axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: CONSTANTS.API_BASE_URL,
      withCredentials: true
    });
  }

  public static getInstance(): HttpRequester {
    if (!HttpRequester.instance) HttpRequester.instance = new HttpRequester();
    return HttpRequester.instance;
  }
}
