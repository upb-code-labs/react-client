import { getEnrolledStudentsNewService } from "@/services/courses/get-enrolled-students.service";
import { getStudentsProgressInLaboratory } from "@/services/laboratories/get-students-progress.service";
import { StudentProgress } from "@/types/entities/laboratory-entities";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { LaboratoryProgressDashboard } from "./components/LaboratoryProgressDashboard";

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
    isError: isErrorProgress,
    isFetching: isFetchingProgress
  } = useQuery({
    queryKey: [`laboratory-${laboratoryUUID}-progress`],
    queryFn: () => getStudentsProgressInLaboratory(laboratoryUUID!)
  });

  console.log({
    isErrorProgress,
    isFetchingProgress
  });

  // Fetch the list of students in the course
  const {
    data: studentsData,
    isError: isErrorStudents,
    isFetching: isFetchingStudents
  } = useQuery({
    queryKey: [`course-${courseUUID}-students`],
    queryFn: () => getEnrolledStudentsNewService(courseUUID!)
  });

  console.log(progressData?.students_progress);

  console.log({
    isErrorStudents,
    isFetchingStudents
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

  console.log(studentsProgressMap);

  if (!progressData || !studentsProgressMap) return null;

  return (
    <main className="col-span-3">
      <LaboratoryProgressDashboard
        totalTestBlocks={progressData!.total_test_blocks}
        studentsProgress={Object.values(studentsProgressMap!)}
      />
    </main>
  );
};
