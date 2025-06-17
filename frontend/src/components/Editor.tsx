import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface EditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

const MONACO_LANGUAGE_MAP: { [key: string]: string } = {
  python: 'python',
  cpp: 'cpp',
  javascript: 'javascript'
};

export default function Editor({ language, value, onChange, height = '400px' }: EditorProps) {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const monacoLanguage = MONACO_LANGUAGE_MAP[language] || 'plaintext';

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <MonacoEditor
        height={height}
        language={monacoLanguage}
        value={value}
        onChange={handleEditorChange}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          folding: true,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          renderLineHighlight: 'line',
          selectOnLineNumbers: true,
          cursorStyle: 'line',
          cursorBlinking: 'blink',
          padding: { top: 16, bottom: 16 },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          autoIndent: 'full',
          formatOnPaste: true,
          formatOnType: true,
          smoothScrolling: true,
          mouseWheelZoom: true,
          contextmenu: true,
          links: true,
          colorDecorators: true,
          lightbulb: {
            enabled: true
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false
          }
        }}
      />
    </div>
  );
}