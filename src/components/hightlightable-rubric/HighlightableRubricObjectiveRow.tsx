import { Objective } from "@/types/entities/rubric-entities";

import { HighlightableRubricCriteriaCard } from "./HighlightableRubricCriteriaCard";
import { HighlightableRubricObjectiveCard } from "./HighlightableRubricObjectiveCard";

interface highlightableRubricRowProps {
  laboratoryUUID: string;
  studentUUID: string;
  objective: Objective;
  objectiveIndex: number;
  selectedCriteriaForObjective: string | null;
  isInteractive?: boolean;
}

export const HighlightableRubricRow = ({
  laboratoryUUID,
  studentUUID,
  objective,
  objectiveIndex,
  selectedCriteriaForObjective,
  isInteractive = true
}: highlightableRubricRowProps) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      <HighlightableRubricObjectiveCard
        objective={objective}
        objectiveIndex={objectiveIndex}
      />
      {objective.criteria.map((criteria, index) => (
        <HighlightableRubricCriteriaCard
          key={criteria.uuid}
          objectiveCriteriaList={objective.criteria}
          criteriaIndex={index}
          objectiveIndex={objectiveIndex}
          uuids={{ laboratoryUUID, objectiveUUID: objective.uuid, studentUUID }}
          isSelected={criteria.uuid === selectedCriteriaForObjective}
          isInteractive={isInteractive}
        />
      ))}
    </div>
  );
};
