import { Objective } from "@/types/entities/rubric-entities";

import { GradingRubricCriteriaCard } from "./GradingRubricCriteriaCard";
import { GradingRubricObjectiveCard } from "./GradingRubricObjectiveCard";

interface gradingRubricRowProps {
  laboratoryUUID: string;
  studentUUID: string;
  objective: Objective;
  objectiveIndex: number;
  selectedCriteriaForObjective: string | null;
}

export const GradingRubricRow = ({
  laboratoryUUID,
  studentUUID,
  objective,
  objectiveIndex,
  selectedCriteriaForObjective
}: gradingRubricRowProps) => {
  return (
    <article className="flex gap-4 overflow-x-auto">
      <GradingRubricObjectiveCard
        objective={objective}
        objectiveIndex={objectiveIndex}
      />
      {objective.criteria.map((criteria, index) => (
        <GradingRubricCriteriaCard
          objectiveCriteriaList={objective.criteria}
          criteriaIndex={index}
          objectiveIndex={objectiveIndex}
          uuids={{ laboratoryUUID, objectiveUUID: objective.uuid, studentUUID }}
          isSelected={criteria.uuid === selectedCriteriaForObjective}
        />
      ))}
    </article>
  );
};
