import React from "react";
import Markdown from "react-markdown";

export function HighlightedMarkdown({ children, highlightColor }) {
  return (
    <Markdown
      components={{
        p: React.Fragment,
        strong: ({ children }) => (
          <strong
            style={{
              color: highlightColor,
            }}
          >
            {children}
          </strong>
        ),
      }}
    >
      {children}
    </Markdown>
  );
}