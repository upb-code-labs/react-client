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
import { useEditRubricStore } from "@/stores/edit-rubric-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface addCriteriaFormProps {
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
  objectiveUUID,
  closeDialogCallback
}: addCriteriaFormProps) => {
  // Rubric global state
  const { addCriteria } = useEditRubricStore();

  // Form state
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof criteriaSchema>>({
    resolver: zodResolver(criteriaSchema),
    defaultValues: {
      description: "",
      weight: 0
    }
  });

  const onSubmit = async (data: z.infer<typeof criteriaSchema>) => {
    setLoading(true);
    await handleAddObjective(data.description, data.weight);
    setLoading(false);
  };

  const handleAddObjective = async (description: string, weight: number) => {
    const { success, message, uuid } = await addCriteriaToObjectiveService(
      objectiveUUID,
      description,
      weight
    );

    if (!success) {
      toast.error(message);
      return;
    }

    const newCriteria = { uuid, description, weight };
    addCriteria(objectiveUUID, newCriteria);
    toast.success("The criteria has been added!");
    closeDialogCallback();
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
                  step={0.01}
                  min={0}
                  max={100}
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
        ></FormField>
        <DialogFooter>
          <Button type="submit" isLoading={loading}>
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
