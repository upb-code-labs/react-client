export type submissionStatus = "pending" | "running" | "ready";

export type submissionUpdate = {
  submissionUUID: string;
  submissionStatus: submissionStatus;
  testsPassed: boolean;
  testsOutput: string;
};
