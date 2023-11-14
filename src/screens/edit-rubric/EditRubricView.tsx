import { ObjectiveRow } from "@/components/Rubric/ObjectiveRow";
import { RubricName } from "@/components/Rubric/RubricName";
import { RubricSkeleton } from "@/components/Skeletons/RubricSkeleton";
import { getRubricByUuidService } from "@/services/rubrics/get-rubric-by-uuid.service";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { AddObjectiveDialog } from "./dialogs/add-objective/AddObjectiveDialog";

export const EditRubricView = () => {
  const id = useParams<{ id: string }>().id as string;

  const {
    isLoading,
    isError,
    error,
    data: rubric
  } = useQuery({
    queryKey: ["rubric", id],
    queryFn: () => getRubricByUuidService(id),
    refetchOnWindowFocus: false
  });

  const handleError = (message: string) => {
    toast.error(message);
    return <Navigate to="/rubrics" />;
  };

  if (isLoading) return <RubricSkeleton />;

  if (isError) return handleError(error.message);

  if (!rubric) return handleError("Not valid rubric was found");

  return (
    <main className="mx-auto max-w-7xl space-y-4 p-4">
      <RubricName rubricName={rubric.name} rubricUUID={rubric.uuid} />

      {rubric.objectives.map((objective, oi) => (
        <ObjectiveRow objective={objective} index={oi} />
      ))}

      <AddObjectiveDialog rubricUUID={rubric.uuid} />
    </main>
  );
};
