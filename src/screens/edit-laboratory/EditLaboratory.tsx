import { CustomError } from "@/components/CustomError";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EditLaboratoryContext } from "@/context/laboratories/EditLaboratoryContext";
import { EditLaboratoryActionType } from "@/hooks/laboratories/editLaboratoryTypes";
import { EditLaboratoryPageSkeleton } from "@/screens/edit-laboratory/skeletons/EditLaboratoryPageSkeleton";
import { createMarkdownBlockService } from "@/services/laboratories/add-markdown-block.service";
import {
  Laboratory,
  MarkdownBlock
} from "@/types/entities/laboratory-entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TextCursor } from "lucide-react";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { LaboratoryDetails } from "./components/LaboratoryDetails";
import { TeacherLaboratoryBlocks } from "./components/TeacherLaboratoryBlocks";
import { CreateTestBlockDialog } from "./dialogs/CreateTestBlockDialog";

export const EditLaboratory = () => {
  // Global laboratory state
  const {
    loading,
    isError,
    error,
    laboratoryState,
    laboratoryStateDispatcher
  } = useContext(EditLaboratoryContext);
  const { laboratory } = laboratoryState;

  // Url params
  const { courseUUID, laboratoryUUID } = useParams<{
    courseUUID: string;
    laboratoryUUID: string;
  }>();

  // Create markdown block mutation
  const queryClient = useQueryClient();
  const { mutate: createMarkdownBlockMutation } = useMutation({
    mutationFn: createMarkdownBlockService,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (createdBlockUUID) => {
      // Update the global state
      laboratoryStateDispatcher({
        type: EditLaboratoryActionType.ADD_MARKDOWN_BLOCK,
        payload: {
          uuid: createdBlockUUID
        }
      });

      // Update the laboratory query
      const newMarkdownBlock: MarkdownBlock = {
        uuid: createdBlockUUID,
        content: "",
        index: laboratory!.blocks.length,
        blockType: "markdown"
      };

      queryClient.setQueryData(
        ["laboratory", laboratoryUUID],
        (oldData: Laboratory) => {
          return {
            ...oldData,
            blocks: [...oldData.blocks, newMarkdownBlock]
          };
        }
      );

      // Show success message
      toast.success("The new markdown block has been created successfully");
    }
  });

  const handleAddTextBlock = () => {
    createMarkdownBlockMutation(laboratoryUUID!);
  };

  // Handle loading state
  if (loading) return <EditLaboratoryPageSkeleton />;

  // Handle error state
  if (isError) {
    toast.error(error!.message);

    return (
      <div className="col-span-3">
        <CustomError
          message={error!.message}
          redirectTo={`/courses/${courseUUID}/laboratories`}
          redirectText="Go back to laboratories"
        />
      </div>
    );
  }

  // Show an error if the laboratory is not loading but is undefined
  if (!laboratory) {
    return (
      <div className="col-span-3">
        <CustomError
          message="We couldn't get the laboratory you are looking for."
          redirectTo={`/courses/${courseUUID}/laboratories`}
          redirectText="Go back to laboratories"
        />
      </div>
    );
  }

  return (
    <main className="col-span-3">
      <LaboratoryDetails
        laboratoryDetails={{
          ...laboratory
        }}
      />
      <Separator className="my-8" />
      <TeacherLaboratoryBlocks blocks={laboratory.blocks} />

      {/* Buttons to add blocks */}
      <Button onClick={handleAddTextBlock}>
        <TextCursor className="mr-2" />
        Add text block
      </Button>
      <CreateTestBlockDialog />
    </main>
  );
};
