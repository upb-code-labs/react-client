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
import { deleteRubricService } from "@/services/rubrics/delete-rubric.service";
import { CreatedRubric } from "@/types/entities/rubric-entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface deleteRubricDialogProps {
  rubricUUID: string | undefined;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
}

export const DeleteRubricDialog = ({
  rubricUUID,
  isDialogOpen,
  setIsDialogOpen
}: deleteRubricDialogProps) => {
  // Delete rubric mutation
  const queryClient = useQueryClient();
  const { mutate: deleteRubricMutation } = useMutation({
    mutationFn: deleteRubricService,
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(_, rubricUUID) {
      // Update the rubrics query
      queryClient.setQueryData(["rubrics"], (oldData: CreatedRubric[]) => {
        return oldData.filter((rubric) => rubric.uuid !== rubricUUID);
      });

      // Show a toast
      toast.success("The rubric has been deleted");

      // Close the dialog
      setIsDialogOpen(false);
    }
  });

  // Prevent the dialog from being rendered if there is no rubric selected
  if (!rubricUUID) return null;

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this rubric?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Removing this rubric could affect
            students' grades if this rubric was used to grade any submissions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteRubricMutation(rubricUUID)}>
            Proceed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
