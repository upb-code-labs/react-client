import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { summarizedGradeDTO } from "@/services/grades/get-summarized-grades-in-laboratory.service";
import { EditIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface LaboratoryGradesTableProps {
  courseUUID: string;
  laboratoryUUID: string;
  grades: summarizedGradeDTO[];
}

export const LaboratoryGradesTable = ({
  courseUUID,
  laboratoryUUID,
  grades
}: LaboratoryGradesTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student name</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades.length ? (
            grades.map((grade) => {
              const hasGrade = grade.grade !== undefined;

              return (
                <TableRow key={`${laboratoryUUID}-${grade.student_uuid}-grade`}>
                  <TableCell>{grade.student_full_name}</TableCell>
                  <TableCell>
                    {hasGrade ? grade.grade!.toFixed(2) : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/courses/${courseUUID}/laboratories/${laboratoryUUID}/students/${grade.student_uuid}/edit-grade`}
                      aria-label={`Edit grade for student ${grade.student_full_name}`}
                      className={buttonVariants({ variant: "default" })}
                    >
                      <EditIcon className="mr-4" />
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No grades yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
