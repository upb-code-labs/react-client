import { Textarea } from "@/components/ui/textarea";
import { updateObjectiveService } from "@/services/rubrics/update-objective.service";
import { Objective, Rubric } from "@/types/entities/rubric-entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RefObject, memo, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../../../../components/ui/form";
import { ObjectiveCardDropdown } from "./ObjectiveCardDropdown";

interface ObjectiveCardProps {
  rubricUUID: string;
  objective: Objective;
  objectiveIndex: number;
}

const ObjectiveSchema = z.object({
  description: z
    .string()
    .min(8, "Description must be at least 8 characters")
    .max(510, "Description must be less than 510 characters")
});

export const ObjectiveCard = memo(
  ({
    rubricUUID,
    objective: initialObjective,
    objectiveIndex
  }: ObjectiveCardProps) => {
    // Form state
    const form = useForm<z.infer<typeof ObjectiveSchema>>({
      resolver: zodResolver(ObjectiveSchema),
      defaultValues: {
        description: initialObjective.description
      }
    });

    // Update objective mutation
    const queryClient = useQueryClient();
    const { mutate: updateObjectiveMutation } = useMutation({
      mutationFn: ({
        objectiveUUID,
        description
      }: {
        objectiveUUID: string;
        description: string;
      }) => updateObjectiveService(objectiveUUID, description),
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: (_, args) => {
        // Show a success toast
        toast.success("Objective updated successfully");

        // Create the updated objective
        const updatedObjective = {
          ...initialObjective,
          description: args.description
        };

        // Update the rubric query
        queryClient.setQueryData(
          ["rubric", rubricUUID],
          (oldRubric: Rubric) => {
            // Obtain the old objectives array
            const updatedObjectives = [...oldRubric.objectives];

            // Update the objective at the given index
            updatedObjectives[objectiveIndex] = updatedObjective;

            // Create the updated rubric
            const updatedRubric = {
              ...oldRubric,
              objectives: updatedObjectives
            };

            return updatedRubric;
          }
        );
      }
    });

    const submitButtonRef: RefObject<HTMLButtonElement> = useRef(null);

    const onSubmit = async (data: z.infer<typeof ObjectiveSchema>) => {
      const { description } = data;
      const { uuid } = initialObjective;
      updateObjectiveMutation({ objectiveUUID: uuid, description });
    };

    return (
      <article className="relative aspect-square w-full max-w-[18rem] flex-shrink-0 border p-4 shadow-md transition-colors hover:shadow-lg sm:w-72">
        <ObjectiveCardDropdown
          objectiveIndex={objectiveIndex}
          objectiveUUID={initialObjective.uuid}
          submitButtonRef={submitButtonRef}
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col gap-2"
          >
            <h2 className="text-xl font-bold">
              Objective {objectiveIndex + 1}
            </h2>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-grow flex-col">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="flex-grow resize-none"
                      aria-label={`Objective ${objectiveIndex + 1} description`}
                      placeholder="Enter a description for this objective here..."
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
            <button type="submit" ref={submitButtonRef} className="hidden" />
          </form>
        </Form>
      </article>
    );
  }
);
