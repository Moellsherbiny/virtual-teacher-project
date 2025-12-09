import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface MarkdownPreviewProps {
  source: string;
}

export default function MarkdownPreview({ source }: MarkdownPreviewProps) {
  return (
    <ReactMarkdown
    
      className="markdown-preview"
     
    >
      {source}
    </ReactMarkdown>
  );
}