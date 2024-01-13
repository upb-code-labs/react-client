import { GenericTableSkeleton } from "@/components/Skeletons/GenericTableSkeleton";
import { DataTable } from "@/components/ui/data-table";
import { EnrolledStudent } from "@/types/entities/general-entities";
import { ColumnDef } from "@tanstack/react-table";

interface CourseParticipantsTableProps {
  isLoading: boolean;
  tableColsDefinition: ColumnDef<EnrolledStudent>[];
  students: EnrolledStudent[] | undefined;
}

export const CourseParticipantsTable = ({
  isLoading,
  tableColsDefinition,
  students
}: CourseParticipantsTableProps) => {
  if (isLoading) {
    return (
      <GenericTableSkeleton
        columns={3}
        rows={4}
        headers={["Full name", "Institutional Id", "Actions"]}
      />
    );
  }

  // TODO: Show the error component if the students data is not available
  if (!students) return null;

  return <DataTable columns={tableColsDefinition} data={students} />;
};
