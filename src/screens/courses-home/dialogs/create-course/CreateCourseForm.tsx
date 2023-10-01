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
import { createCourseService } from "@/services/courses/create-course.service";
import { Course } from "@/types/entities/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Form validations
const CreateCourseSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters long")
    .max(64, "Name must be at most 64 characters long")
});

interface CreateCourseFormProps {
  closeDialogCallback: () => void;
  addNewCourseCallback: (course: Course) => void;
}

export const CreateCourseForm = ({
  closeDialogCallback,
  addNewCourseCallback
}: CreateCourseFormProps) => {
  const [state, setState] = useState<"idle" | "loading">("idle");
  const form = useForm<z.infer<typeof CreateCourseSchema>>({
    resolver: zodResolver(CreateCourseSchema),
    defaultValues: {
      name: ""
    }
  });

  const formSubmitCallback = async (
    values: z.infer<typeof CreateCourseSchema>
  ) => {
    createCourse(values.name);
  };

  const createCourse = async (name: string) => {
    setState("loading");

    const { success, ...response } = await createCourseService(name);
    if (!success) {
      toast.error(response.message);
      setState("idle");
      return;
    }

    const { message, course } = response;
    toast.success(message);
    setState("idle");

    addNewCourseCallback(course);
    closeDialogCallback();
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
                  placeholder="Enter a name here..."
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
