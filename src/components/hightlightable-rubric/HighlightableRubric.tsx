import { Rubric } from "@/types/entities/rubric-entities";

import { HighlightableRubricRow } from "./HighlightableRubricObjectiveRow";

interface highlightableRubricProps {
  selectedCriteriaByObjective: Record<string, string | null>;
  laboratoryUUID: string;
  studentUUID: string;
  rubric: Rubric;
}

export const HighlightableRubric = ({
  selectedCriteriaByObjective,
  laboratoryUUID,
  studentUUID,
  rubric
}: highlightableRubricProps) => {
  return (
    <div className="flex max-w-[calc(100vw-2rem)] flex-col gap-4">
      {rubric.objectives.map((objective, index) => (
        <HighlightableRubricRow
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
