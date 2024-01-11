import { StudentProgress } from "@/types/entities/laboratory-entities";

import { StackedStudentsProgressChart } from "./StackedStudentsProgressChart";

interface LaboratoryProgressDashboardProps {
  totalTestBlocks: number;
  studentsProgress: StudentProgress[];
}

export const LaboratoryProgressDashboard = ({
  totalTestBlocks,
  studentsProgress
}: LaboratoryProgressDashboardProps) => {
  return (
    <section className="rounded-md border p-4">
      <StackedStudentsProgressChart studentsProgress={studentsProgress} />
    </section>
  );
};
