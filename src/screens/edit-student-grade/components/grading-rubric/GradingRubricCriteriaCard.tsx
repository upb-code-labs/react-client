import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Criteria } from "@/types/entities/rubric-entities";
import { useId } from "react";

interface gradingRubricCriteriaCardProps {
  criteria: Criteria;
  objectiveIndex: number;
  criteriaIndex: number;
}

export const GradingRubricCriteriaCard = ({
  criteria,
  objectiveIndex,
  criteriaIndex
}: gradingRubricCriteriaCardProps) => {
  const criteriaWeightId = useId();
  const criteriaDescriptionId = useId();

  return (
    <article
      className="flex aspect-square w-full max-w-[18rem] flex-shrink-0 cursor-pointer flex-col gap-2 border p-4 shadow-md transition-colors hover:shadow-lg sm:w-72"
      tabIndex={0}
    >
      <h2 className="text-xl font-bold">Criteria {criteriaIndex + 1}</h2>
      <div className="flex flex-col gap-2">
        <Label htmlFor={criteriaWeightId}>Weight</Label>
        <Input
          id={criteriaWeightId}
          aria-label={`Criteria ${criteriaIndex + 1} of objective ${
            objectiveIndex + 1
          } weight`}
          value={criteria.weight}
          readOnly={true}
        />
      </div>
      <div className="flex flex-grow flex-col gap-2">
        <Label htmlFor={criteriaDescriptionId}>Description</Label>
        <Textarea
          className="flex-grow resize-none"
          id={criteriaDescriptionId}
          aria-label={`Criteria ${criteriaIndex + 1} of objective ${
            objectiveIndex + 1
          } description`}
          value={criteria.description}
          readOnly={true}
        />
      </div>
    </article>
  );
};
