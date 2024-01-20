import { getSubmissionRealTimeStatusService } from "@/services/submissions/get-submission-real-time-status.service";
import { TestBlock } from "@/types/entities/laboratory-entities";
import {
  submissionStatus,
  submissionUpdate
} from "@/types/entities/submission-entities";
import { parseSubmissionSSEUpdate } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { TestStatusPhase } from "./TestStatusPhase";

interface TestStatusProps {
  blockIndex: number;
  testBlock: TestBlock;
  changeToFormTabCallback: () => void;
}

const status: submissionStatus[] = ["pending", "running", "ready"];

const initialStatusUpdate: submissionUpdate = {
  submissionStatus: "pending",
  testsPassed: false,
  submissionUUID: "",
  testsOutput: ""
};

export const TestStatus = ({
  testBlock,
  changeToFormTabCallback
}: TestStatusProps) => {
  // Submission status state
  const [currentStatusUpdate, setCurrentStatusUpdate] =
    useState<submissionUpdate>(initialStatusUpdate);

  const currentStatusIndex = status.indexOf(
    currentStatusUpdate.submissionStatus
  );

  // Event source ref
  const eventSourceRef = useRef<EventSource | null>(null);

  // Get the test status on component mount
  useEffect(() => {
    const getRealTimeTestStatus = async () => {
      const { success, eventSource } = await getSubmissionRealTimeStatusService(
        testBlock.uuid
      );

      if (!success || !eventSource) {
        handleEventSourceError();
        return;
      }

      // Listen for errors
      eventSource.onerror = () => {
        handleEventSourceError(
          "We had an error, please, make sure you have sent a submission"
        );
      };

      // Listen for incoming updates
      const CUSTOM_EVENT_NAME = "update";
      eventSource.addEventListener(CUSTOM_EVENT_NAME, (event) => {
        const update = parseSubmissionSSEUpdate(event.data);

        // If the submission is ready, set the test output and close the event source
        if (update.submissionStatus === "ready") {
          eventSourceRef.current?.OPEN && eventSourceRef.current?.close();
        }

        // Update the state
        setCurrentStatusUpdate(update);
      });

      // Set the event source
      eventSourceRef.current = eventSource;
    };

    getRealTimeTestStatus();

    // Unsubscribe from the event source on component unmount
    return () => {
      eventSourceRef.current?.OPEN && eventSourceRef.current.close();
    };
  }, []);

  const handleEventSourceError = (
    errorMessage: string = "We had an error while obtaining the current status of your submission"
  ) => {
    toast.error(errorMessage);
    changeToFormTabCallback();
    eventSourceRef.current?.OPEN && eventSourceRef.current?.close();
  };

  return (
    <ol className="grid gap-4" data-test-block-index={testBlock.index}>
      {status.map((phase, index) => {
        return (
          <li
            key={`${testBlock.uuid}-status-${index}`}
            className="rounded-md p-2 hover:bg-gray-100"
          >
            <TestStatusPhase
              phaseName={phase}
              phaseIndex={index}
              currentPhase={currentStatusUpdate}
              currentPhaseIndex={currentStatusIndex}
            />
          </li>
        );
      })}
    </ol>
  );
};
