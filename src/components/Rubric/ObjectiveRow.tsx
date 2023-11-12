import { Objective } from "@/types/entities/rubric";

import { ActionButton } from "./ActionButton";
import { CriteriaCard } from "./CriteriaCard";
import { ObjectiveCard } from "./ObjectiveCard";

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
        <CriteriaCard criteria={criteria} index={ci} />
      ))}

      <ActionButton
        text="Add criteria"
        onClick={() => console.log("Add criteria")}
      />
    </article>
  );
};
