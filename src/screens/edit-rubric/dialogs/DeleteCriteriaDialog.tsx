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
import { useEditRubricStore } from "@/stores/edit-rubric-store";
import { toast } from "sonner";

export const DeleteCriteriaDialog = () => {
  const {
    isDeleteCriteriaModalOpen,
    setIsDeleteCriteriaModalOpen,
    selectedCriteriaUUID,
    setSelectedCriteriaUUID
  } = useEditRubricModalsStore();

  const { deleteCriteria } = useEditRubricStore();

  if (!selectedCriteriaUUID) return null;

  const handleCancel = () => {
    setSelectedCriteriaUUID(undefined);
  };

  const handleProceed = async () => {
    // Send request to delete criteria
    const { success, message } =
      await deleteCriteriaService(selectedCriteriaUUID);
    if (!success) {
      toast.error(message);
      return;
    }

    // Update modal state and show confirmation alert
    toast.success(message);
    deleteCriteria(selectedCriteriaUUID);
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
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleProceed}>Proceed</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
