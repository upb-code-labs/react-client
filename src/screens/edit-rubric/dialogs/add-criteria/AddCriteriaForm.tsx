import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addCriteriaToObjectiveService } from "@/services/rubrics/add-criteria-to-objective.service";
import { Rubric } from "@/types/entities/rubric-entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface addCriteriaFormProps {
  rubricUUID: string;
  objectiveUUID: string;
  closeDialogCallback: () => void;
}

const criteriaSchema = z.object({
  description: z
    .string()
    .min(8, "The description must be at least 8 characters long")
    .max(510, "The description must be at most 510 characters long"),
  weight: z.coerce
    .number()
    .min(0, "The weight must be a positive number")
    .max(100, "The weight must be at most 100")
});

export const AddCriteriaForm = ({
  rubricUUID,
  objectiveUUID,
  closeDialogCallback
}: addCriteriaFormProps) => {
  // Form state
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof criteriaSchema>>({
    resolver: zodResolver(criteriaSchema),
    defaultValues: {
      description: "",
      weight: 0
    }
  });

  // Add criteria mutation
  const queryClient = useQueryClient();

  type AddCriteriaMutationFnArgs = {
    description: string;
    weight: number;
  };

  const { mutate: addCriteriaMutation } = useMutation({
    mutationFn: ({ description, weight }: AddCriteriaMutationFnArgs) =>
      addCriteriaToObjectiveService({
        objectiveUUID,
        description,
        weight
      }),
    onMutate: ({ description, weight }: AddCriteriaMutationFnArgs) => {
      setLoading(true);

      // Forwards the description to the following callbacks
      return { description, weight };
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (
      newCriteriaUUID: string,
      { description, weight }: AddCriteriaMutationFnArgs
    ) => {
      // Show a success toast
      toast.success("Criteria added successfully");

      // Update rubric query
      queryClient.setQueryData(["rubric", rubricUUID], (oldData: Rubric) => {
        const newCriteria = {
          uuid: newCriteriaUUID,
          description,
          weight
        };

        return {
          ...oldData,
          objectives: oldData.objectives.map((objective) => {
            if (objective.uuid !== objectiveUUID) {
              return objective;
            }

            return {
              ...objective,
              criteria: [...objective.criteria, newCriteria]
            };
          })
        };
      });

      // Update modals state
      closeDialogCallback();
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const onSubmit = async (data: z.infer<typeof criteriaSchema>) => {
    addCriteriaMutation(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Weight</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  max={100}
                  step="any"
                  placeholder="Enter a weight for the new criteria"
                  className="w-full"
                />
              </FormControl>
              {form.formState.errors.weight && (
                <FormMessage>
                  {form.formState.errors.weight.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={6}
                  placeholder="Enter a description for the new criteria"
                  className="resize-none"
                />
              </FormControl>
              {form.formState.errors.description && (
                <FormMessage>
                  {form.formState.errors.description.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" isLoading={loading}>
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
