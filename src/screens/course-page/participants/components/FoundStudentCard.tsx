import { Button } from "@/components/ui/button";
import { enrollStudentService } from "@/services/courses/enroll-student.service";
import { EnrolledStudent, Student } from "@/types/entities/general-entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

interface FoundStudentCardProps {
  student: Student;
}

export const FoundStudentCard = ({ student }: FoundStudentCardProps) => {
  const { courseUUID = "" } = useParams<{ courseUUID: string }>();

  const queryClient = useQueryClient();

  const { mutate: enrollStudentMutation } = useMutation({
    mutationFn: (data: EnrolledStudent) => {
      return enrollStudentService(data, courseUUID);
    },
    onMutate: async (data: EnrolledStudent) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["course-students", courseUUID]
      });

      // Keep the current value
      const previousStudents = queryClient.getQueryData<EnrolledStudent[]>([
        "course-students",
        courseUUID
      ]);

      // Optimistically update the list of students
      queryClient.setQueryData<EnrolledStudent[]>(
        ["course-students", courseUUID],
        (old) => {
          return old ? [...old, data] : [data];
        }
      );

      // Return the previous value
      return { previousStudents };
    },
    onSuccess: () => {
      // Show a success toast
      toast.success("Student enrolled successfully");
    },
    onError: (error) => {
      // Show an error toast
      toast.error(error.message);

      // Rollback to the previous value
      queryClient.setQueryData<EnrolledStudent[]>(
        ["course-students", courseUUID],
        (old) => {
          return old ? old : [];
        }
      );
    },
    onSettled: () => {
      // Invalidate the query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["course-students", courseUUID],
        exact: true
      });
    }
  });

  const enrollStudent = async () => {
    const studentData = {
      uuid: student.uuid,
      full_name: student.full_name,
      institutional_id: student.institutional_id,
      is_active: true
    };

    enrollStudentMutation(studentData);
  };

  return (
    <Button
      variant={"ghost"}
      className="mb-2 h-auto w-full flex-col items-start"
      onClick={enrollStudent}
    >
      <span className="line-clamp-1 text-sm font-semibold">
        {student.full_name}
      </span>
      <span className="line-clamp-1 text-xs text-muted-foreground">
        {student.institutional_id}
      </span>
    </Button>
  );
};
