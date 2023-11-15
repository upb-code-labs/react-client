import { ObjectiveRow } from "@/components/Rubric/ObjectiveRow";
import { RubricName } from "@/components/Rubric/RubricName";
import { RubricSkeleton } from "@/components/Skeletons/RubricSkeleton";
import { getRubricByUuidService } from "@/services/rubrics/get-rubric-by-uuid.service";
import { useEditRubricStore } from "@/stores/edit-rubric-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { AddObjectiveDialog } from "./dialogs/add-objective/AddObjectiveDialog";

export const EditRubricView = () => {
  // Get rubric UUID from URL
  const id = useParams<{ id: string }>().id as string;

  // Rubric global state
  const { rubric, setRubric } = useEditRubricStore();

  // Query rubric data
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["rubric", id],
    queryFn: () => getRubricByUuidService(id),
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    // Set rubric global state when the rubric is fetched
    if (data) setRubric(data);
  }, [data]);

  const handleError = (message: string) => {
    toast.error(message);
    return <Navigate to="/rubrics" />;
  };

  if (isLoading) return <RubricSkeleton />;

  if (isError) return handleError(error.message);

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
