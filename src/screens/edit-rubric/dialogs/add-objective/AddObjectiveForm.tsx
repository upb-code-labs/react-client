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
import { useEditRubricStore } from "@/stores/edit-rubric-store";
import { zodResolver } from "@hookform/resolvers/zod";
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
  // Rubric global state
  const { addObjective } = useEditRubricStore();

  // Form state
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof ObjectiveSchema>>({
    resolver: zodResolver(ObjectiveSchema),
    defaultValues: {
      description: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof ObjectiveSchema>) => {
    setLoading(true);
    await handleAddObjective(data.description);
    setLoading(false);
  };

  const handleAddObjective = async (description: string) => {
    const { success, message, uuid } = await addObjectiveService(
      rubricUUID,
      description
    );

    if (!success) {
      toast.error(message);
      return;
    }

    addObjective({ uuid, description, criteria: [] });
    toast.success("The objective has been added!");
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
        <DialogFooter>
          <Button type="submit" isLoading={loading}>
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
