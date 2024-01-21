import { CustomError } from "@/components/CustomError";
import { AuthContext } from "@/context/AuthContext";
import { getGradeOfStudentInLaboratoryService } from "@/services/grades/get-grade-of-student-in-laboratory.service";
import { getLaboratoryInformationByUUIDService } from "@/services/laboratories/get-laboratory-information-by-uuid.service";
import { getRubricByUUIDService } from "@/services/rubrics/get-rubric-by-uuid.service";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { MyGradeLayoutSkeleton } from "./skeletons/MyGradeLayoutSkeleton";

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

export const MyGradeView = () => {
  // Get the student UUID from the global session
  const { user } = useContext(AuthContext);
  const studentUUID = user!.uuid;

  // Get the UUIDs from the URL
  const { courseUUID, laboratoryUUID } = useParams<{
    courseUUID: string;
    laboratoryUUID: string;
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
      redirectURL: `/courses/${courseUUID}/laboratories`,
      redirectText: "Go back laboratories"
    });
  }

  if (isErrorStudentGrade) {
    return handleViewError(errorStudentGrade, {
      redirectURL: `/courses/${courseUUID}/laboratories`,
      redirectText: "Go back laboratories"
    });
  }

  if (isErrorRubric) {
    return handleViewError(errorRubric, {
      redirectURL: `/courses/${courseUUID}/laboratories`,
      redirectText: "Go back laboratories"
    });
  }

  // Handle loading state
  const isLoading =
    isLoadingLabInfo || isLoadingStudentGrade || isLoadingRubric;

  if (isLoading) {
    return <MyGradeLayoutSkeleton />;
  }

  return (
    <div>
      <div>
        <pre>{JSON.stringify(laboratoryInformation, null, 2)}</pre>
      </div>
      <div>
        <pre>{JSON.stringify(studentGrade, null, 2)}</pre>
      </div>
      <div>
        <pre>{JSON.stringify(rubric, null, 2)}</pre>
      </div>
    </div>
  );
};
