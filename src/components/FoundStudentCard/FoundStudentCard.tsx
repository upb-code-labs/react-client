import { enrollStudentService } from "@/services/courses/enroll-student.service";
import { EnrolledStudent, Student } from "@/types/entities/general-entities";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "../ui/button";

interface FoundStudentCardProps {
  student: Student;
  addStudentCallback: (student: EnrolledStudent) => void;
}

export const FoundStudentCard = ({
  student,
  addStudentCallback
}: FoundStudentCardProps) => {
  const { courseUUID = "" } = useParams<{ courseUUID: string }>();

  const enrollStudent = async () => {
    const { success, message } = await enrollStudentService(
      courseUUID,
      student.uuid
    );

    if (!success) {
      toast.error(message);
      return;
    }

    // Add the student to the UI
    addStudentCallback({
      uuid: student.uuid,
      full_name: student.full_name,
      institutional_id: student.institutional_id,
      is_active: true
    });
    toast.success(message);
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
