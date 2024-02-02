import { CustomError } from "@/components/CustomError";
import { EmptyContentText } from "@/components/EmptyContentText";
import { StudentSubmissionsSkeleton } from "@/screens/edit-student-grade/skeletons/StudentSubmissionsSkeleton";
import { getProgressOfStudentService } from "@/services/laboratories/ger-progress-of-student.service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { SubmissionSummaryCard } from "./SubmissionSummaryCard";

interface gradingSubmissionsSummaryProps {
  laboratoryUUID: string;
  studentUUID: string;
}

function handleError(
  error: Error,
  titleContent: string = "We had an error loading the submissions summary"
): JSX.Element {
  toast.error(error.message);

  return (
    <CustomError
      message={error.message}
      title={titleContent}
      showFooter={false}
    />
  );
}

export const GradingSubmissionsSummary = ({
  laboratoryUUID,
  studentUUID
}: gradingSubmissionsSummaryProps) => {
  const {
    data: studentSubmissionsSummary,
    isLoading: isLoadingSubmissionsSummary,
    isError: isErrorSubmissionsSummary,
    error: errorSubmissionsSummary
  } = useQuery({
    queryKey: ["student-submissions-summary", laboratoryUUID, studentUUID],
    queryFn: () => getProgressOfStudentService({ laboratoryUUID, studentUUID })
  });

  // Handle loading state
  if (isLoadingSubmissionsSummary) {
    return <StudentSubmissionsSkeleton />;
  }

  // Handle error state
  if (isErrorSubmissionsSummary) {
    return handleError(errorSubmissionsSummary);
  }

  // Return an error if the data is not loading but is undefined
  if (!studentSubmissionsSummary) {
    return handleError(
      new Error("We had an error loading the submissions summary")
    );
  }

  const { submissions, total_test_blocks } = studentSubmissionsSummary;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">Student submissions</h2>
      <p className="text-pretty">
        The student has submitted to {submissions.length} out of{" "}
        {total_test_blocks} test blocks:
      </p>
      {submissions.length ? (
        <ul className="flex flex-col gap-4">
          {submissions.map((submission) => (
            <li key={`${submission.uuid}-submission-summary`}>
              <SubmissionSummaryCard summarizedSubmission={submission} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-md border p-4">
          <EmptyContentText
            text="There are no submissions to display for this student"
            className="text-center text-base"
          />
        </div>
      )}
    </div>
  );
};
