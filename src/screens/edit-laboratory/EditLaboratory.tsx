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
import { Suspense, useContext } from "react";
import { lazily } from "react-lazily";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { LaboratoryBlockSkeleton } from "../../components/Skeletons/LaboratoryBlockSkeleton";
import { CreateTestBlockDialog } from "./dialogs/CreateTestBlockDialog";
import { LaboratoryDetailsSkeleton } from "./skeletons/LaboratoryDetailsSkeleton";

const { LaboratoryDetails } = lazily(
  () => import("./components/LaboratoryDetails")
);
const { TeacherLaboratoryBlocks } = lazily(
  () => import("./components/TeacherLaboratoryBlocks")
);

export const EditLaboratory = () => {
  // Global laboratory state
  const { loading, laboratoryState, laboratoryStateDispatcher } = useContext(
    EditLaboratoryContext
  );
  const { laboratory } = laboratoryState;

  // Url params
  const { laboratoryUUID } = useParams<{ laboratoryUUID: string }>();

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

  if (loading) return <EditLaboratoryPageSkeleton />;

  if (!laboratory) return null;

  return (
    <main className="col-span-3">
      {/* Header to update base laboratory details */}
      <Suspense fallback={<LaboratoryDetailsSkeleton />}>
        <LaboratoryDetails
          laboratoryDetails={{
            ...laboratory
          }}
        />
      </Suspense>

      {/* Horizontal line to separate the content */}
      <Separator className="my-8" />

      {/* Laboratory blocks */}
      <Suspense
        fallback={
          <>
            <LaboratoryBlockSkeleton />
            <LaboratoryBlockSkeleton />
          </>
        }
      >
        <TeacherLaboratoryBlocks blocks={laboratory.blocks} />
      </Suspense>

      {/* Buttons to add blocks */}
      <Button onClick={handleAddTextBlock}>
        <TextCursor className="mr-2" />
        Add text block
      </Button>
      <CreateTestBlockDialog />
    </main>
  );
};
