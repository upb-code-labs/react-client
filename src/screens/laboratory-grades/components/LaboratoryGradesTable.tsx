import { Button } from "@/components/ui/button";
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

interface LaboratoryGradesTableProps {
  laboratoryUUID: string;
  grades: summarizedGradeDTO[];
}

export const LaboratoryGradesTable = ({
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
            grades.map((grade) => (
              <TableRow key={`${laboratoryUUID}-${grade.student_uuid}-grade`}>
                <TableCell>{grade.student_full_name}</TableCell>
                <TableCell>
                  {grade.grade ? grade.grade.toFixed(2) : "N/A"}
                </TableCell>
                <TableCell>
                  <Button>
                    <EditIcon className="mr-4" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
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
