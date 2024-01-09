import {
  LaboratoryBlock,
  MarkdownBlock,
  TestBlock
} from "@/types/entities/laboratory-entities";

import { MarkdownPreviewBlock } from "./markdown-block/MarkdownPreviewBlock";
import { TestPreviewBlock } from "./test-block/TestPreviewBlock";

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
            <MarkdownPreviewBlock
              block={mdBlock}
              key={`block-${mdBlock.uuid}`}
            />
          );
        } else {
          const testBlock: TestBlock = block as TestBlock;
          return (
            <TestPreviewBlock
              block={testBlock}
              blockIndex={index}
              key={`block-${testBlock.uuid}`}
            />
          );
        }
      })}
    </section>
  );
};
