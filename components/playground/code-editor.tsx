import { FC } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
  theme?: "vs-dark" | "vs-light";
}

const CodeEditor: FC<CodeEditorProps> = ({
  language,
  value,
  onChange,
  theme = "vs-dark",
}) => {
  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      language={language}
      value={value}
      theme={theme}
      onChange={onChange}
      options={{
        fontSize: 14,
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        lineNumbers: "on",
        minimap: { enabled: false },
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 16 },
        lineHeight: 1.6,
        folding: true,
        matchBrackets: "always",
        bracketPairColorization: { enabled: true },
        renderLineHighlight: "all",
        cursorBlinking: "smooth",
        smoothScrolling: true,
        tabSize: 2,
        wordWrap: "on",
        rulers: [],
        guides: {
          bracketPairs: true,
          indentation: true,
        },
      }}
    />
  );
};

export default CodeEditor;
