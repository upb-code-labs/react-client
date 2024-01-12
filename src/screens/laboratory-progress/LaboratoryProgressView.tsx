import { getEnrolledStudentsNewService } from "@/services/courses/get-enrolled-students.service";
import { getStudentsProgressInLaboratory } from "@/services/laboratories/get-students-progress.service";
import { StudentProgress } from "@/types/entities/laboratory-entities";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { lazily } from "react-lazily";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { LaboratoryProgressDashboardSkeleton } from "./skeletons/LaboratoryProgressDashboardSkeleton";

const { LaboratoryProgressDashboard } = lazily(
  () => import("./components/LaboratoryProgressDashboard")
);

const defaultSubmissionProgress = {
  pending_submissions: 0,
  running_submissions: 0,
  failing_submissions: 0,
  success_submissions: 0
};

export const LaboratoryProgressView = () => {
  // Get the course UUID and laboratory UUID from the URL
  const { courseUUID, laboratoryUUID } = useParams<{
    courseUUID: string;
    laboratoryUUID: string;
  }>();

  // Fetch the progress of students that have submitted to the lab
  const {
    data: progressData,
    isLoading: isLoadingProgress,
    isError: isErrorProgress,
    error: errorProgress
  } = useQuery({
    queryKey: [`laboratory-${laboratoryUUID}-progress`],
    queryFn: () => getStudentsProgressInLaboratory(laboratoryUUID!)
  });

  // Fetch the list of students in the course
  const {
    data: studentsData,
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
    error: errorStudents
  } = useQuery({
    queryKey: [`course-${courseUUID}-students`],
    queryFn: () => getEnrolledStudentsNewService(courseUUID!)
  });

  // Join the two data sets
  const studentsProgressMap = progressData?.students_progress.reduce(
    // Reducer function
    (acc, curr) => {
      acc[curr.student_uuid] = curr;
      return acc;
    },
    // Initial value
    {} as Record<string, StudentProgress>
  );

  if (studentsProgressMap) {
    studentsData?.forEach((student) => {
      if (!studentsProgressMap[student.uuid]) {
        studentsProgressMap[student.uuid] = {
          student_uuid: student.uuid,
          student_full_name: student.full_name,
          ...defaultSubmissionProgress
        };
      }
    });
  }

  // If the data is being fetched, show the skeleton
  if (isLoadingProgress || isLoadingStudents) {
    return <LaboratoryProgressDashboardSkeleton />;
  }

  // If there was an error fetching the data, show an error message
  if (isErrorStudents) {
    // Since the course students are not critical to the page, we can just show a toast
    toast.error(errorStudents.message);
  }

  if (isErrorProgress) {
    toast.error(errorProgress.message);
    return <Navigate to={`/courses/${courseUUID}/laboratories`} />;
  }

  if (!progressData || !studentsProgressMap) return null;

  return (
    <main className="col-span-3">
      <Suspense fallback={<LaboratoryProgressDashboardSkeleton />}>
        <LaboratoryProgressDashboard
          totalTestBlocks={progressData!.total_test_blocks}
          studentsProgress={Object.values(studentsProgressMap!)}
        />
      </Suspense>
    </main>
  );
};
