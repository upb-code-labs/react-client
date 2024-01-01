import { LaboratoryBlockSkeleton } from "../../../components/Skeletons/LaboratoryBlockSkeleton";
import { LaboratoryDetailsSkeleton } from "./LaboratoryDetailsSkeleton";

export const EditLaboratoryPageSkeleton = () => {
  return (
    <div className="col-span-3">
      <LaboratoryDetailsSkeleton />
      <LaboratoryBlockSkeleton />
      <LaboratoryBlockSkeleton />
    </div>
  );
};
