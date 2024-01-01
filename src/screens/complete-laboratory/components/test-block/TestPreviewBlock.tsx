import { TestBlock } from "@/types/entities/laboratory-entities";

import { TestPreviewBlockForm } from "./TestPreviewBlockForm";

interface TestPreviewBlockProps {
  block: TestBlock;
  blockIndex: number;
}

export const TestPreviewBlock = ({
  block,
  blockIndex
}: TestPreviewBlockProps) => {
  return (
    <div className="rounded-sm border p-4">
      <TestPreviewBlockForm testBlock={block} blockIndex={blockIndex} />
    </div>
  );
};
