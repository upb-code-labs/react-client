import { CustomError } from "@/components/CustomError";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { getEnrolledStudentsService } from "@/services/courses/get-enrolled-students.service";
import { EnrolledStudent } from "@/types/entities/general-entities";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { CourseParticipantsTable } from "./components/CourseParticipantsTable";
import { EnrollStudentDialog } from "./dialogs/enroll-student/EnrollStudentDialog";

export const CourseParticipants = () => {
  const { courseUUID = "" } = useParams<{ courseUUID: string }>();

  // Data state
  const {
    data: students,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["course-students", courseUUID],
    queryFn: () => getEnrolledStudentsService(courseUUID)
  });

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

  // Error handling
  if (isError) {
    toast.error(error!.message);

    return (
      <div className="md:col-span-3">
        <CustomError
          message={error!.message}
          redirectText="Go back to course laboratories"
          redirectTo={`/courses/${courseUUID}/laboratories`}
        />
      </div>
    );
  }

  return (
    <main className="md:col-span-3">
      <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
        <h1 className="my-4 text-3xl font-bold">Enrolled students</h1>
        <EnrollStudentDialog />
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
