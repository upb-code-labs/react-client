import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Criteria } from "@/types/entities/rubric";

interface CriteriaCardProps {
  criteria: Criteria;
  index: number;
}

export const CriteriaCard = ({ criteria, index }: CriteriaCardProps) => {
  return (
    <article
      key={`criteria-col-${criteria.uuid}`}
      className="flex aspect-square w-full max-w-[18rem] flex-shrink-0 flex-col gap-2 border p-4 shadow-md transition-colors hover:shadow-lg sm:w-72"
    >
      <h2 className="text-xl font-bold">Criteria {index + 1}</h2>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`criteria-weight-${criteria.uuid}`}>Weight</Label>
        <Input
          id={`criteria-weight-${criteria.uuid}`}
          type="number"
          min={0}
          max={100}
          step={0.1}
          defaultValue={criteria.weight}
        />
      </div>
      <div className="flex flex-grow flex-col gap-2">
        <Label htmlFor={`criteria-description-${criteria.uuid}`}>
          Description
        </Label>
        <Textarea
          id={`criteria-description-${criteria.uuid}`}
          className="flex-grow resize-none"
          defaultValue={criteria.description}
        />
      </div>
    </article>
  );
};
