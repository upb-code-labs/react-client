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
import { updateCriteriaService } from "@/services/rubrics/update-criteria.service";
import { useEditRubricStore } from "@/stores/edit-rubric-store";
import { Criteria } from "@/types/entities/rubric-entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefObject, memo, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { CriteriaCardDropdown } from "./CriteriaCardDropdown";

interface CriteriaCardProps {
  criteria: Criteria;
  objectiveIndex: number;
  criteriaIndex: number;
}

const criteriaSchema = z.object({
  weight: z.coerce
    .number()
    .min(0, "Weight must be at least 0")
    .max(100, "Weight must be at most 100"),
  description: z
    .string()
    .min(8, "Description must be at least 8 characters")
    .max(510, "Description must be at most 510 characters")
});

export const CriteriaCard = memo(
  ({ criteria, criteriaIndex, objectiveIndex }: CriteriaCardProps) => {
    const { updateCriteria } = useEditRubricStore();

    const form = useForm<z.infer<typeof criteriaSchema>>({
      resolver: zodResolver(criteriaSchema),
      defaultValues: {
        weight: criteria.weight,
        description: criteria.description
      }
    });

    const submitButtonRef: RefObject<HTMLButtonElement> = useRef(null);

    const onSubmit = async (data: z.infer<typeof criteriaSchema>) => {
      const { weight, description } = data;
      const { uuid } = criteria;

      // Send request to update criteria
      const updateCriteriaParams = {
        criteriaUUID: uuid,
        weight,
        description
      };
      const { success, message } =
        await updateCriteriaService(updateCriteriaParams);

      if (!success) {
        toast.error(message);
      } else {
        toast.success(message);
        updateCriteria(updateCriteriaParams);
      }
    };

    return (
      <article className="relative">
        <CriteriaCardDropdown
          criteriaIndex={criteriaIndex}
          criteriaUUID={criteria.uuid}
          submitButtonRef={submitButtonRef}
          objectiveIndex={objectiveIndex}
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex aspect-square w-full max-w-[18rem] flex-shrink-0 flex-col gap-2 border p-4 shadow-md transition-colors hover:shadow-lg sm:w-72"
          >
            <h2 className="text-xl font-bold">Criteria {criteriaIndex + 1}</h2>
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      aria-label={`Criteria ${criteriaIndex + 1} of objective ${
                        objectiveIndex + 1
                      } weight`}
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
                <FormItem className="flex flex-grow flex-col">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="flex-grow resize-none"
                      aria-label={`Criteria ${criteriaIndex + 1} of objective ${
                        objectiveIndex + 1
                      } description`}
                      placeholder="Enter a description for this criteria here..."
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
