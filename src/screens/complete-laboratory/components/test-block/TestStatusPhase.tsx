import {
  submissionStatus,
  submissionUpdate
} from "@/types/entities/submission-entitines";
import { CheckIcon, HourglassIcon, Loader2Icon, XIcon } from "lucide-react";
import { ReactElement } from "react";

interface TestStatusPhaseProps {
  phaseName: submissionStatus;
  phaseIndex: number;
  currentPhase: submissionUpdate;
  currentPhaseIndex: number;
}

const DEFAULT_SUCCESS_COLOR_CLASS = "bg-green-500";
const DEFAULT_ERROR_COLOR_CLASS = "bg-red-500";
const DEFAULT_PENDING_COLOR_CLASS = "bg-gray-400";

export const TestStatusPhase = ({
  phaseName,
  phaseIndex,
  currentPhase,
  currentPhaseIndex
}: TestStatusPhaseProps) => {
  const wasCurrentStatusPassed = phaseIndex < currentPhaseIndex;
  const wasCurrentStatusReached = phaseIndex <= currentPhaseIndex;

  const isRunningNow = currentPhase.submissionStatus === "running";
  const wasRan = currentPhase.submissionStatus === "ready";
  const mayShowTestOutput = wasRan && phaseName === "ready";

  const getPhaseIconColorClasses = (): string => {
    if (wasCurrentStatusPassed) {
      return DEFAULT_SUCCESS_COLOR_CLASS;
    } else {
      if (phaseName === "ready" && wasRan) {
        // If the final status was reached, check if the tests passed
        const hasFinishedSuccessfully = currentPhase.testsPassed;

        return hasFinishedSuccessfully
          ? DEFAULT_SUCCESS_COLOR_CLASS
          : DEFAULT_ERROR_COLOR_CLASS;
      }

      // If the final status was not reached, return the default color
      return DEFAULT_PENDING_COLOR_CLASS;
    }
  };

  const getPhaseIcon = (): ReactElement => {
    const icons = {
      pending: <HourglassIcon size={16} />,
      running: <Loader2Icon className="animate-spin" size={16} />,
      ["ready-success"]: <CheckIcon size={16} />,
      ["ready-error"]: <XIcon size={16} />
    };

    let iconKey: keyof typeof icons;

    if (phaseName === "ready" && wasRan) {
      const hasFinishedSuccessfully = currentPhase.testsPassed;
      iconKey = hasFinishedSuccessfully ? "ready-success" : "ready-error";
    } else if (phaseName === "running" && isRunningNow) {
      iconKey = "running";
    } else if (wasCurrentStatusPassed) {
      iconKey = "ready-success";
    } else {
      iconKey = "pending";
    }

    return icons[iconKey];
  };

  return (
    <li className="grid gap-4 rounded-md  p-2 hover:bg-gray-100">
      {/* Status header */}
      <div className="flex items-center gap-2">
        <div
          className={`grid h-6 w-6 place-content-center rounded-full text-white ${getPhaseIconColorClasses()}`}
        >
          {getPhaseIcon()}
        </div>
        <span
          className={`capitalize ${
            !wasCurrentStatusReached && "text-gray-400"
          }`}
        >
          {phaseName}
        </span>
      </div>
      {/* Status content */}
      {mayShowTestOutput && (
        <div className="max-w-[calc(100vw-6rem)] md:max-w-full">
          <pre className="max-h-72 overflow-y-auto whitespace-pre-wrap text-wrap break-words font-ibmPlexMono leading-relaxed">
            {currentPhase.testsOutput}
          </pre>
        </div>
      )}
    </li>
  );
};
