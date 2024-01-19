import { CustomError } from "@/components/CustomError";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { getGradeOfStudentInLaboratoryService } from "@/services/grades/get-grade-of-student-in-laboratory.service";
import { getLaboratoryInformationByUUIDService } from "@/services/laboratories/get-laboratory-information-by-uuid.service";
import { getRubricByUUIDService } from "@/services/rubrics/get-rubric-by-uuid.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { GradingRubric } from "./components/grading-rubric/GradingRubric";
import { GradingSidebar } from "./components/grading-sidebar/GradingSidebar";

const handleViewError = (
  error: Error,
  {
    redirectURL,
    redirectText
  }: {
    redirectURL: string;
    redirectText: string;
  }
) => {
  const { message } = error;
  toast.error(message);

  return (
    <div className="col-span-3">
      <CustomError
        message={message}
        redirectText={redirectText}
        redirectTo={redirectURL}
      />
    </div>
  );
};

export const EditStudentGradeView = () => {
  // Get the UUIDs from the URL
  const { courseUUID, laboratoryUUID, studentUUID } = useParams<{
    courseUUID: string;
    laboratoryUUID: string;
    studentUUID: string;
  }>();

  const {
    data: laboratoryInformation,
    isLoading: isLoadingLabInfo,
    isError: isErrorLabInfo,
    error: errorLabInfo
  } = useQuery({
    queryKey: ["laboratory-information", laboratoryUUID],
    queryFn: () => getLaboratoryInformationByUUIDService(laboratoryUUID!)
  });

  const laboratoryRubricUUID = laboratoryInformation?.rubric_uuid;

  const {
    data: studentGrade,
    isLoading: isLoadingStudentGrade,
    isError: isErrorStudentGrade,
    error: errorStudentGrade
  } = useQuery({
    queryKey: ["student-grade", laboratoryUUID, studentUUID],
    queryFn: () =>
      getGradeOfStudentInLaboratoryService({
        laboratoryUUID: laboratoryUUID!,
        rubricUUID: laboratoryRubricUUID!,
        studentUUID: studentUUID!
      }),
    // Fetch the grade after the laboratory information is fetched and only if the laboratory has a rubric
    enabled: !!laboratoryRubricUUID
  });

  const {
    data: rubric,
    isLoading: isLoadingRubric,
    isError: isErrorRubric,
    error: errorRubric
  } = useQuery({
    queryKey: ["rubric", laboratoryRubricUUID],
    queryFn: () => getRubricByUUIDService(laboratoryRubricUUID!),
    // Fetch the rubric after the laboratory information is fetched and only if the laboratory has a rubric
    enabled: !!laboratoryRubricUUID
  });

  // Handle error state
  if (isErrorLabInfo) {
    return handleViewError(errorLabInfo, {
      redirectURL: `/courses/${courseUUID}/laboratories/${laboratoryUUID}/grades`,
      redirectText: "Go back to grades"
    });
  }

  if (isErrorStudentGrade) {
    return handleViewError(errorStudentGrade, {
      redirectURL: `/courses/${courseUUID}/laboratories/${laboratoryUUID}/grades`,
      redirectText: "Go back to grades"
    });
  }

  if (isErrorRubric) {
    return handleViewError(errorRubric, {
      redirectURL: `/courses/${courseUUID}/laboratories/${laboratoryUUID}/grades`,
      redirectText: "Go back to grades"
    });
  }

  // If the rubric is not loading but is undefined, return an error
  if (!rubric) {
    // TODO: Replace with a custom component
    return (
      <p>Please create a rubric for this laboratory before grading students.</p>
    );
  }

  // If the student grade is not loading but is undefined, return an error
  if (!studentGrade) {
    return handleViewError(
      new Error("We had an error loading the student grade"),
      {
        redirectURL: `/courses/${courseUUID}/laboratories/${laboratoryUUID}/grades`,
        redirectText: "Go back to grades"
      }
    );
  }

  // Map the selected criteria to their objectives
  const selectedCriteriaByObjectiveMap: Record<string, string | null> =
    studentGrade.selected_criteria.reduce(
      (acc, criteria) => {
        acc[criteria.objective_uuid] = criteria.criteria_uuid;
        return acc;
      },
      {} as Record<string, string | null>
    );

  return (
    <main className="col-span-3 flex gap-4">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={65} className="md:pr-4">
          <GradingRubric
            rubric={rubric}
            isLoading={isLoadingLabInfo || isLoadingRubric}
            studentUUID={studentUUID!}
            laboratoryUUID={laboratoryUUID!}
            selectedCriteriaByObjective={selectedCriteriaByObjectiveMap}
          />
        </ResizablePanel>
        <ResizableHandle withHandle={true} />
        <ResizablePanel defaultSize={35} maxSize={35}>
          <GradingSidebar
            laboratoryUUID={laboratoryUUID!}
            studentUUID={studentUUID!}
            studentGrade={studentGrade}
            isLoading={isLoadingLabInfo || isLoadingStudentGrade}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
};
