import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { studentGradeResponse } from "@/services/grades/get-grade-of-student-in-laboratory.service";
import { setGradeCommentService } from "@/services/grades/set-grade-comment.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface gradingFormProps {
  laboratoryUUID: string;
  studentUUID: string;
  studentGrade: studentGradeResponse;
}

const gradingFormSchema = z.object({
  grade: z.number().min(0, "Grade must be greater than 0").readonly(),
  comment: z
    .string()
    .min(8, "Comment must be at least 8 character long")
    .max(510, "Comment must be at most 510 characters long")
    .readonly()
});

export const GradingForm = ({
  laboratoryUUID,
  studentUUID,
  studentGrade
}: gradingFormProps) => {
  const { grade, comment } = studentGrade;

  // Form state
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);
  const form = useForm<z.infer<typeof gradingFormSchema>>({
    resolver: zodResolver(gradingFormSchema),
    defaultValues: {
      grade,
      comment
    }
  });

  // Handlers
  const handleSubmit = (data: z.infer<typeof gradingFormSchema>) => {
    setCommentMutation({
      laboratoryUUID,
      studentUUID,
      comment: data.comment
    });
  };

  // Set comment mutation
  const queryClient = useQueryClient();
  const { mutate: setCommentMutation } = useMutation({
    mutationFn: setGradeCommentService,
    onMutate: () => {
      setIsUpdatingComment(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (_, args) => {
      // Show a confirmation toast
      toast.success("The comment has been set successfully");

      // Update the data in the cache
      queryClient.setQueryData<studentGradeResponse>(
        ["student-grade", laboratoryUUID, studentUUID],
        (oldData) => {
          return {
            // Keep the grade field
            ...oldData!,
            // Update the comment field
            comment: args.comment
          };
        }
      );
    },
    onSettled: () => {
      setIsUpdatingComment(false);
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mx-auto max-w-xs space-y-4 md:max-w-full"
      >
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade</FormLabel>
              <FormControl>
                <Input {...field} readOnly />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="resize-none"
                  placeholder="Enter a comment for the student here..."
                  rows={5}
                />
              </FormControl>
              {form.formState.errors.comment?.message && (
                <FormMessage>
                  {form.formState.errors.comment?.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <Button isLoading={isUpdatingComment} className="w-full">
          Update comment
        </Button>
      </form>
    </Form>
  );
};
