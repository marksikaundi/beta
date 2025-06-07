import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

interface LabFormData {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  problemStatement: string;
  examples: Example[];
  testCases: TestCase[];
  starterCode: {
    javascript: string;
    python: string;
  };
  hints: string[];
  constraints: string[];
  tags: string[];
  points: number;
  timeLimit: number;
  isPublished: boolean;
}

interface LabFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LabFormData) => void;
  initialData?: LabFormData;
  mode: "create" | "edit";
}

const defaultLabData: LabFormData = {
  title: "",
  difficulty: "Easy",
  description: "",
  problemStatement: "",
  examples: [{ input: "", output: "", explanation: "" }],
  testCases: [{ input: "", expectedOutput: "", description: "" }],
  starterCode: {
    javascript: "function solution() {\n  // Write your code here\n}",
    python: "def solution():\n    # Write your code here\n    pass",
  },
  hints: [""],
  constraints: [""],
  tags: [],
  points: 100,
  timeLimit: 30,
  isPublished: false,
};

export function LabFormDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: LabFormDialogProps) {
  const [formData, setFormData] = useState<LabFormData>(
    initialData || defaultLabData
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddExample = () => {
    setFormData({
      ...formData,
      examples: [
        ...formData.examples,
        { input: "", output: "", explanation: "" },
      ],
    });
  };

  const handleAddTestCase = () => {
    setFormData({
      ...formData,
      testCases: [
        ...formData.testCases,
        { input: "", expectedOutput: "", description: "" },
      ],
    });
  };

  const handleAddHint = () => {
    setFormData({
      ...formData,
      hints: [...formData.hints, ""],
    });
  };

  const handleAddConstraint = () => {
    setFormData({
      ...formData,
      constraints: [...formData.constraints, ""],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Lab" : "Edit Lab"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: "Easy" | "Medium" | "Hard") =>
                  setFormData({ ...formData, difficulty: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="problemStatement">Problem Statement</Label>
              <Textarea
                id="problemStatement"
                value={formData.problemStatement}
                onChange={(e) =>
                  setFormData({ ...formData, problemStatement: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Examples</Label>
              {formData.examples.map((example, index) => (
                <div key={index} className="space-y-2 mt-2">
                  <Input
                    placeholder="Input"
                    value={example.input}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        examples: formData.examples.map((ex, i) =>
                          i === index ? { ...ex, input: e.target.value } : ex
                        ),
                      })
                    }
                  />
                  <Input
                    placeholder="Output"
                    value={example.output}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        examples: formData.examples.map((ex, i) =>
                          i === index ? { ...ex, output: e.target.value } : ex
                        ),
                      })
                    }
                  />
                  <Input
                    placeholder="Explanation (optional)"
                    value={example.explanation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        examples: formData.examples.map((ex, i) =>
                          i === index
                            ? { ...ex, explanation: e.target.value }
                            : ex
                        ),
                      })
                    }
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddExample}
                className="mt-2"
              >
                Add Example
              </Button>
            </div>

            <div>
              <Label>Test Cases</Label>
              {formData.testCases.map((testCase, index) => (
                <div key={index} className="space-y-2 mt-2">
                  <Input
                    placeholder="Input"
                    value={testCase.input}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        testCases: formData.testCases.map((tc, i) =>
                          i === index ? { ...tc, input: e.target.value } : tc
                        ),
                      })
                    }
                  />
                  <Input
                    placeholder="Expected Output"
                    value={testCase.expectedOutput}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        testCases: formData.testCases.map((tc, i) =>
                          i === index
                            ? { ...tc, expectedOutput: e.target.value }
                            : tc
                        ),
                      })
                    }
                  />
                  <Input
                    placeholder="Description"
                    value={testCase.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        testCases: formData.testCases.map((tc, i) =>
                          i === index
                            ? { ...tc, description: e.target.value }
                            : tc
                        ),
                      })
                    }
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTestCase}
                className="mt-2"
              >
                Add Test Case
              </Button>
            </div>

            <div>
              <Label>Starter Code</Label>
              <div className="space-y-2">
                <Label>JavaScript</Label>
                <Textarea
                  value={formData.starterCode.javascript}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      starterCode: {
                        ...formData.starterCode,
                        javascript: e.target.value,
                      },
                    })
                  }
                />
                <Label>Python</Label>
                <Textarea
                  value={formData.starterCode.python}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      starterCode: {
                        ...formData.starterCode,
                        python: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label>Hints</Label>
              {formData.hints.map((hint, index) => (
                <Input
                  key={index}
                  className="mt-2"
                  value={hint}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hints: formData.hints.map((h, i) =>
                        i === index ? e.target.value : h
                      ),
                    })
                  }
                />
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddHint}
                className="mt-2"
              >
                Add Hint
              </Button>
            </div>

            <div>
              <Label>Constraints</Label>
              {formData.constraints.map((constraint, index) => (
                <Input
                  key={index}
                  className="mt-2"
                  value={constraint}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      constraints: formData.constraints.map((c, i) =>
                        i === index ? e.target.value : c
                      ),
                    })
                  }
                />
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddConstraint}
                className="mt-2"
              >
                Add Constraint
              </Button>
            </div>

            <div>
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                value={formData.points}
                onChange={(e) =>
                  setFormData({ ...formData, points: parseInt(e.target.value) })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                value={formData.timeLimit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeLimit: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isPublished}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPublished: checked })
                }
              />
              <Label>Published</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Create" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
