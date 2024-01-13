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
import { Textarea } from "@/components/ui/textarea";
import { addObjectiveService } from "@/services/rubrics/add-objective.service";
import { Rubric } from "@/types/entities/rubric-entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface AddObjectiveFormProps {
  rubricUUID: string;
  closeDialogCallback: () => void;
}

const ObjectiveSchema = z.object({
  description: z
    .string()
    .min(8, "The description must be at least 8 characters long")
    .max(510, "The description must be at most 510 characters long")
});

export const AddObjectiveForm = ({
  rubricUUID,
  closeDialogCallback
}: AddObjectiveFormProps) => {
  // Form state
  const [isAddingObjective, setIsAddingObjective] = useState(false);
  const form = useForm<z.infer<typeof ObjectiveSchema>>({
    resolver: zodResolver(ObjectiveSchema),
    defaultValues: {
      description: ""
    }
  });

  // Add objective mutation
  const queryClient = useQueryClient();
  const { mutate: addObjectiveMutation } = useMutation({
    mutationFn: (description: string) =>
      addObjectiveService(rubricUUID, description),
    onMutate: (description: string) => {
      setIsAddingObjective(true);
      // Forwards the description to the following callbacks
      return description;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (newObjectiveUUID: string, description: string) => {
      // Show a success toast
      toast.success("Objective added successfully");

      // Update rubric query
      queryClient.setQueryData(["rubric", rubricUUID], (oldData: Rubric) => {
        const newObjective = {
          uuid: newObjectiveUUID,
          description,
          criteria: []
        };

        return {
          ...oldData,
          objectives: [...oldData.objectives, newObjective]
        };
      });

      // Update modals state
      closeDialogCallback();
    },
    onSettled: () => {
      setIsAddingObjective(false);
    }
  });

  const onSubmit = (data: z.infer<typeof ObjectiveSchema>) => {
    addObjectiveMutation(data.description);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  placeholder="Enter a description for the new objective"
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
        ></FormField>
        <DialogFooter>
          <Button type="submit" isLoading={isAddingObjective}>
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
