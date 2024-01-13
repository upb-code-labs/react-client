import { updateRubricNameService } from "@/services/rubrics/update-rubric-name.service";
import { Rubric } from "@/types/entities/rubric-entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";

interface RubricNameProps {
  rubric: Rubric;
}

const RubricNameSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters long.")
    .max(96, "Name must be less than 96 characters long.")
});

export const RubricName = ({ rubric }: RubricNameProps) => {
  // Form state
  const form = useForm<z.infer<typeof RubricNameSchema>>({
    resolver: zodResolver(RubricNameSchema),
    defaultValues: {
      name: rubric?.name as string
    }
  });

  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // Rubric name mutation
  const queryClient = useQueryClient();

  const { mutate: mutateRubricName } = useMutation({
    mutationFn: (name: string) => updateRubricNameService(rubric.uuid, name),
    onMutate: () => {
      setIsUpdatingName(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (_, name: string) => {
      // Show a success toast
      toast.success("Rubric renamed successfully");

      // Update rubric state
      queryClient.setQueryData(["rubric", rubric.uuid], (oldData: Rubric) => {
        return {
          ...oldData,
          name
        };
      });

      // Invalidate rubrics list query
      queryClient.invalidateQueries({ queryKey: ["rubrics"], exact: true });
    },
    onSettled: () => {
      setIsUpdatingName(false);
    }
  });

  const onSubmit = async (data: z.infer<typeof RubricNameSchema>) => {
    const { name } = data;
    mutateRubricName(name);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start gap-2 md:flex-row"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full md:w-1/4 md:max-w-[18rem]">
              <FormControl>
                <Input
                  {...field}
                  className="w-full"
                  aria-label="Rubric name"
                  placeholder="Enter a name for your rubric here..."
                />
              </FormControl>
              {form.formState.errors.name && (
                <FormMessage>{form.formState.errors.name.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <Button type="submit" isLoading={isUpdatingName}>
          <Save className="mr-2" /> Update
        </Button>
      </form>
    </Form>
  );
};
