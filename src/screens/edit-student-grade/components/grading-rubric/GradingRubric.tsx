import { Rubric } from "@/types/entities/rubric-entities";

import { GradingRubricRow } from "./GradingRubricObjectiveRow";

interface SelectableRubricProps {
  isLoading: boolean;
  rubric: Rubric;
}

export const GradingRubric = ({ rubric, isLoading }: SelectableRubricProps) => {
  if (isLoading) {
    return <div>Loading rubric...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {rubric.objectives.map((objective, index) => (
        <GradingRubricRow
          key={`selectable-objective-row-${objective.uuid}`}
          objective={objective}
          objectiveIndex={index}
        />
      ))}
    </div>
  );
};
