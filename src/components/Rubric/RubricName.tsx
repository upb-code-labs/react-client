import { useEditRubricStore } from "@/stores/edit-rubric-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "../ui/form";
import { Input } from "../ui/input";
import { updateRubricNameService } from "@/services/rubrics/update-rubric-name.service";
import { toast } from "sonner";

const RubricNameSchema = z.object({
  name: z.preprocess((value) => {
    // Sanitize whitespace before validation
    if (typeof value !== "string") return value;
    return value.trim().replace(/\s\s+/g, " ");
  }, z.string().min(4, "Name must be at least 4 characters long.").max(96, "Name must be less than 96 characters long."))
});

export const RubricName = () => {
  const { rubric, setName: setGlobalName } = useEditRubricStore();

  const form = useForm<z.infer<typeof RubricNameSchema>>({
    resolver: zodResolver(RubricNameSchema),
    defaultValues: {
      name: rubric?.name as string
    }
  });

  const onSubmit = async (data: z.infer<typeof RubricNameSchema>) => {
    const { name } = data;

    const {success, message} = await updateRubricNameService(rubric?.uuid as string, name);
    if (success) {
      setGlobalName(name);
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-start w-full gap-2 md:flex-row"
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
          <Save className="mr-2" /> Submit
        </Button>
      </form>
    </Form>
  );
};
