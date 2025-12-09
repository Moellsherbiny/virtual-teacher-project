import React from 'react';
import ReactMarkdown from 'react-markdown';

interface LessonContentProps {
  content: string;
}

export default function LessonContent({ content }: LessonContentProps) {
  return (
    <div className="prose">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
