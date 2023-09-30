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
      baseURL: "http://localhost:8080/api/v1",
      withCredentials: true
    });
  }

  public static getInstance(): HttpRequester {
    if (!HttpRequester.instance) HttpRequester.instance = new HttpRequester();
    return HttpRequester.instance;
  }
}
