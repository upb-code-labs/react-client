import { AddCriteriaDialog } from "@/screens/edit-rubric/dialogs/add-criteria/AddCriteriaDialog";
import { Objective } from "@/types/entities/rubric";

import { CriteriaCard } from "./CriteriaCard/CriteriaCard";
import { ObjectiveCard } from "./ObjectiveCard/ObjectiveCard";

interface ObjectiveRowProps {
  objective: Objective;
  index: number;
}

export const ObjectiveRow = ({ objective, index }: ObjectiveRowProps) => {
  return (
    <article
      key={`objective-row-${objective.uuid}`}
      className="flex gap-4 overflow-x-auto"
    >
      <ObjectiveCard objective={objective} index={index} />

      {objective.criteria.map((criteria, ci) => (
        <CriteriaCard
          key={criteria.uuid}
          criteria={criteria}
          criteriaIndex={ci}
          objectiveIndex={index}
        />
      ))}

      <AddCriteriaDialog index={index} objectiveUUID={objective.uuid} />
    </article>
  );
};
