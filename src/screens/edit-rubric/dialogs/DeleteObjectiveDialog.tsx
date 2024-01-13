import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { deleteObjectiveService } from "@/services/rubrics/delete-objective.service";
import { useEditRubricModalsStore } from "@/stores/edit-rubric-modals-store";
import { Rubric } from "@/types/entities/rubric-entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteObjectiveDialogProps {
  rubricUUID: string;
}

export const DeleteObjectiveDialog = ({
  rubricUUID
}: DeleteObjectiveDialogProps) => {
  // Modal state
  const {
    isDeleteObjectiveModalOpen,
    setIsDeleteObjectiveModalOpen,
    selectedObjectiveUUID,
    setSelectedObjectiveUUID
  } = useEditRubricModalsStore();

  // Delete objective mutation
  const queryClient = useQueryClient();
  const { mutate: deleteObjectiveMutation } = useMutation({
    mutationFn: deleteObjectiveService,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (_ctx, objectiveUUID: string) => {
      // Show a success toast
      toast.success("Objective deleted successfully");

      // Update rubric query
      queryClient.setQueryData(["rubric", rubricUUID], (oldData: Rubric) => {
        return {
          ...oldData,
          objectives: oldData.objectives?.filter(
            (objective) => objective.uuid !== objectiveUUID
          )
        };
      });

      // Update modals state
      handleCloseDialog();
    }
  });

  if (!selectedObjectiveUUID) return null;

  const handleCloseDialog = () => {
    setIsDeleteObjectiveModalOpen(false);
    setSelectedObjectiveUUID(undefined);
  };

  return (
    <AlertDialog
      open={isDeleteObjectiveModalOpen}
      onOpenChange={setIsDeleteObjectiveModalOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this objective?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Removing this objective could affect
            students' grades if any of the criteria in this objective were used
            to grade any submissions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCloseDialog}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteObjectiveMutation(selectedObjectiveUUID)}
          >
            Proceed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
