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
import { joinUsingInvitationCodeService } from "@/services/courses/join-using-invitation-code.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
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
  const { userCoursesDispatcher } = useContext(UserCoursesContext);
  const [state, setState] = useState<"idle" | "loading">("idle");
  const form = useForm<z.infer<typeof JoinCourseSchema>>({
    resolver: zodResolver(JoinCourseSchema),
    defaultValues: {
      invitationCode: ""
    }
  });

  const formSubmitCallback = async (
    values: z.infer<typeof JoinCourseSchema>
  ) => {
    joinCourse(values.invitationCode);
  };

  const joinCourse = async (code: string) => {
    setState("loading");

    const { success, ...response } = await joinUsingInvitationCodeService(code);
    if (!success) {
      toast.error(response.message);
      setState("idle");
      return;
    }

    const { course } = response;
    if (!course) {
      toast.error("Unable to get the course data");
      setState("idle");
      return;
    }

    const { message } = response;
    toast.success(message);
    setState("idle");

    userCoursesDispatcher({
      type: CoursesActionType.ADD_COURSE,
      payload: {
        course
      }
    });
    closeDialogCallback();
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
          <Button type="submit" isLoading={state === "loading"}>
            Join
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
