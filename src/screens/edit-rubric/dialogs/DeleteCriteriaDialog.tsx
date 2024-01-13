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
import { deleteCriteriaService } from "@/services/rubrics/delete-criteria.service";
import { useEditRubricModalsStore } from "@/stores/edit-rubric-modals-store";
import { Rubric } from "@/types/entities/rubric-entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteCriteriaDialogProps {
  rubricUUID: string;
}

export const DeleteCriteriaDialog = ({
  rubricUUID
}: DeleteCriteriaDialogProps) => {
  // Dialog state
  const {
    isDeleteCriteriaModalOpen,
    setIsDeleteCriteriaModalOpen,
    selectedCriteriaUUID,
    setSelectedCriteriaUUID
  } = useEditRubricModalsStore();

  // Delete criteria mutation
  const queryClient = useQueryClient();

  const { mutate: deleteCriteriaMutation } = useMutation({
    mutationFn: (criteriaUUID: string) => deleteCriteriaService(criteriaUUID),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (_ctx, criteriaUUID: string) => {
      // Show a success toast
      toast.success("Criteria deleted successfully");

      // Update rubric query
      queryClient.setQueryData(["rubric", rubricUUID], (oldData: Rubric) => {
        return {
          ...oldData,
          objectives: oldData.objectives?.map((objective) => {
            return {
              ...objective,
              criteria: objective.criteria?.filter(
                (criteria) => criteria.uuid !== criteriaUUID
              )
            };
          })
        };
      });

      // Update modals state
      handleCloseDialog();
    }
  });

  if (!selectedCriteriaUUID) return null;

  const handleCloseDialog = () => {
    setIsDeleteCriteriaModalOpen(false);
    setSelectedCriteriaUUID(undefined);
  };

  return (
    <AlertDialog
      open={isDeleteCriteriaModalOpen}
      onOpenChange={setIsDeleteCriteriaModalOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this criteria?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Removing this criteria could affect
            students' grades if this criteria was used to grade any submissions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCloseDialog}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteCriteriaMutation(selectedCriteriaUUID)}
          >
            Proceed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
