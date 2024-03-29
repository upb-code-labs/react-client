import { CustomError } from "@/components/CustomError";
import { getEnrolledStudentsService } from "@/services/courses/get-enrolled-students.service";
import {
  getSummarizedGradesInLaboratoryService,
  summarizedGradeDTO
} from "@/services/grades/get-summarized-grades-in-laboratory.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { LaboratoryGradesTable } from "./components/LaboratoryGradesTable";
import { LaboratoryGradesViewSkeleton } from "./skeletons/LaboratoryGradesViewSkeleton";

export const LaboratoryGrades = () => {
  // Get the course UUID and laboratory UUID from the URL
  const { courseUUID, laboratoryUUID } = useParams<{
    courseUUID: string;
    laboratoryUUID: string;
  }>();

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

  // Fetch the grades in the laboratory
  const {
    data: summarizedGrades,
    isLoading: isLoadingSummarizedGrades,
    isError: isErrorSummarizedGrades,
    error: errorSummarizedGrades
  } = useQuery({
    queryKey: ["laboratory-summarized-grades", laboratoryUUID],
    queryFn: () => getSummarizedGradesInLaboratoryService(laboratoryUUID!)
  });

  // Join the two datasets
  // TODO: Check why the backend is returning null instead of an empty array
  const summarizedGradesFallback = summarizedGrades?.grades ?? [];
  const studentsGradesMap = summarizedGradesFallback.reduce(
    (acc, curr) => {
      acc[curr.student_uuid] = curr;
      return acc;
    },
    // Initial value
    {} as Record<string, summarizedGradeDTO>
  );

  if (studentsGradesMap) {
    studentsData?.forEach((student) => {
      if (!studentsGradesMap[student.uuid]) {
        studentsGradesMap[student.uuid] = {
          student_uuid: student.uuid,
          student_full_name: student.full_name,
          grade: undefined
        };
      }
    });
  }

  // Handle loading state
  if (isLoadingStudents || isLoadingSummarizedGrades) {
    return <LaboratoryGradesViewSkeleton />;
  }

  // Handle error state
  if (isErrorStudents) {
    // Since the course students are not critical to the page, we can just show a toast
    toast.error(errorStudents.message);
  }

  if (isErrorSummarizedGrades) {
    toast.error(errorSummarizedGrades.message);

    return (
      <div className="col-span-3">
        <CustomError
          message={errorSummarizedGrades.message}
          redirectText="Go back to laboratories"
          redirectTo={`/courses/${courseUUID}/laboratories`}
        />
      </div>
    );
  }

  return (
    <main className="col-span-3">
      <LaboratoryGradesTable
        grades={Object.values(studentsGradesMap)}
        courseUUID={courseUUID!}
        laboratoryUUID={laboratoryUUID!}
      />
    </main>
  );
};
