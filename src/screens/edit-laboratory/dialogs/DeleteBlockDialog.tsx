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
import { EditLaboratoryContext } from "@/context/laboratories/EditLaboratoryContext";
import { EditLaboratoryActionType } from "@/hooks/laboratories/editLaboratoryTypes";
import { deleteMarkdownBlockService } from "@/services/blocks/delete-markdown-block.service";
import { deleteTestBlockService } from "@/services/blocks/delete-test-block.service";
import { BlockType, Laboratory } from "@/types/entities/laboratory-entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "sonner";

interface DeleteBlockDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  blockUUID: string;
  blockType: BlockType;
}

const dialogTexts = {
  markdown: {
    title: "Are you sure you want to delete this markdown block?",
    description:
      "This action cannot be undone. Your students will no longer see the content of this block."
  },
  test: {
    title: "Are you sure you want to delete this test block?",
    description:
      "This action cannot be undone. Your students will no longer be able to submit their code to this block and their submissions will be deleted too."
  }
};

export const DeleteBlockDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  blockUUID,
  blockType
}: DeleteBlockDialogProps) => {
  console.log({ blockUUID });

  // Global laboratory state
  const { laboratoryStateDispatcher, laboratoryState } = useContext(
    EditLaboratoryContext
  );
  const { laboratory } = laboratoryState;

  // Delete block mutation
  const queryClient = useQueryClient();
  const { mutate: deleteTestBlockMutation } = useMutation({
    mutationFn:
      blockType === "test"
        ? deleteTestBlockService
        : deleteMarkdownBlockService,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      // Update the global laboratory state
      laboratoryStateDispatcher({
        type: EditLaboratoryActionType.DELETE_BLOCK,
        payload: {
          uuid: blockUUID
        }
      });

      // Show success message
      toast.success("The block has been deleted successfully");

      // Update the laboratory query
      queryClient.setQueryData(
        ["laboratory", laboratory!.uuid],
        (oldData: Laboratory) => {
          return {
            ...oldData,
            blocks: oldData.blocks.filter((b) => b.uuid !== blockUUID)
          };
        }
      );
    }
  });

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTexts[blockType].title}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialogTexts[blockType].description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteTestBlockMutation(blockUUID)}>
            Proceed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
