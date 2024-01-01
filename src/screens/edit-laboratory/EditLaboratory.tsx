import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EditLaboratoryContext } from "@/context/laboratories/EditLaboratoryContext";
import { EditLaboratoryActionType } from "@/hooks/laboratories/editLaboratoryTypes";
import { EditLaboratoryPageSkeleton } from "@/screens/edit-laboratory/skeletons/EditLaboratoryPageSkeleton";
import { createMarkdownBlockService } from "@/services/laboratories/add-markdown-block.service";
import { TextCursor } from "lucide-react";
import { Suspense, useContext } from "react";
import { lazily } from "react-lazily";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { CreateTestBlockDialog } from "./dialogs/CreateTestBlockDialog";
import { LaboratoryBlockSkeleton } from "./skeletons/LaboratoryBlockSkeleton";
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

  // Handlers
  const handleAddTextBlock = async () => {
    const { success, message, uuid } = await createMarkdownBlockService(
      laboratoryUUID as string
    );
    if (!success) {
      toast.error(message);
      return;
    }

    toast.success(message);
    laboratoryStateDispatcher({
      type: EditLaboratoryActionType.ADD_MARKDOWN_BLOCK,
      payload: {
        uuid
      }
    });
  };

  if (!laboratory) return null;

  if (loading) return <EditLaboratoryPageSkeleton />;

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
