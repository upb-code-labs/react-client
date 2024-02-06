import { GenericTableSkeleton } from "@/components/Skeletons/GenericTableSkeleton";

export const LaboratoryGradesViewSkeleton = () => {
  return (
    <div className="col-span-3">
      <GenericTableSkeleton
        headers={["Student name", "Grade", "Actions"]}
        columns={3}
        rows={4}
      />
    </div>
  );
};
