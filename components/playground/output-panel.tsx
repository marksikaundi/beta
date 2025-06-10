import { FC } from "react";

interface OutputPanelProps {
  output: string;
}

const OutputPanel: FC<OutputPanelProps> = ({ output }) => {
  return (
    <div className="bg-zinc-900 dark:bg-zinc-950 text-white p-4 h-full overflow-auto font-mono text-sm border-l border-gray-800">
      <div className="mb-2 text-xs text-gray-400 border-b border-gray-800 pb-2">
        Code Execution Results
      </div>
      <pre className="whitespace-pre-wrap leading-relaxed">{output}</pre>
    </div>
  );
};

export default OutputPanel;
