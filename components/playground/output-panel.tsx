import { FC } from "react";

interface OutputPanelProps {
  output: string;
}

const OutputPanel: FC<OutputPanelProps> = ({ output }) => {
  return (
    <div className="bg-zinc-900 text-white p-4 h-full overflow-auto font-mono text-sm">
      <pre>{output}</pre>
    </div>
  );
};

export default OutputPanel;
