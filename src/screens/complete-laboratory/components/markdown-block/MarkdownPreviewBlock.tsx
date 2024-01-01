import { MarkdownBlock } from "@/types/entities/laboratory-entities";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSanitize from "rehype-sanitize";

const rehypePlugins = [
  rehypeSanitize,
  () =>
    rehypeExternalLinks({
      rel: ["noopener", "noreferrer", "nofollow"],
      target: "_blank"
    })
];

interface MarkdownPreviewBlockProps {
  block: MarkdownBlock;
}

export const MarkdownPreviewBlock = ({ block }: MarkdownPreviewBlockProps) => {
  return (
    <article className="rounded-md border p-4">
      <MarkdownPreview
        rehypePlugins={rehypePlugins}
        source={block.content}
        data-color-mode="light"
      />
    </article>
  );
};
