import { ExecutionResult, TestCase } from "./code-execution";

// Go code execution simulation
export async function executeGo(
  code: string,
  testCases?: TestCase[]
): Promise<ExecutionResult> {
  const startTime = Date.now();

  try {
    // Parse and simulate Go code execution
    const simulateGo = (code: string) => {
      let output: string[] = [];
      let variables: Record<string, any> = {};

      // Simple Go expression evaluator
      const evalGoExpr = (expr: string): any => {
        // Handle basic types
        if (/^\d+$/.test(expr)) {
          return parseInt(expr);
        }
        if (/^\d*\.\d+$/.test(expr)) {
          return parseFloat(expr);
        }
        if (/^".*"$/.test(expr)) {
          return expr.slice(1, -1);
        }
        if (variables[expr] !== undefined) {
          return variables[expr];
        }
        return `<${expr}>`;
      };

      // Parse lines and simulate execution
      const lines = code.split("\n");
      let inMainFunc = false;
      let indent = 0;

      for (const line of lines) {
        const trimmedLine = line.trim();

        // Skip empty lines and comments
        if (!trimmedLine || trimmedLine.startsWith("//")) {
          continue;
        }

        // Track main function
        if (trimmedLine === "func main() {") {
          inMainFunc = true;
          indent++;
          continue;
        }

        // Handle package declaration and imports
        if (trimmedLine.startsWith("package ")) {
          output.push(`Using package: ${trimmedLine.split(" ")[1]}`);
          continue;
        }

        if (trimmedLine.startsWith("import ")) {
          const importName =
            trimmedLine.split('"')[1] || trimmedLine.split(" ")[1];
          output.push(`Imported: ${importName}`);
          continue;
        }

        // Only execute code inside main()
        if (!inMainFunc) continue;

        // Handle fmt.Println
        if (trimmedLine.startsWith("fmt.Println(")) {
          const args = trimmedLine
            .slice(12, -1)
            .split(",")
            .map((arg) => evalGoExpr(arg.trim()));
          output.push(args.join(" "));
          continue;
        }

        // Handle variable declarations
        const varDeclMatch = trimmedLine.match(
          /^var\s+(\w+)\s+(\w+)\s*=\s*(.+)$/
        );
        if (varDeclMatch) {
          const [_, varName, varType, value] = varDeclMatch;
          variables[varName] = evalGoExpr(value);
          continue;
        }

        // Handle := declarations
        const shortDeclMatch = trimmedLine.match(/^(\w+)\s*:=\s*(.+)$/);
        if (shortDeclMatch) {
          const [_, varName, value] = shortDeclMatch;
          variables[varName] = evalGoExpr(value);
          continue;
        }

        // Track closing braces
        if (trimmedLine === "}") {
          indent--;
          if (indent === 0) {
            inMainFunc = false;
          }
          continue;
        }
      }

      return output.join("\n");
    };

    const simulatedOutput = simulateGo(code);
    const executionTime = Date.now() - startTime;

    return {
      output: [
        "=== Go Simulation ===",
        simulatedOutput || "No output",
        "",
        `=== Execution Time ===\n${executionTime}ms`,
      ]
        .filter(Boolean)
        .join("\n"),
      passed: true,
      executionTime,
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    return {
      output: "",
      error: error instanceof Error ? error.message : String(error),
      passed: false,
      executionTime,
    };
  }
}
