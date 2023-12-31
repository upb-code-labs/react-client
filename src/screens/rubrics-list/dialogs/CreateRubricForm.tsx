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
import { createRubricService } from "@/services/rubrics/create-rubric.service";
import { CreatedRubric } from "@/types/entities/rubric-entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Form validations
const CreateRubricSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters long")
    .max(96, "Name must be at most 96 characters long")
});

interface CreateRubricFormProps {
  closeDialogCallback: () => void;
  addRubricCallback: (rubric: CreatedRubric) => void;
}

export const CreateRubricForm = ({
  closeDialogCallback,
  addRubricCallback
}: CreateRubricFormProps) => {
  const [state, setState] = useState<"idle" | "loading">("idle");
  const form = useForm<z.infer<typeof CreateRubricSchema>>({
    resolver: zodResolver(CreateRubricSchema),
    defaultValues: {
      name: ""
    }
  });

  const formSubmitCallback = async (
    values: z.infer<typeof CreateRubricSchema>
  ) => {
    setState("loading");
    createRubric(values.name);
  };

  const createRubric = async (name: string) => {
    const { success, ...response } = await createRubricService(name);
    if (!success) {
      toast.error(response.message);
      setState("idle");
      return;
    }

    setState("idle");
    addRubricCallback({
      uuid: response.uuid,
      name: name
    });
    closeDialogCallback();
    toast.success("The rubric has been created!");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmitCallback)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-4 grid grid-cols-4 items-center gap-x-4">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a name for the rubric here..."
                  className="col-span-3"
                  {...field}
                />
              </FormControl>
              {form.formState.errors.name && (
                <FormMessage className="col-span-3 col-start-2">
                  {form.formState.errors.name.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        ></FormField>
        <DialogFooter>
          <Button type="submit" isLoading={state === "loading"}>
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
