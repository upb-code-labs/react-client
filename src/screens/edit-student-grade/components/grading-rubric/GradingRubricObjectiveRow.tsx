import { Objective } from "@/types/entities/rubric-entities";

import { GradingRubricCriteriaCard } from "./GradingRubricCriteriaCard";
import { GradingRubricObjectiveCard } from "./GradingRubricObjectiveCard";

interface gradingRubricRowProps {
  objective: Objective;
  objectiveIndex: number;
}

export const GradingRubricRow = ({
  objective,
  objectiveIndex
}: gradingRubricRowProps) => {
  return (
    <article className="flex gap-4 overflow-x-auto">
      <GradingRubricObjectiveCard
        objective={objective}
        objectiveIndex={objectiveIndex}
      />
      {objective.criteria.map((criteria, index) => (
        <GradingRubricCriteriaCard
          criteria={criteria}
          criteriaIndex={index}
          objectiveIndex={objectiveIndex}
        />
      ))}
    </article>
  );
};
