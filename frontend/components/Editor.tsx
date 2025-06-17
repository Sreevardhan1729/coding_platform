import React from "react";
import Editor from "@monaco-editor/react";
import clsx from "clsx"; // optional, just for merging class names

type Props = {
  language: string;
  code: string;
  onChange: (v: string) => void;
  /** Height for the editor area (e.g. "400px", "50vh"). Defaults to 400 px. */
  height?: string | number;
  className?: string;
};

export default function CodeEditor({
  language,
  code,
  onChange,
  height = "400px",
  className,
}: Props) {
  return (
    <div
      className={clsx(
        "border rounded-xl overflow-hidden", // keeps the editor clipped
        className
      )}
    >
      <Editor
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(value) => onChange(value || "")}
        height={height}                 // ← key line
        options={{
          automaticLayout: true,        // re-layout on container resize
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
