import { EditLaboratoryContext } from "@/context/laboratories/EditLaboratoryContext";
import { EditLaboratoryActionType } from "@/hooks/laboratories/editLaboratoryTypes";
import {
  LaboratoryBlock,
  MarkdownBlock,
  TestBlock
} from "@/types/entities/laboratory-entities";
import { Suspense, useCallback, useContext } from "react";
import { lazily } from "react-lazily";

import { LaboratoryBlockSkeleton } from "../skeletons/LaboratoryBlockSkeleton";

const { EditableMarkdownBlock } = lazily(
  () => import("./markdown-block/EditableMarkdownBlock")
);

const { EditableTestBlock } = lazily(
  () => import("./test-block/EditableTestBlock")
);

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
            <Suspense fallback={<LaboratoryBlockSkeleton />}>
              <EditableMarkdownBlock
                key={mdBlock.uuid}
                blockIndex={index}
                blockUUID={mdBlock.uuid}
                blockContent={mdBlock.content}
                onChangeCallback={onMarkdownBlockChange}
              />
            </Suspense>
          );
        } else {
          const testBlock: TestBlock = block as TestBlock;
          return (
            <Suspense fallback={<LaboratoryBlockSkeleton />}>
              <EditableTestBlock
                key={testBlock.uuid}
                blockIndex={index}
                testBlock={testBlock}
              />
            </Suspense>
          );
        }
      })}
    </section>
  );
};
