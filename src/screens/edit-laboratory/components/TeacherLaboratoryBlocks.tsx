import { EditLaboratoryContext } from "@/context/laboratories/EditLaboratoryContext";
import { EditLaboratoryActionType } from "@/hooks/laboratories/editLaboratoryTypes";
import {
  LaboratoryBlock,
  MarkdownBlock,
  TestBlock
} from "@/types/entities/laboratory-entities";
import { useCallback, useContext } from "react";

import { EditableMarkdownBlock } from "./markdown-block/EditableMarkdownBlock";
import { EditableTestBlock } from "./test-block/EditableTestBlock";

interface TeacherLaboratoryBlocksProps {
  blocks: LaboratoryBlock[];
}

export const TeacherLaboratoryBlocks = ({
  blocks
}: TeacherLaboratoryBlocksProps) => {
  // Global laboratory state
  const { laboratoryStateDispatcher } = useContext(EditLaboratoryContext);

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

  return (
    <section>
      {blocks.map((block, index) => {
        if (block.blockType === "markdown") {
          const mdBlock: MarkdownBlock = block as MarkdownBlock;
          return (
            <EditableMarkdownBlock
              key={`editable-markdown-block-${mdBlock.uuid}`}
              blockIndex={index}
              blockUUID={mdBlock.uuid}
              blockContent={mdBlock.content}
              onChangeCallback={onMarkdownBlockChange}
            />
          );
        } else {
          const testBlock: TestBlock = block as TestBlock;
          return (
            <EditableTestBlock
              key={`editable-test-block-${testBlock.uuid}`}
              blockIndex={index}
              testBlock={testBlock}
            />
          );
        }
      })}
    </section>
  );
};
