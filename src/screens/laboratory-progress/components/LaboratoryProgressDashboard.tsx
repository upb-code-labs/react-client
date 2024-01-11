import { StudentProgress } from "@/types/entities/laboratory-entities";

import { StackedStudentsProgressChart } from "./StackedStudentsProgressChart";

interface LaboratoryProgressDashboardProps {
  totalTestBlocks: number;
  studentsProgress: StudentProgress[];
}

export type submissionsChartsStatus =
  | "pending"
  | "running"
  | "failing"
  | "success";

export const LaboratoryProgressDashboard = ({
  totalTestBlocks,
  studentsProgress
}: LaboratoryProgressDashboardProps) => {
  // Group the submissions by status to avoid repeating the same process on each chart
  const submissionsGroupedByStatus: {
    [key in submissionsChartsStatus]: number[];
  } = studentsProgress.reduce(
    (acc, curr) => {
      acc.pending.push(curr.pending_submissions);
      acc.running.push(curr.running_submissions);
      acc.failing.push(curr.failing_submissions);
      acc.success.push(curr.success_submissions);
      return acc;
    },
    {
      pending: new Array<number>(),
      running: new Array<number>(),
      failing: new Array<number>(),
      success: new Array<number>()
    }
  );

  return (
    <section className="rounded-md border p-4">
      <StackedStudentsProgressChart
        studentsProgress={studentsProgress}
        submissionsGroupedByStatus={submissionsGroupedByStatus}
      />
    </section>
  );
};
