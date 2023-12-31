import { TestBlock } from "@/types/entities/laboratory-entities";

import { EditableTestBlockForm } from "./EditableTestBlockForm";

interface EditableTestBlockProps {
  testBlock: TestBlock;
  blockIndex: number;
}

export const EditableTestBlock = ({
  testBlock,
  blockIndex
}: EditableTestBlockProps) => {
  return (
    <EditableTestBlockForm testBlock={testBlock} blockIndex={blockIndex} />
  );
};
