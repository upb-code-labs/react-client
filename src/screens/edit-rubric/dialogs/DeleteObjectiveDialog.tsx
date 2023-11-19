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
import { useEditRubricStore } from "@/stores/edit-rubric-store";
import { toast } from "sonner";

export const DeleteObjectiveDialog = () => {
  const {
    isDeleteObjectiveModalOpen,
    setIsDeleteObjectiveModalOpen,
    selectedObjectiveUUID,
    setSelectedObjectiveUUID
  } = useEditRubricModalsStore();

  const { deleteObjective } = useEditRubricStore();

  if (!selectedObjectiveUUID) return null;

  const handleCancel = () => {
    setSelectedObjectiveUUID(undefined);
  };

  const handleProceed = async () => {
    // Send request to delete the objective
    const { success, message } = await deleteObjectiveService(
      selectedObjectiveUUID
    );
    if (!success) {
      toast.error(message);
      return;
    }

    // Update modal state and show confirmation alert
    toast.success(message);
    deleteObjective(selectedObjectiveUUID);
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
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleProceed}>Proceed</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
