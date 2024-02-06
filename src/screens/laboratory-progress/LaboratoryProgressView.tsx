import { CustomError } from "@/components/CustomError";
import { getEnrolledStudentsService } from "@/services/courses/get-enrolled-students.service";
import { getStudentsProgressInLaboratory } from "@/services/laboratories/get-students-progress.service";
import { StudentProgress } from "@/types/entities/laboratory-entities";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { LaboratoryProgressDashboard } from "./components/LaboratoryProgressDashboard";
import { LaboratoryProgressDashboardSkeleton } from "./skeletons/LaboratoryProgressDashboardSkeleton";

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
    queryKey: ["laboratory-progress", laboratoryUUID],
    queryFn: () => getStudentsProgressInLaboratory(laboratoryUUID!)
  });

  // Fetch the list of students in the course
  const {
    data: studentsData,
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
    error: errorStudents
  } = useQuery({
    queryKey: ["course-students", courseUUID],
    queryFn: () => getEnrolledStudentsService(courseUUID!)
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

    return (
      <div className="col-span-3">
        <CustomError
          message={errorProgress.message}
          redirectText="Go back to laboratories"
          redirectTo={`/courses/${courseUUID}/laboratories`}
        />
      </div>
    );
  }

  // If its not loading but the progress data is undefined, return an error
  if (!progressData || !studentsProgressMap) {
    return (
      <div className="col-span-3">
        <CustomError
          message="We couldn't get the progress of the students."
          redirectText="Go back to laboratories"
          redirectTo={`/courses/${courseUUID}/laboratories`}
        />
      </div>
    );
  }

  return (
    <main className="col-span-3">
      <LaboratoryProgressDashboard
        totalTestBlocks={progressData.total_test_blocks}
        studentsProgress={Object.values(studentsProgressMap)}
      />
    </main>
  );
};
