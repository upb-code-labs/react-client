import { LaboratoryBlockSkeleton } from "@/components/Skeletons/LaboratoryBlockSkeleton";
import {
  LaboratoryBlock,
  MarkdownBlock
} from "@/types/entities/laboratory-entities";
import { Suspense } from "react";
import { lazily } from "react-lazily";

const { MarkdownPreviewBlock } = lazily(
  () => import("./markdown-block/MarkdownPreviewBlock")
);

interface StudentLaboratoryBlocksProps {
  blocks: LaboratoryBlock[];
}

export const StudentLaboratoryBlocks = ({
  blocks
}: StudentLaboratoryBlocksProps) => {
  return (
    <section className="grid gap-8">
      {blocks.map((block) => {
        if (block.blockType === "markdown") {
          const mdBlock: MarkdownBlock = block as MarkdownBlock;
          return (
            <Suspense fallback={<LaboratoryBlockSkeleton />}>
              <MarkdownPreviewBlock block={mdBlock} />
            </Suspense>
          );
        } else {
          return (
            <div key={`test-preview-block-${block.uuid}`}>
              <h1>Test Block</h1>
            </div>
          );
        }
      })}
    </section>
  );
};
