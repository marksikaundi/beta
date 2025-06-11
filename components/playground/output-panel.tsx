import { FC } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OutputPanelProps {
  output: string;
  error?: string | null;
}

const OutputPanel: FC<OutputPanelProps> = ({ output, error }) => {
  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-start gap-2 text-destructive">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <div className="space-y-2">
            <div className="font-medium">Error</div>
            <pre className="text-sm whitespace-pre-wrap break-words leading-relaxed bg-destructive/10 text-destructive p-3 rounded-md">
              {error}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (output) {
    return (
      <div className="p-4">
        <div className="flex items-start gap-2 text-foreground">
          <CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-green-500" />
          <div className="space-y-2">
            <div className="font-medium">Output</div>
            <pre
              className={cn(
                "font-mono text-sm whitespace-pre-wrap break-words leading-relaxed",
                "bg-muted/50 p-3 rounded-md"
              )}
            >
              {output}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full py-12 text-center text-muted-foreground">
      <div className="text-sm">Run your code to see the output</div>
      <div className="text-xs mt-1">Use Ctrl/Cmd + Enter to run</div>
    </div>
  );
};

export default OutputPanel;
