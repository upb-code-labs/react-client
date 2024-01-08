import { LaboratoryBlockSkeleton } from "@/components/Skeletons/LaboratoryBlockSkeleton";
import {
  LaboratoryBlock,
  MarkdownBlock,
  TestBlock
} from "@/types/entities/laboratory-entities";
import { Suspense } from "react";
import { lazily } from "react-lazily";

const { MarkdownPreviewBlock } = lazily(
  () => import("./markdown-block/MarkdownPreviewBlock")
);

const { TestPreviewBlock } = lazily(
  () => import("./test-block/TestPreviewBlock")
);

interface StudentLaboratoryBlocksProps {
  blocks: LaboratoryBlock[];
}

export const StudentLaboratoryBlocks = ({
  blocks
}: StudentLaboratoryBlocksProps) => {
  return (
    <section className="grid gap-8">
      {blocks.map((block, index) => {
        if (block.blockType === "markdown") {
          const mdBlock: MarkdownBlock = block as MarkdownBlock;
          return (
            <Suspense
              fallback={<LaboratoryBlockSkeleton />}
              key={`block-${mdBlock.uuid}-suspense`}
            >
              <MarkdownPreviewBlock
                block={mdBlock}
                key={`block-${mdBlock.uuid}`}
              />
            </Suspense>
          );
        } else {
          const testBlock: TestBlock = block as TestBlock;
          return (
            <Suspense
              fallback={<LaboratoryBlockSkeleton />}
              key={`block-${testBlock.uuid}-suspense`}
            >
              <TestPreviewBlock
                block={testBlock}
                blockIndex={index}
                key={`block-${testBlock.uuid}`}
              />
            </Suspense>
          );
        }
      })}
    </section>
  );
};
