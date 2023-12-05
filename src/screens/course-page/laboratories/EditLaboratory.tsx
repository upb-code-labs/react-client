import { LaboratoryDetails } from "@/components/EditLaboratory/LaboratoryDetails";
import { EditableMarkdownBlock } from "@/components/Markdown/EditableMarkdownBlock";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EditLaboratoryContext } from "@/context/laboratories/EditLaboratoryContext";
import { EditLaboratoryActionType } from "@/hooks/laboratories/editLaboratoryTypes";
import { createMarkdownBlockService } from "@/services/laboratories/add-markdown-block.service";
import { MarkdownBlock, TestBlock } from "@/types/entities/laboratory";
import { FlaskConical, TextCursor } from "lucide-react";
import { useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const EditLaboratory = () => {
  // Global laboratory state
  const { loading, laboratoryState, laboratoryStateDispatcher } = useContext(
    EditLaboratoryContext
  );
  const { laboratory } = laboratoryState;

  // Url params
  const { laboratoryUUID } = useParams<{ laboratoryUUID: string }>();

  // Callback handlers
  const onMarkdownBlockChange = useCallback((uuid: string, content: string) => {
    laboratoryStateDispatcher({
      type: EditLaboratoryActionType.UPDATE_MARKDOWN_BLOCK,
      payload: {
        uuid,
        content
      }
    });
  }, []);

  // TODO: Add loading skeleton
  if (loading) {
    return <p>Loading...</p>;
  }

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

  return (
    <main className="col-span-3">
      {/* Header to update base laboratory details */}
      <LaboratoryDetails
        laboratoryDetails={{
          ...laboratory
        }}
      />
      <Separator className="my-8" />

      {/* Laboratory blocks */}
      {laboratory.blocks.map((block) => {
        if (block.blockType === "markdown") {
          const mdBlock: MarkdownBlock = block as MarkdownBlock;
          return (
            <EditableMarkdownBlock
              key={mdBlock.uuid}
              blockUUID={mdBlock.uuid}
              blockContent={mdBlock.content}
              onChangeCallback={onMarkdownBlockChange}
            />
          );
        } else {
          // TODO: Handle test blocks
          const testBlock: TestBlock = block as TestBlock;
          return <p key={testBlock.uuid}>{testBlock.languageUUID}</p>;
        }
      })}

      {/* Buttons to add blocks */}
      <Button onClick={handleAddTextBlock}>
        <TextCursor className="mr-2" />
        Add text block
      </Button>

      <Button className="ml-4">
        <FlaskConical className="mr-2" />
        Add unit test block
      </Button>
    </main>
  );
};
