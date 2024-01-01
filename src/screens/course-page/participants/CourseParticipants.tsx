import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { getEnrolledStudentsService } from "@/services/courses/get-enrolled-students.service";
import { EnrolledStudent } from "@/types/entities/general-entities";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { CourseParticipantsTable } from "./components/CourseParticipantsTable";
import { EnrollStudentDialog } from "./dialogs/enroll-student/EnrollStudentDialog";

export const CourseParticipants = () => {
  const { courseUUID = "" } = useParams<{ courseUUID: string }>();
  const navigate = useNavigate();

  // Data state
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<EnrolledStudent[]>([]);

  // Table state
  const tableColumns = useMemo<ColumnDef<EnrolledStudent>[]>(
    () => [
      {
        accessorKey: "full_name",
        header: ({ column }) => {
          return <DataTableColumnHeader column={column} title="Full name" />;
        }
      },
      {
        accessorKey: "institutional_id",
        header: "Institutional Id"
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const student = row.original;
          console.log(student.is_active);
          return <Button variant={"destructive"}>Deactivate</Button>;
        }
      }
    ],
    []
  );

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    const { success, ...response } =
      await getEnrolledStudentsService(courseUUID);
    if (!success) {
      toast.error(response.message);
      navigate("/courses");
    }

    setStudents(response.students);
    setIsLoading(false);
  };

  // State modifiers
  const addStudent = (student: EnrolledStudent) => {
    setStudents((prev) => [...prev, student]);
  };

  return (
    <main className="md:col-span-3">
      <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
        <h1 className="my-4 text-3xl font-bold">Enrolled students</h1>
        <EnrollStudentDialog addStudentCallback={addStudent} />
      </div>
      <div className="mt-12 md:mt-4">
        <CourseParticipantsTable
          isLoading={isLoading}
          students={students}
          tableColsDefinition={tableColumns}
        />
      </div>
    </main>
  );
};
