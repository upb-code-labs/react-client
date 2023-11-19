import { ObjectiveRow } from "@/components/Rubric/ObjectiveRow";
import { RubricName } from "@/components/Rubric/RubricName";
import { RubricSkeleton } from "@/components/Skeletons/RubricSkeleton";
import { getRubricByUuidService } from "@/services/rubrics/get-rubric-by-uuid.service";
import { useEditRubricStore } from "@/stores/edit-rubric-store";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DeleteCriteriaDialog } from "./dialogs/DeleteCriteriaDialog";
import { AddObjectiveDialog } from "./dialogs/add-objective/AddObjectiveDialog";

export const EditRubricView = () => {
  // Get rubric UUID from URL
  const id = useParams<{ id: string }>().id as string;

  // Rubric global state
  const { rubric, setRubric, resetRubric } = useEditRubricStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRubric = async () => {
      resetRubric();
      setLoading(true);

      const { success, message, rubric } = await getRubricByUuidService(id);
      if (!success) {
        handleError(message);
        return;
      }

      setRubric(rubric);
      setLoading(false);
    };

    fetchRubric();
  }, []);

  const handleError = (message: string) => {
    toast.error(message);
    return <Navigate to="/rubrics" />;
  };

  if (loading) return <RubricSkeleton />;

  if (!rubric?.uuid) return null;

  return (
    <main className="mx-auto max-w-7xl space-y-4 p-4">
      <RubricName />
      {rubric.objectives?.map((objective, oi) => (
        <ObjectiveRow key={objective.uuid} objective={objective} index={oi} />
      ))}
      <AddObjectiveDialog />
      <DeleteCriteriaDialog />
    </main>
  );
};
