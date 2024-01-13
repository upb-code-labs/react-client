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
import { CoursesState } from "@/hooks/courses/useCourses";
import { joinUsingInvitationCodeService } from "@/services/courses/join-using-invitation-code.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Form validations
const JoinCourseSchema = z.object({
  invitationCode: z
    .string()
    .length(9, "The invitation code must be 9 characters long.")
});

interface JoinCourseFormProps {
  closeDialogCallback: () => void;
}

export const JoinCourseForm = ({
  closeDialogCallback
}: JoinCourseFormProps) => {
  // Form state
  const [isJoiningToCourse, setIsJoiningToCourse] = useState(false);
  const form = useForm<z.infer<typeof JoinCourseSchema>>({
    resolver: zodResolver(JoinCourseSchema),
    defaultValues: {
      invitationCode: ""
    }
  });

  // Join course mutation
  const queryClient = useQueryClient();
  const { mutate: joinCourseMutation } = useMutation({
    mutationFn: joinUsingInvitationCodeService,
    onMutate: () => {
      setIsJoiningToCourse(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (joinResponse) => {
      const course = joinResponse;

      // Update courses query
      queryClient.setQueryData(["courses"], (oldCourses: CoursesState) => {
        return {
          ...oldCourses,
          courses: [...oldCourses.courses, course]
        };
      });

      // Show a success message
      toast.success("You have joined the course");

      closeDialogCallback();
    },
    onSettled: () => {
      setIsJoiningToCourse(false);
    }
  });

  const formSubmitCallback = (values: z.infer<typeof JoinCourseSchema>) => {
    joinCourseMutation(values.invitationCode);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmitCallback)}>
        <FormField
          control={form.control}
          name="invitationCode"
          render={({ field }) => (
            <FormItem className="mb-4 grid grid-cols-4 items-center gap-x-4">
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the invitation code here..."
                  className="col-span-3"
                  {...field}
                />
              </FormControl>
              {form.formState.errors.invitationCode && (
                <FormMessage className="col-span-3 col-start-2">
                  {form.formState.errors.invitationCode.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        ></FormField>
        <DialogFooter>
          <Button type="submit" isLoading={isJoiningToCourse}>
            Join
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
