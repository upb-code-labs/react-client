import { GenericTableSkeleton } from "@/components/Skeletons/GenericTableSkeleton";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useSession } from "@/hooks/useSession";
import { LaboratoryBaseInfo } from "@/types/entities/laboratory-entities";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BookOpenCheck, Edit } from "lucide-react";
import { Link, useParams } from "react-router-dom";

dayjs.extend(relativeTime);

interface courseLaboratoriesTableProps {
  loading: boolean;
  laboratories: LaboratoryBaseInfo[];
}

export const CourseLaboratoriesTable = ({
  loading,
  laboratories
}: courseLaboratoriesTableProps) => {
  const { user } = useSession();
  const { courseUUID } = useParams<{ courseUUID: string }>();

  if (loading) {
    return (
      <GenericTableSkeleton
        headers={["Name", "Opening date", "Due date", "Actions"]}
        columns={4}
        rows={8}
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Opening date</TableHead>
            <TableHead>Due date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {laboratories.length ? (
            laboratories.map((lab) => (
              <TableRow key={lab.uuid}>
                <TableCell>{lab.name}</TableCell>
                <TableCell className="first-letter:uppercase">
                  {dayjs(lab.opening_date).fromNow()}
                </TableCell>
                <TableCell className="first-letter:capitalize">
                  {dayjs(lab.due_date).fromNow()}
                </TableCell>
                <TableCell>
                  {user?.role === "teacher" ? (
                    <>
                      <Link
                        className={buttonVariants({ variant: "default" })}
                        aria-label={`Edit ${lab.name} laboratory`}
                        to={`/courses/${courseUUID}/laboratories/${lab.uuid}/edit`}
                      >
                        <Edit className="mr-2" /> Edit
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        aria-label={`Complete ${lab.name} laboratory`}
                        className={buttonVariants({ variant: "default" })}
                        to={`/courses/${courseUUID}/laboratories/${lab.uuid}/complete`}
                      >
                        <BookOpenCheck className="mr-2" /> Complete
                      </Link>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
