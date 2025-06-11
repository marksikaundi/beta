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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    typescript?: string;
    go?: string;
    java?: string;
  };
  hints: string[];
  constraints: string[];
  tags: string[];
  category?: string;
  customCategory?: string;
  order?: number;
  prerequisites?: string[];
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
    javascript: `/**
 * Write your solution here
 * @param {any} input - The input for the problem
 * @return {any} - The expected output
 */
function solution(input) {
  // Your code here
}

// Example usage:
// solution([1, 2, 3]);`,
    python: `# Write your solution here
def solution(input):
    """
    Solution function
    Args:
        input: The input for the problem
    Returns:
        The expected output
    """
    # Your code here
    pass

# Example usage:
# solution([1, 2, 3])`,
    typescript: `/**
 * Write your solution here
 * @param input - The input for the problem
 * @returns The expected output
 */
function solution(input: any): any {
  // Your code here
}

// Example usage:
// solution([1, 2, 3]);`,
    go: `package main

import (
	"fmt"
)

// Solution solves the problem
func Solution(input interface{}) interface{} {
	// Your code here
	return nil
}

func main() {
	// Example usage:
	// result := Solution([]int{1, 2, 3})
	// fmt.Println(result)
}`,
    java: `/**
 * Solution class for solving the problem
 */
public class Solution {
    /**
     * Solves the problem
     * @param input The input for the problem
     * @return The expected output
     */
    public static Object solution(Object input) {
        // Your code here
        return null;
    }
    
    public static void main(String[] args) {
        // Example usage:
        // Object result = solution(new int[]{1, 2, 3});
        // System.out.println(result);
    }
}`,
  },
  hints: [""],
  constraints: [""],
  tags: [],
  category: "",
  order: 1,
  prerequisites: [],
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

  // Template for common coding challenges
  const applyTemplate = (template: string) => {
    let newData = { ...formData };

    if (template === "array-sum") {
      newData = {
        ...newData,
        title: "Array Sum",
        description: "Calculate the sum of all numbers in an array",
        problemStatement:
          "Write a function that calculates the sum of all numbers in an array.",
        examples: [
          {
            input: "[1, 2, 3, 4, 5]",
            output: "15",
            explanation: "1 + 2 + 3 + 4 + 5 = 15",
          },
          {
            input: "[-1, -2, 10]",
            output: "7",
            explanation: "-1 + (-2) + 10 = 7",
          },
        ],
        testCases: [
          {
            input: "[1, 2, 3, 4, 5]",
            expectedOutput: "15",
            description: "Positive numbers",
          },
          {
            input: "[-1, -2, 10]",
            expectedOutput: "7",
            description: "Mixed positive and negative numbers",
          },
          {
            input: "[]",
            expectedOutput: "0",
            description: "Empty array",
          },
        ],
        starterCode: {
          javascript: `/**
 * Calculate the sum of an array of numbers
 * @param {number[]} arr - The input array of numbers
 * @return {number} - The sum of all numbers
 */
function arraySum(arr) {
  // Your code here
}

// Example usage:
// arraySum([1, 2, 3, 4, 5]); // Should return 15`,
          python: `def array_sum(arr):
    """
    Calculate the sum of an array of numbers
    Args:
        arr: A list of numbers
    Returns:
        The sum of all numbers in the array
    """
    # Your code here
    pass

# Example usage:
# array_sum([1, 2, 3, 4, 5]) # Should return 15`,
        },
        hints: [
          "Consider using a loop to iterate through each element",
          "You can initialize a sum variable to 0 and add each element to it",
          "For an empty array, the sum should be 0",
        ],
        constraints: [
          "The array can contain positive and negative integers",
          "The array can be empty",
          "The length of the array will not exceed 10,000",
        ],
        tags: ["Array", "Math", "Loop"],
      };
    } else if (template === "palindrome") {
      newData = {
        ...newData,
        title: "Palindrome Check",
        description: "Determine if a string is a palindrome",
        problemStatement:
          "Write a function that checks if a given string is a palindrome. A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward (ignoring spaces, punctuation, and capitalization).",
        examples: [
          {
            input: '"racecar"',
            output: "true",
            explanation: '"racecar" reads the same forward and backward',
          },
          {
            input: '"hello"',
            output: "false",
            explanation: '"hello" does not read the same backward',
          },
        ],
        testCases: [
          {
            input: '"racecar"',
            expectedOutput: "true",
            description: "Simple palindrome",
          },
          {
            input: '"A man, a plan, a canal: Panama"',
            expectedOutput: "true",
            description: "Palindrome with spaces and punctuation",
          },
          {
            input: '"hello"',
            expectedOutput: "false",
            description: "Not a palindrome",
          },
        ],
        starterCode: {
          javascript: `/**
 * Check if a string is a palindrome
 * @param {string} str - The input string
 * @return {boolean} - True if the string is a palindrome, false otherwise
 */
function isPalindrome(str) {
  // Your code here
}

// Example usage:
// isPalindrome("racecar"); // Should return true
// isPalindrome("hello"); // Should return false`,
          python: `def is_palindrome(s):
    """
    Check if a string is a palindrome
    Args:
        s: Input string
    Returns:
        True if the string is a palindrome, False otherwise
    """
    # Your code here
    pass

# Example usage:
# is_palindrome("racecar") # Should return True
# is_palindrome("hello") # Should return False`,
        },
        hints: [
          "Consider removing spaces, punctuation, and converting to lowercase first",
          "You can compare the string with its reverse",
          "Another approach is to use two pointers, one at the beginning and one at the end",
        ],
        constraints: [
          "The input string can contain spaces, punctuation, and mixed case",
          "The function should ignore spaces, punctuation, and case differences",
          "The input string will not exceed 10,000 characters",
        ],
        tags: ["String", "Two Pointers"],
      };
    }

    setFormData(newData);
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

  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  // Common tag suggestions
  const commonTags = [
    "Array",
    "String",
    "Math",
    "Dynamic Programming",
    "Graph",
    "Tree",
    "Hash Table",
    "Binary Search",
    "Two Pointers",
    "Recursion",
    "Linked List",
    "Stack",
    "Queue",
    "Heap",
    "Sorting",
    "Greedy",
  ];

  // Common categories
  const commonCategories = [
    "Algorithms",
    "Data Structures",
    "Patterns",
    "JavaScript Fundamentals",
    "Python Fundamentals",
    "Web Development",
    "Database",
    "System Design",
    "Object-Oriented Programming",
    "Frontend",
    "Backend",
    "Full-Stack",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Lab" : "Edit Lab"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "create" && (
            <div className="bg-muted/50 border rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium mb-2">
                Quick Start with Templates
              </h4>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => applyTemplate("array-sum")}
                >
                  Array Sum
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => applyTemplate("palindrome")}
                >
                  Palindrome Check
                </Button>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
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
                    setFormData({
                      ...formData,
                      problemStatement: e.target.value,
                    })
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
                  <div
                    key={index}
                    className="space-y-2 mt-3 p-3 border rounded-md bg-muted/30"
                  >
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium">
                        Test Case #{index + 1}
                      </h4>
                      {formData.testCases.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs text-destructive"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              testCases: formData.testCases.filter(
                                (_, i) => i !== index
                              ),
                            });
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <Label
                          htmlFor={`test-input-${index}`}
                          className="text-xs"
                        >
                          Input
                        </Label>
                        <Textarea
                          id={`test-input-${index}`}
                          placeholder="Input"
                          value={testCase.input}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              testCases: formData.testCases.map((tc, i) =>
                                i === index
                                  ? { ...tc, input: e.target.value }
                                  : tc
                              ),
                            })
                          }
                          className="font-mono"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`test-output-${index}`}
                          className="text-xs"
                        >
                          Expected Output
                        </Label>
                        <Textarea
                          id={`test-output-${index}`}
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
                          className="font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor={`test-description-${index}`}
                        className="text-xs"
                      >
                        Description
                      </Label>
                      <Input
                        id={`test-description-${index}`}
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
                  <Tabs defaultValue="javascript">
                    <TabsList className="mb-2">
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="typescript">TypeScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="go">Go</TabsTrigger>
                      <TabsTrigger value="java">Java</TabsTrigger>
                    </TabsList>

                    <TabsContent value="javascript">
                      <Textarea
                        className="font-mono h-[200px]"
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
                    </TabsContent>

                    <TabsContent value="typescript">
                      <Textarea
                        className="font-mono h-[200px]"
                        value={formData.starterCode.typescript || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            starterCode: {
                              ...formData.starterCode,
                              typescript: e.target.value,
                            },
                          })
                        }
                      />
                    </TabsContent>

                    <TabsContent value="python">
                      <Textarea
                        className="font-mono h-[200px]"
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
                    </TabsContent>

                    <TabsContent value="go">
                      <Textarea
                        className="font-mono h-[200px]"
                        value={formData.starterCode.go || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            starterCode: {
                              ...formData.starterCode,
                              go: e.target.value,
                            },
                          })
                        }
                      />
                    </TabsContent>

                    <TabsContent value="java">
                      <Textarea
                        className="font-mono h-[200px]"
                        value={formData.starterCode.java || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            starterCode: {
                              ...formData.starterCode,
                              java: e.target.value,
                            },
                          })
                        }
                      />
                    </TabsContent>
                  </Tabs>
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
                <Label htmlFor="tags" className="mb-2 block">
                  Tags
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} className="px-2 py-1 gap-1">
                      {tag}
                      <button
                        type="button"
                        className="ml-1 text-xs hover:text-destructive"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="tagInput"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-1">
                    Common tags:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {commonTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className="text-xs px-2 py-1 border rounded-full hover:bg-muted"
                        onClick={() => {
                          if (!formData.tags.includes(tag)) {
                            setFormData({
                              ...formData,
                              tags: [...formData.tags, tag],
                            });
                          }
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.points}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      points: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>

              {/* Add category field */}
              <div>
                <Label htmlFor="category">Category</Label>
                <div className="flex flex-col space-y-2">
                  <Select
                    value={formData.category || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Category...</SelectItem>
                    </SelectContent>
                  </Select>

                  {formData.category === "custom" && (
                    <Input
                      id="customCategory"
                      value={formData.customCategory || ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          customCategory: e.target.value,
                          category: e.target.value,
                        });
                      }}
                      placeholder="Enter custom category"
                      className="mt-2"
                    />
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-1">
                    Common categories:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {commonCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        className="text-xs px-2 py-1 border rounded-full hover:bg-muted"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            category: category,
                          });
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add order field */}
              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order || 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value),
                    })
                  }
                  placeholder="Challenges are sorted by this value within a category"
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

            <div className="border-t pt-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">Code Setup</h2>
              <div className="space-y-4">
                {/* Code setup section is already covered in the tabs above, no need to duplicate */}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Create Lab" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
