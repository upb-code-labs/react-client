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
import { UserCoursesDialogsContext } from "@/context/courses/UserCoursesDialogsContext";
import { CoursesState } from "@/hooks/courses/useCourses";
import { renameCourseService } from "@/services/courses/rename-course.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const { renameCourseDialogState, closeRenameCourseDialog } = useContext(
    UserCoursesDialogsContext
  );
  const course = renameCourseDialogState.selectedCourse;

  const [isUpdating, setIsUpdating] = useState(false);
  const form = useForm<z.infer<typeof RenameCourseSchema>>({
    resolver: zodResolver(RenameCourseSchema),
    defaultValues: {
      name: course?.name
    }
  });

  // Rename course mutation
  const queryClient = useQueryClient();
  const { mutate: renameMutation } = useMutation({
    mutationFn: (name: string) => renameCourseService(course!.uuid, name),
    onMutate: () => setIsUpdating(true),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (_, name: string) => {
      // Show a success toast
      toast.success("Course renamed successfully");

      // Update courses query
      queryClient.setQueryData<CoursesState>(
        ["courses"],
        (oldData: CoursesState | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            courses: oldData.courses.map((course) => {
              if (course.uuid != renameCourseDialogState.selectedCourse?.uuid)
                return course;

              return {
                ...course,
                name
              };
            })
          };
        }
      );

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
