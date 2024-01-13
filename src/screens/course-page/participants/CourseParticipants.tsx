import { CustomError } from "@/components/CustomError";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { getEnrolledStudentsService } from "@/services/courses/get-enrolled-students.service";
import { setStudentEnrollmentStatusService } from "@/services/courses/set-student-enrollment-status.service";
import { EnrolledStudent } from "@/types/entities/general-entities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { UserRoundCheckIcon, UserRoundXIcon } from "lucide-react";
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

  // Toggle student status mutation
  const queryClient = useQueryClient();
  const { mutate: toggleStudentStatusMutation } = useMutation({
    mutationFn: setStudentEnrollmentStatusService,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (_, { toActive, studentUUID }) => {
      // Update course students query
      queryClient.setQueryData(
        ["course-students", courseUUID],
        (oldData: EnrolledStudent[] | undefined) => {
          return oldData?.map((student) => {
            if (student.uuid !== studentUUID) return student;

            return {
              ...student,
              is_active: toActive
            };
          });
        }
      );

      // Show success toast
      toast.success(
        `Student ${toActive ? "activated" : "deactivated"} successfully`
      );
    }
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
          const { is_active } = student;
          return (
            <Button
              variant={is_active ? "destructive" : "default"}
              aria-label={
                is_active
                  ? `Deactivate ${student.full_name}`
                  : `Activate ${student.full_name}`
              }
              onClick={() => {
                toggleStudentStatusMutation({
                  courseUUID,
                  studentUUID: student.uuid,
                  toActive: !is_active
                });
              }}
            >
              {is_active ? (
                <UserRoundXIcon className="mr-2" />
              ) : (
                <UserRoundCheckIcon className="mr-2" />
              )}
              {is_active ? "Deactivate" : "Activate"}
            </Button>
          );
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
