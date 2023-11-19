import { Textarea } from "@/components/ui/textarea";
import { updateObjectiveService } from "@/services/rubrics/update-objective.service";
import { useEditRubricStore } from "@/stores/edit-rubric-store";
import { Objective } from "@/types/entities/rubric";
import { zodResolver } from "@hookform/resolvers/zod";
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
} from "../../ui/form";
import { ObjectiveCardDropdown } from "./ObjectiveCardDropdown";

interface ObjectiveCardProps {
  objective: Objective;
  index: number;
}

const ObjectiveSchema = z.object({
  description: z
    .string()
    .min(8, "Description must be at least 8 characters")
    .max(510, "Description must be less than 510 characters")
});

export const ObjectiveCard = memo(
  ({ objective: initialObjective, index }: ObjectiveCardProps) => {
    const { updateObjective } = useEditRubricStore();
    const form = useForm<z.infer<typeof ObjectiveSchema>>({
      resolver: zodResolver(ObjectiveSchema),
      defaultValues: {
        description: initialObjective.description
      }
    });

    const submitButtonRef: RefObject<HTMLButtonElement> = useRef(null);

    const onSubmit = async (data: z.infer<typeof ObjectiveSchema>) => {
      const { description } = data;
      const { uuid } = initialObjective;

      // Send request to update objective
      const { success, message } = await updateObjectiveService(
        uuid,
        description
      );

      if (!success) {
        toast.error(message);
      } else {
        toast.success(message);
        updateObjective(uuid, description);
      }
    };

    return (
      <article className="relative">
        <ObjectiveCardDropdown
          objectiveIndex={index}
          objectiveUUID={initialObjective.uuid}
          submitButtonRef={submitButtonRef}
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex aspect-square w-full max-w-[18rem] flex-shrink-0 flex-col gap-2 border p-4 shadow-md transition-colors hover:shadow-lg sm:w-72"
          >
            <h2 className="text-xl font-bold">Objective {index + 1}</h2>
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
                      aria-label={`Objective ${index + 1} description`}
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
