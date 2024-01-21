import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { studentGradeResponse } from "@/services/grades/get-grade-of-student-in-laboratory.service";
import { useId } from "react";

interface myGradeFormProps {
  studentGrade: studentGradeResponse;
}

export const MyGradeForm = ({ studentGrade }: myGradeFormProps) => {
  const { grade, comment } = studentGrade;

  const gradeInputId = useId();
  const commentInputId = useId();

  return (
    <form className="max-w-xs space-y-4 md:mx-auto md:max-w-full">
      <FormItem>
        <Label htmlFor={gradeInputId}>Grade</Label>
        <Input
          id={gradeInputId}
          value={grade}
          readOnly={true}
          placeholder="Your grade will be shown here..."
        />
      </FormItem>
      <FormItem>
        <Label htmlFor={commentInputId}>Comment</Label>
        <Textarea
          id={commentInputId}
          className="resize-none"
          rows={5}
          value={comment}
          readOnly={true}
          placeholder="Any comment made by the teacher will be shown here..."
        />
      </FormItem>
    </form>
  );
};
