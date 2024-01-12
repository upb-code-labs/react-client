import { LaboratoryDoughnutChartSkeleton } from "./LaboratoryDoughnutChartSkeleton";
import { StackedStudentsProgressSkeleton } from "./StackedStudentsProgressSkeleton";

export const LaboratoryProgressDashboardSkeleton = () => {
  return (
    <div className="col-span-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <div className="rounded-md border p-4">
            <StackedStudentsProgressSkeleton />
          </div>
        </div>
        <div className="rounded-md border p-4">
          <LaboratoryDoughnutChartSkeleton />
        </div>
        <div className="rounded-md border p-4">
          <LaboratoryDoughnutChartSkeleton />
        </div>
      </div>
    </div>
  );
};
