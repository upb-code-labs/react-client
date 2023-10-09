import { Student } from "@/types/entities/student";

import { Button } from "../ui/button";

interface FoundStudentCardProps {
  student: Student;
}

export const FoundStudentCard = ({ student }: FoundStudentCardProps) => {
  return (
    <Button
      variant={"ghost"}
      className="mb-2 h-auto w-full flex-col items-start"
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
