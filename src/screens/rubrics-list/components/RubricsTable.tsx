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
import { CreatedRubric } from "@/types/entities/rubric-entities";
import { PenSquareIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface rubricsTableProps {
  isLoading: boolean;
  rubrics: CreatedRubric[];
}

export const RubricsTable = ({ isLoading, rubrics }: rubricsTableProps) => {
  if (isLoading) {
    return (
      <GenericTableSkeleton
        columns={2}
        rows={4}
        headers={["Name", "Options"]}
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Options</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rubrics.length ? (
            rubrics.map((rubric) => (
              <TableRow key={rubric.uuid}>
                <TableCell className="line-clamp-1">{rubric.name}</TableCell>
                <TableCell>
                  <Link
                    to={`/rubrics/${rubric.uuid}`}
                    aria-label={`Edit ${rubric.name}`}
                    className={buttonVariants({ variant: "default" })}
                  >
                    <PenSquareIcon className="mr-2" />
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
