import { loadPyodide } from "pyodide";

interface PythonWorkerResult {
  output: string;
  error?: string;
}

let pyodide: any = null;

export async function runInPythonWorker(
  code: string
): Promise<PythonWorkerResult> {
  try {
    if (!pyodide) {
      // Initialize Pyodide only once
      pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
      });
    }

    // Run the Python code
    await pyodide.loadPackagesFromImports(code);
    const result = await pyodide.runPythonAsync(code);

    return {
      output: String(result),
    };
  } catch (error) {
    return {
      output: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
