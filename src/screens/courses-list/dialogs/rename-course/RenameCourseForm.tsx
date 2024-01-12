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
import { UserCoursesContext } from "@/context/courses/UserCoursesContext";
import { CoursesActionType } from "@/hooks/courses/coursesReducer";
import { renameCourseService } from "@/services/courses/rename-course.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Form validations
const RenameCourseSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters long")
    .max(64, "Name must be at most 64 characters long")
});

export const RenameCourseForm = () => {
  const {
    userCoursesDispatcher,
    renameCourseDialogState,
    closeRenameCourseDialog
  } = useContext(UserCoursesContext);
  const course = renameCourseDialogState.selectedCourse;

  const [isUpdating, setIsUpdating] = useState(false);
  const form = useForm<z.infer<typeof RenameCourseSchema>>({
    resolver: zodResolver(RenameCourseSchema),
    defaultValues: {
      name: course?.name
    }
  });

  const { mutate: renameMutation } = useMutation({
    mutationFn: (name: string) => renameCourseService(course!.uuid, name),
    onMutate: () => setIsUpdating(true),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (_, name: string) => {
      // Show a success toast
      toast.success("Course renamed successfully");

      // Update courses state
      userCoursesDispatcher({
        type: CoursesActionType.RENAME_COURSE,
        payload: {
          uuid: course!.uuid,
          name
        }
      });

      // Close dialog
      closeRenameCourseDialog();
    },
    onSettled: () => {
      setIsUpdating(false);
    }
  });

  // Prevent form to be shown if there is no course selected
  if (!course) return null;

  const formSubmitCallback = async (
    values: z.infer<typeof RenameCourseSchema>
  ) => {
    renameMutation(values.name);
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
          <Button type="submit" isLoading={isUpdating}>
            Rename
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
