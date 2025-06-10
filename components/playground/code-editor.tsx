import { FC } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
  theme?: string;
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
      defaultValue={value}
      theme={theme}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
};

export default CodeEditor;
