import { CONSTANTS } from "@/config/constants";

import { GenericResponse } from "../axios";

type getSubmissionRealTimeStatusRespose = GenericResponse & {
  eventSource?: EventSource;
};

export async function getSubmissionRealTimeStatusService(
  testBlockUUID: string
): Promise<getSubmissionRealTimeStatusRespose> {
  try {
    // Create the event source
    const eventSource = new EventSource(
      `${CONSTANTS.API_BASE_URL}/submissions/${testBlockUUID}/status`,
      { withCredentials: true }
    );

    return {
      success: true,
      message: "Listening for real time status updates",
      eventSource
    };
  } catch {
    return {
      success: false,
      message: "Unable to listen for real time status updates"
    };
  }
}
