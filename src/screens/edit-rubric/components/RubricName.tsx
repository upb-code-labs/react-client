import { updateRubricNameService } from "@/services/rubrics/update-rubric-name.service";
import { useEditRubricStore } from "@/stores/edit-rubric-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
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

const RubricNameSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters long.")
    .max(96, "Name must be less than 96 characters long.")
});

export const RubricName = () => {
  const { rubric, setName } = useEditRubricStore();

  const form = useForm<z.infer<typeof RubricNameSchema>>({
    resolver: zodResolver(RubricNameSchema),
    defaultValues: {
      name: rubric?.name as string
    }
  });

  const onSubmit = async (data: z.infer<typeof RubricNameSchema>) => {
    const { name } = data;

    const { success, message } = await updateRubricNameService(
      rubric?.uuid as string,
      name
    );
    if (success) {
      setName(name);
      toast.success(message);
    } else {
      toast.error(message);
    }
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
        <Button type="submit">
          <Save className="mr-2" /> Update
        </Button>
      </form>
    </Form>
  );
};
