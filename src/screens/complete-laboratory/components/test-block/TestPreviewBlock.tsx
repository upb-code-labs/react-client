import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestBlock } from "@/types/entities/laboratory-entities";
import { useState } from "react";

import { TestPreviewBlockForm } from "./TestPreviewBlockForm";
import { TestStatus } from "./TestStatus";

interface TestPreviewBlockProps {
  laboratoryUUID: string;
  block: TestBlock;
  blockIndex: number;
}

export const TestPreviewBlock = ({
  laboratoryUUID,
  block,
  blockIndex
}: TestPreviewBlockProps) => {
  const defaultActiveTab = `${block.uuid}-form`;
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  return (
    <Tabs className="rounded-sm border p-4" value={activeTab}>
      <TabsList className="mb-2">
        <TabsTrigger
          value={`${block.uuid}-form`}
          onClick={() => setActiveTab(`${block.uuid}-form`)}
          aria-label={`Test block ${blockIndex + 1} submission form`}
        >
          Submission Form
        </TabsTrigger>
        <TabsTrigger
          value={`${block.uuid}-status`}
          onClick={() => setActiveTab(`${block.uuid}-status`)}
          aria-label={`Test block ${blockIndex + 1} submission status`}
        >
          Submission Status
        </TabsTrigger>
      </TabsList>
      <TabsContent value={`${block.uuid}-form`}>
        <TestPreviewBlockForm
          laboratoryUUID={laboratoryUUID}
          testBlock={block}
          blockIndex={blockIndex}
          changeToStatusTabCallback={() => setActiveTab(`${block.uuid}-status`)}
        />
      </TabsContent>
      <TabsContent value={`${block.uuid}-status`}>
        <TestStatus
          testBlock={block}
          blockIndex={blockIndex}
          changeToFormTabCallback={() => setActiveTab(`${block.uuid}-form`)}
        />
      </TabsContent>
    </Tabs>
  );
};
