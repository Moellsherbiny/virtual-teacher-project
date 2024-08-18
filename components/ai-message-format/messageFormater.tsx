import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import remarkGfm from "remark-gfm";

const CodeBlock = ({
  language,
  value,
}: {
  language: string;
  value: string;
}) => {
  return (
    <div className="code-block-wrapper">
      <SyntaxHighlighter
        language={language}
        style={dracula}
        customStyle={{
          maxWidth: "100%",
          overflowX: "auto",
          fontSize: "0.8rem",
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export const renderMessageContent = (content: string) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]+?)\n```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push(
        <Markdown key={lastIndex} remarkPlugins={[remarkGfm]}>
          {content.slice(lastIndex, match.index)}
        </Markdown>
      );
    }

    // Add code block
    const [, language, code] = match;
    parts.push(
      <CodeBlock
        key={match.index}
        language={language || "javascript"}
        value={code.trim()}
      />
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last code block
  if (lastIndex < content.length) {
    parts.push(
      <Markdown key={lastIndex} remarkPlugins={[remarkGfm]}>
        {content.slice(lastIndex)}
      </Markdown>
    );
  }

  return parts;
};