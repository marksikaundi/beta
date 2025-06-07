"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Pencil, Trash2, FileCode, Clock } from "lucide-react";

// Lab interface matching Convex schema
interface Lab {
  _id: Id<"labs">;
  _creationTime: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  problemStatement: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  testCases: Array<{
    input: string;
    expectedOutput: string;
    description: string;
  }>;
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
  createdAt: string;
  updatedAt: string;
}

export default function AdminLabsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);

  const labs = useQuery(api.labs.list) || [];
  const createLab = useMutation(api.labs_admin.createLab);
  const updateLab = useMutation(api.labs_admin.updateLab);
  const deleteLab = useMutation(api.labs_admin.deleteLab);

  const defaultNewLab: Omit<
    Lab,
    "_id" | "_creationTime" | "createdAt" | "updatedAt"
  > = {
    title: "",
    difficulty: "Easy" as const,
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

  const [newLab, setNewLab] = useState(defaultNewLab);

  const handleCreateLab = async () => {
    await createLab(newLab);
    setNewLab(defaultNewLab);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateLab = async () => {
    if (!selectedLab) return;

    // Transform the lab object to match the expected format
    const { _id, _creationTime, createdAt, updatedAt, ...labData } =
      selectedLab;
    await updateLab({ id: _id, ...labData });

    setSelectedLab(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteLab = async (labId: Id<"labs">) => {
    if (confirm("Are you sure you want to delete this lab?")) {
      await deleteLab({ id: labId });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Labs Management</h1>
          <p className="text-muted-foreground">
            Create and manage coding challenges
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Lab
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => (
          <Card key={lab._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{lab.title}</CardTitle>
                  <CardDescription>{lab.description}</CardDescription>
                </div>
                <Badge variant={lab.isPublished ? "default" : "secondary"}>
                  {lab.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileCode className="h-4 w-4" />
                  <span>{lab.difficulty}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{lab.timeLimit}m</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedLab(lab);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteLab(lab._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Lab Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Lab</DialogTitle>
            <DialogDescription>
              Create a new coding challenge for users to solve.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Basic Information</Label>
                <Input
                  placeholder="Lab Title"
                  value={newLab.title}
                  onChange={(e) =>
                    setNewLab({ ...newLab, title: e.target.value })
                  }
                />
                <Select
                  value={newLab.difficulty}
                  onValueChange={(value: "Easy" | "Medium" | "Hard") =>
                    setNewLab({ ...newLab, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Short description"
                  value={newLab.description}
                  onChange={(e) =>
                    setNewLab({ ...newLab, description: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Problem statement (supports markdown)"
                  value={newLab.problemStatement}
                  onChange={(e) =>
                    setNewLab({ ...newLab, problemStatement: e.target.value })
                  }
                  className="min-h-[200px]"
                />
              </div>

              {/* Add more fields for examples, test cases, starter code, etc. */}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateLab}>Create Lab</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lab Dialog - Similar to Create but with pre-filled values */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {/* Similar structure to Create Dialog */}
      </Dialog>
    </div>
  );
}
