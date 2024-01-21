import { GenericTableSkeleton } from "@/components/Skeletons/GenericTableSkeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { CreatedRubric } from "@/types/entities/rubric-entities";
import { PenSquareIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { DeleteRubricDialog } from "../dialogs/DeleteRubricDialog";

interface rubricsTableProps {
  isLoading: boolean;
  rubrics: CreatedRubric[] | undefined;
}

type deleteRubricDialogState = {
  isDeleteRubricModalOpen: boolean;
  selectedRubricUUID: string | undefined;
};

export const RubricsTable = ({ isLoading, rubrics }: rubricsTableProps) => {
  // Deletion dialog state
  const [deleteRubricDialogState, setDeleteRubricDialogState] =
    useState<deleteRubricDialogState>({
      isDeleteRubricModalOpen: false,
      selectedRubricUUID: undefined
    });

  const { selectedRubricUUID, isDeleteRubricModalOpen } =
    deleteRubricDialogState;

  const setIsDeleteRubricModalOpen = (isOpen: boolean) => {
    setDeleteRubricDialogState((prevState) => ({
      ...prevState,
      isDeleteRubricModalOpen: isOpen
    }));
  };

  // Handle loading state
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
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rubrics?.length ? (
              rubrics.map((rubric) => (
                <TableRow key={`rubric-${rubric.uuid}`}>
                  <TableCell className="line-clamp-1">{rubric.name}</TableCell>
                  <TableCell className="w-min">
                    <div className="flex max-w-sm flex-wrap gap-4">
                      <Link
                        to={`/rubrics/${rubric.uuid}`}
                        aria-label={`Edit ${rubric.name}`}
                        className={buttonVariants({ variant: "default" })}
                      >
                        <PenSquareIcon className="mr-2" />
                        Edit
                      </Link>
                      <Button
                        variant="destructive"
                        aria-label={`Delete ${rubric.name}`}
                        onClick={() => {
                          setDeleteRubricDialogState((prevState) => ({
                            ...prevState,
                            selectedRubricUUID: rubric.uuid,
                            isDeleteRubricModalOpen: true
                          }));
                        }}
                      >
                        <TrashIcon className="mr-2" />
                        Delete
                      </Button>
                    </div>
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
      <DeleteRubricDialog
        rubricUUID={selectedRubricUUID}
        isDialogOpen={isDeleteRubricModalOpen}
        setIsDialogOpen={setIsDeleteRubricModalOpen}
      />
    </>
  );
};
