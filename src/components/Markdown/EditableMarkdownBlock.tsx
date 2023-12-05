import MDEditor from "@uiw/react-md-editor";
import { memo } from "react";
import rehypeSanitize from "rehype-sanitize";

import { MarkdownBlockDropDown } from "./MarkdownBlockDropDown";

interface EditableMarkdownBlockProps {
  blockUUID: string;
  blockIndex: number;
  blockContent: string;
  onChangeCallback: (uuid: string, content: string) => void;
}

export const EditableMarkdownBlock = memo(
  ({
    blockUUID,
    blockIndex,
    blockContent,
    onChangeCallback
  }: EditableMarkdownBlockProps) => {
    return (
      <div className="col-span-3 my-8 flex gap-1">
        <MDEditor
          value={blockContent}
          onChange={(value, _viewUpdate) => {
            onChangeCallback(blockUUID, value || "");
          }}
          textareaProps={{
            "aria-label": `Laboratory block ${blockIndex + 1} markdown content`
          }}
          data-color-mode="light"
          className="markdown-editor flex-grow"
          minHeight={350}
          height="100%"
          visibleDragbar={false}
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]]
          }}
        />
        <MarkdownBlockDropDown blockUUID={blockUUID} blockIndex={blockIndex} />
      </div>
    );
  }
);
