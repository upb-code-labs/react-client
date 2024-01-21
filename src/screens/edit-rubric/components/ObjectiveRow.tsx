import { AddCriteriaDialog } from "@/screens/edit-rubric/dialogs/add-criteria/AddCriteriaDialog";
import { Objective } from "@/types/entities/rubric-entities";

import { CriteriaCard } from "./CriteriaCard/CriteriaCard";
import { ObjectiveCard } from "./ObjectiveCard/ObjectiveCard";

interface ObjectiveRowProps {
  rubricUUID: string;
  objective: Objective;
  objectiveIndex: number;
}

export const ObjectiveRow = ({
  rubricUUID,
  objective,
  objectiveIndex
}: ObjectiveRowProps) => {
  return (
    <div
      key={`objective-row-${objective.uuid}`}
      className="flex gap-4 overflow-x-auto pb-4"
    >
      <ObjectiveCard
        rubricUUID={rubricUUID}
        objective={objective}
        objectiveIndex={objectiveIndex}
      />

      {objective.criteria.map((criteria, ci) => (
        <CriteriaCard
          rubricUUID={rubricUUID}
          key={criteria.uuid}
          criteria={criteria}
          criteriaIndex={ci}
          objectiveIndex={objectiveIndex}
        />
      ))}

      <AddCriteriaDialog
        rubricUUID={rubricUUID}
        objectiveUUID={objective.uuid}
        objectiveIndex={objectiveIndex}
      />
    </div>
  );
};
