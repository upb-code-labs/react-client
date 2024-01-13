import { CustomError } from "@/components/CustomError";
import { getRubricByUUIDService } from "@/services/rubrics/get-rubric-by-uuid.service";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { lazily } from "react-lazily";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { DeleteCriteriaDialog } from "./dialogs/DeleteCriteriaDialog";
import { DeleteObjectiveDialog } from "./dialogs/DeleteObjectiveDialog";
import { AddObjectiveDialog } from "./dialogs/add-objective/AddObjectiveDialog";
import { RubricNameSkeleton } from "./skeletons/RubricNameSkeleton";
import { RubricSkeleton } from "./skeletons/RubricSkeleton";

const { RubricName } = lazily(() => import("./components/RubricName"));

const { ObjectiveRow } = lazily(() => import("./components/ObjectiveRow"));

export const EditRubricView = () => {
  // Get rubric UUID from URL
  const id = useParams<{ rubricUUID: string }>().rubricUUID as string;

  // Data fetching state
  const {
    data: rubric,
    isLoading: isLoadingRubric,
    isError: isRubricError,
    error: rubricError
  } = useQuery({
    queryKey: ["rubric", id],
    queryFn: () => getRubricByUUIDService(id)
  });

  if (isRubricError) {
    toast.error(rubricError.message);

    return (
      <div className="p-4">
        <CustomError
          message={rubricError.message}
          redirectText="Go back to rubrics."
          redirectTo="/rubrics"
        />
      </div>
    );
  }

  if (isLoadingRubric) {
    return <RubricSkeleton />;
  }

  if (!rubric) {
    return (
      <div className="p-4">
        <CustomError
          message="We couldn't get the rubric you are looking for."
          redirectText="Go back to rubrics."
          redirectTo="/rubrics"
        />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-4 p-4">
      <Suspense fallback={<RubricNameSkeleton />}>
        <RubricName rubric={rubric} />
      </Suspense>
      {rubric.objectives?.map((objective, oi) => (
        <Suspense key={`${objective.uuid}-skeleton`}>
          <ObjectiveRow
            key={objective.uuid}
            rubricUUID={id}
            objective={objective}
            objectiveIndex={oi}
          />
        </Suspense>
      ))}
      <AddObjectiveDialog rubricUUID={id} />
      <DeleteCriteriaDialog rubricUUID={id} />
      <DeleteObjectiveDialog rubricUUID={id} />
    </main>
  );
};
