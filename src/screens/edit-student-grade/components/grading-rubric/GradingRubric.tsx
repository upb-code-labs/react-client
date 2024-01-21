import { Rubric } from "@/types/entities/rubric-entities";

import { GradingRubricRow } from "./GradingRubricObjectiveRow";

interface SelectableRubricProps {
  selectedCriteriaByObjective: Record<string, string | null>;
  laboratoryUUID: string;
  studentUUID: string;
  rubric: Rubric;
}

export const GradingRubric = ({
  selectedCriteriaByObjective,
  laboratoryUUID,
  studentUUID,
  rubric
}: SelectableRubricProps) => {
  return (
    <div className="flex max-w-[calc(100vw-2rem)] flex-col gap-4">
      {rubric.objectives.map((objective, index) => (
        <GradingRubricRow
          key={`selectable-objective-row-${objective.uuid}`}
          laboratoryUUID={laboratoryUUID}
          studentUUID={studentUUID}
          objective={objective}
          objectiveIndex={index}
          selectedCriteriaForObjective={
            selectedCriteriaByObjective[objective.uuid]
          }
        />
      ))}
    </div>
  );
};
