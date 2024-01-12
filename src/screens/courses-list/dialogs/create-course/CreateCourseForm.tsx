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
import { CoursesState } from "@/hooks/courses/useCourses";
import { createCourseService } from "@/services/courses/create-course.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
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
}

export const CreateCourseForm = ({
  closeDialogCallback
}: CreateCourseFormProps) => {
  // Global courses state
  const { userCoursesDispatcher } = useContext(UserCoursesContext);

  // Form state
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const form = useForm<z.infer<typeof CreateCourseSchema>>({
    resolver: zodResolver(CreateCourseSchema),
    defaultValues: {
      name: ""
    }
  });

  // Create course mutation
  const queryClient = useQueryClient();
  const { mutate: createCourseMutation } = useMutation({
    mutationFn: createCourseService,
    onMutate: () => {
      setIsCreatingCourse(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (creationResponse, name: string) => {
      const newCourse = {
        ...creationResponse,
        name
      };

      // Update user courses state
      userCoursesDispatcher({
        type: CoursesActionType.ADD_COURSE,
        payload: {
          course: newCourse
        }
      });

      // Update courses query
      queryClient.setQueryData(["courses"], (oldCourses: CoursesState) => {
        return {
          ...oldCourses,
          courses: [...oldCourses.courses, newCourse]
        };
      });

      // Close dialog
      closeDialogCallback();
    },
    onSettled: () => {
      setIsCreatingCourse(false);
    }
  });

  const formSubmitCallback = async (
    values: z.infer<typeof CreateCourseSchema>
  ) => {
    await createCourseMutation(values.name);
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
          <Button type="submit" isLoading={isCreatingCourse}>
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
