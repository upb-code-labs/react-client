import { LaboratoryDetails } from "@/components/EditLaboratory/LaboratoryDetails";
import { Separator } from "@/components/ui/separator";
import { EditLaboratoryContext } from "@/context/laboratories/EditLaboratoryContext";
import { useContext } from "react";

export const EditLaboratory = () => {
  const { loading, laboratoryState } = useContext(EditLaboratoryContext);
  const { laboratory } = laboratoryState;

  // TODO: Add loading skeleton
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!laboratory) return null;

  return (
    <main className="col-span-3">
      <LaboratoryDetails
        laboratoryDetails={{
          ...laboratory
        }}
      />
      <Separator className="my-8" />
    </main>
  );
};
