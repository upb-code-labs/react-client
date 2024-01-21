import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  selectedCriteriaInGrade,
  studentGradeResponse
} from "@/services/grades/get-grade-of-student-in-laboratory.service";
import { selectCriteriaToGradeService } from "@/services/grades/select-criteria-to-grade.service";
import { Criteria } from "@/types/entities/rubric-entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

interface highlightableRubricCriteriaRequiredUUID {
  laboratoryUUID: string;
  objectiveUUID: string;
  studentUUID: string;
}

interface highlightableRubricCriteriaCardProps {
  objectiveCriteriaList: Criteria[];
  uuids: highlightableRubricCriteriaRequiredUUID;
  criteriaIndex: number;
  objectiveIndex: number;
  isSelected?: boolean;
  isInteractive?: boolean;
}

export const HighlightableRubricCriteriaCard = ({
  objectiveCriteriaList,
  uuids: { laboratoryUUID, objectiveUUID, studentUUID },
  criteriaIndex,
  objectiveIndex,
  isSelected = false,
  isInteractive = true
}: highlightableRubricCriteriaCardProps) => {
  const criteria = objectiveCriteriaList[criteriaIndex];

  const criteriaWeightId = useId();
  const criteriaDescriptionId = useId();

  // Select criteria mutation
  const queryClient = useQueryClient();
  const { mutate: selectCriteriaMutation } = useMutation({
    mutationFn: selectCriteriaToGradeService,
    // Optimistic update
    onMutate: async (args) => {
      // Cancel outgoing re-fetches
      await queryClient.cancelQueries({
        queryKey: ["student-grade", laboratoryUUID, studentUUID],
        exact: true
      });

      // Get the current value
      const previousGrade = queryClient.getQueryData<studentGradeResponse>([
        "student-grade",
        laboratoryUUID,
        studentUUID
      ]);

      // Optimistically update the value
      if (previousGrade) {
        const { selected_criteria: currentSelectedCriteriaList } =
          previousGrade;

        // Check if the objective the criteria belongs to is already in the list
        const includesCriteriaObjective = currentSelectedCriteriaList.some(
          (c) => c.objective_uuid === objectiveUUID
        );

        let updatedSelectedCriteriaList: selectedCriteriaInGrade[];
        let weightToSubtractFromStudentGrade = 0;

        if (includesCriteriaObjective) {
          // Find the weight of the criteria that is currently selected
          const currentSelectedCriteriaUUID = currentSelectedCriteriaList.find(
            (c) => c.objective_uuid === objectiveUUID
          )!.criteria_uuid;

          weightToSubtractFromStudentGrade =
            objectiveCriteriaList.find(
              (c) => c.uuid === currentSelectedCriteriaUUID
            )?.weight || 0;

          // Update the UUID of the criteria that is currently selected for the objective
          updatedSelectedCriteriaList = currentSelectedCriteriaList.map((c) => {
            const isCurrentCriteria = c.objective_uuid === objectiveUUID;

            if (!isCurrentCriteria) return c;

            return {
              ...c,
              criteria_uuid: args.criteria_uuid
            };
          });
        } else {
          // Add the criteria to the list
          updatedSelectedCriteriaList = [
            ...currentSelectedCriteriaList,
            {
              objective_uuid: objectiveUUID,
              criteria_uuid: args.criteria_uuid
            } as selectedCriteriaInGrade
          ];
        }

        queryClient.setQueryData<studentGradeResponse>(
          ["student-grade", laboratoryUUID, studentUUID],
          {
            // Keep the grade comment
            ...previousGrade,
            // Update the grade of the student
            grade:
              previousGrade.grade -
              weightToSubtractFromStudentGrade +
              criteria.weight,
            // Update the selected criteria list
            selected_criteria: updatedSelectedCriteriaList
          }
        );
      }

      // Pass the previous state to the next callbacks
      return { previousGrade };
    },
    onError: (error, _, context) => {
      // Rollback to the previous value
      if (context?.previousGrade) {
        queryClient.setQueryData<studentGradeResponse>(
          ["student-grade", laboratoryUUID, studentUUID],
          context.previousGrade
        );
      }

      // Show an error toast
      toast.error(error.message);
    },
    onSuccess: () => {
      // Show a success toast
      toast.success("Criteria has been selected");
    }
  });

  // De-select criteria mutation
  const { mutate: deSelectCriteriaMutation } = useMutation({
    mutationFn: selectCriteriaToGradeService,
    // Optimistic update
    onMutate: async (_) => {
      // Cancel outgoing re-fetches
      await queryClient.cancelQueries({
        queryKey: ["student-grade", laboratoryUUID, studentUUID],
        exact: true
      });

      // Get the current value
      const previousGrade = queryClient.getQueryData<studentGradeResponse>([
        "student-grade",
        laboratoryUUID,
        studentUUID
      ]);

      // Optimistically update the value
      if (previousGrade) {
        const { selected_criteria: currentSelectedCriteriaList } =
          previousGrade;

        const updatedSelectedCriteriaList = currentSelectedCriteriaList.filter(
          (c) => c.objective_uuid !== objectiveUUID
        );

        queryClient.setQueryData<studentGradeResponse>(
          ["student-grade", laboratoryUUID, studentUUID],
          {
            // Keep the grade comment
            ...previousGrade,
            // Update the grade of the student
            grade: previousGrade.grade - criteria.weight,
            // Update the selected criteria list
            selected_criteria: updatedSelectedCriteriaList
          }
        );
      }

      // Pass the previous state to the next callbacks
      return { previousGrade };
    },
    onError: (error, _, context) => {
      // Rollback to the previous value
      if (context?.previousGrade) {
        queryClient.setQueryData<studentGradeResponse>(
          ["student-grade", laboratoryUUID, studentUUID],
          context.previousGrade
        );
      }

      // Show an error toast
      toast.error(error.message);
    },
    onSuccess: () => {
      // Show a success toast
      toast.success("Criteria has been de-selected");
    }
  });

  // Handlers
  const handleCriteriaCardClick = () => {
    if (isSelected) {
      deSelectCriteriaMutation({
        // Set the criteria UUID to null to de-select it
        criteria_uuid: null,
        laboratoryUUID,
        objective_uuid: objectiveUUID,
        studentUUID
      });
    } else {
      selectCriteriaMutation({
        criteria_uuid: criteria.uuid,
        laboratoryUUID,
        objective_uuid: objectiveUUID,
        studentUUID
      });
    }
  };

  return (
    <article
      className={`flex aspect-square w-full max-w-[18rem] flex-shrink-0 cursor-pointer flex-col gap-2 border p-4 shadow-md transition-colors hover:shadow-lg sm:w-72 ${isSelected && "border-2 border-purple-upb"}`}
      onClick={isInteractive ? handleCriteriaCardClick : undefined}
      tabIndex={0}
      role="button"
      aria-label={`${isSelected ? "De-select" : "Select"} criteria ${criteriaIndex + 1} of objective ${objectiveIndex + 1}`}
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
