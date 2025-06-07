"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Plus, Pencil, Trash2, FileCode, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LabFormDialog } from "@/components/admin/lab-form-dialog";
import { toast } from "sonner";

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

  const handleCreateLab = async (
    labData: Omit<Lab, "_id" | "_creationTime" | "createdAt" | "updatedAt">
  ) => {
    try {
      await createLab(labData);
      setIsCreateDialogOpen(false);
      toast.success("Lab created successfully");
    } catch (error) {
      toast.error("Failed to create lab");
      console.error(error);
    }
  };

  const handleUpdateLab = async (
    labData: Omit<Lab, "_id" | "_creationTime" | "createdAt" | "updatedAt">
  ) => {
    if (!selectedLab) return;

    try {
      await updateLab({ id: selectedLab._id, ...labData });
      setSelectedLab(null);
      setIsEditDialogOpen(false);
      toast.success("Lab updated successfully");
    } catch (error) {
      toast.error("Failed to update lab");
      console.error(error);
    }
  };

  const handleDeleteLab = async (labId: Id<"labs">) => {
    if (confirm("Are you sure you want to delete this lab?")) {
      try {
        await deleteLab({ id: labId });
        toast.success("Lab deleted successfully");
      } catch (error) {
        toast.error("Failed to delete lab");
        console.error(error);
      }
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

      <LabFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateLab}
        mode="create"
      />

      {selectedLab && (
        <LabFormDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedLab(null);
          }}
          onSubmit={handleUpdateLab}
          initialData={selectedLab}
          mode="edit"
        />
      )}
    </div>
  );
}
