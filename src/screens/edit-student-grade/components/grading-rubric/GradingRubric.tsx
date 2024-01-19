import { Rubric } from "@/types/entities/rubric-entities";

import { GradingRubricRow } from "./GradingRubricObjectiveRow";

interface SelectableRubricProps {
  selectedCriteriaByObjective: Record<string, string | null>;
  laboratoryUUID: string;
  studentUUID: string;
  isLoading: boolean;
  rubric: Rubric;
}

export const GradingRubric = ({
  selectedCriteriaByObjective,
  laboratoryUUID,
  studentUUID,
  isLoading,
  rubric
}: SelectableRubricProps) => {
  // TODO: Use a proper loading component
  if (isLoading) {
    return <div>Loading rubric...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
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
