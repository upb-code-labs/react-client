import { TestBlock } from "@/types/entities/laboratory-entities";

import { EditableTestBlockForm } from "./EditableTestBlockForm";

interface EditableTestBlockProps {
  testBlock: TestBlock;
}

export const EditableTestBlock = ({ testBlock }: EditableTestBlockProps) => {
  return <EditableTestBlockForm testBlock={testBlock} />;
};
