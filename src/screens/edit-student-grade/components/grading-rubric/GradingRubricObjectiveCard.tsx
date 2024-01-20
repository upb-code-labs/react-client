import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Objective } from "@/types/entities/rubric-entities";
import { useId } from "react";

interface gradingRubricObjectiveCardProps {
  objective: Objective;
  objectiveIndex: number;
}

export const GradingRubricObjectiveCard = ({
  objective,
  objectiveIndex
}: gradingRubricObjectiveCardProps) => {
  const objectiveDescriptionId = useId();

  return (
    <form className="flex aspect-square w-full max-w-[18rem] flex-shrink-0 flex-col gap-2 border p-4 shadow-md transition-colors hover:shadow-lg sm:w-72">
      <h2 className="text-xl font-bold">Objective {objectiveIndex + 1}</h2>
      <div className="flex flex-grow flex-col gap-2">
        <Label htmlFor={objectiveDescriptionId}>Description</Label>
        <Textarea
          id={objectiveDescriptionId}
          className="flex-grow resize-none"
          aria-label={`Objective ${objectiveIndex + 1} description`}
          value={objective.description}
          readOnly={true}
        />
      </div>
    </form>
  );
};
