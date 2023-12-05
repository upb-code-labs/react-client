import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import rehypeSanitize from "rehype-sanitize";

export const EditableMarkdownBlock = () => {
  const [value, setValue] = useState("");

  return (
    <div className="col-span-3">
      <MDEditor
        value={value}
        onChange={(value, _viewUpdate) => setValue(value || "")}
        data-color-mode="light"
        className="markdown-editor"
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]]
        }}
      />
    </div>
  );
};
