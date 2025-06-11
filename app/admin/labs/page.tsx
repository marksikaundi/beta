"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  FileCode,
  Clock,
  Eye,
  Filter,
  Search,
  Tag,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Award,
  FileText,
  BarChart4,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  category?: string;
  order?: number;
  prerequisites?: Id<"labs">[];
  points: number;
  timeLimit: number;
  isPublished: boolean;
  createdBy: string;
}

export default function AdminLabsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const labs = useQuery(api.labs.list) || [];
  const createLab = useMutation(api.labs_admin.createLab);
  const updateLab = useMutation(api.labs_admin.updateLab);
  const deleteLab = useMutation(api.labs_admin.deleteLab);

  const handleCreateLab = async (labData: any) => {
    try {
      // Add the createdBy field if it's not present
      const completeLabData = {
        ...labData,
        createdBy: "admin", // You might want to get the actual user ID here
      };

      await createLab(completeLabData);
      setIsCreateDialogOpen(false);
      toast.success("Lab created successfully");
    } catch (error) {
      toast.error("Failed to create lab");
      console.error(error);
    }
  };

  const handleUpdateLab = async (labData: any) => {
    if (!selectedLab) return;

    try {
      // Add the createdBy field if it's not present
      const completeLabData = {
        ...labData,
        createdBy: selectedLab.createdBy || "admin",
      };

      await updateLab({ id: selectedLab._id, ...completeLabData });
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

  const handleDuplicateLab = (lab: Lab) => {
    const duplicatedLab = {
      ...lab,
      title: `${lab.title} (Copy)`,
      isPublished: false, // Default to unpublished for safety
    };
    setSelectedLab(duplicatedLab);
    setIsCreateDialogOpen(true);
  };

  // Filter labs based on search query and filters
  const filteredLabs = labs.filter((lab) => {
    // Search filter
    const searchMatches =
      searchQuery === "" ||
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Difficulty filter
    const difficultyMatches =
      !difficultyFilter || lab.difficulty === difficultyFilter;

    // Category filter
    const categoryMatches =
      !categoryFilter || (lab.category && lab.category === categoryFilter);

    return searchMatches && difficultyMatches && categoryMatches;
  });

  // Stats
  const totalLabs = labs.length;
  const publishedLabs = labs.filter((lab) => lab.isPublished).length;
  const easyLabs = labs.filter((lab) => lab.difficulty === "Easy").length;
  const mediumLabs = labs.filter((lab) => lab.difficulty === "Medium").length;
  const hardLabs = labs.filter((lab) => lab.difficulty === "Hard").length;

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Coding Challenges</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage coding challenges for your users
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create Challenge
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLabs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Published
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedLabs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Easy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {easyLabs}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Medium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {mediumLabs}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Hard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{hardLabs}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and filter section */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={difficultyFilter || ""}
            onValueChange={(value) => setDifficultyFilter(value || null)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          {/* Category filter */}
          <Select
            value={categoryFilter || ""}
            onValueChange={(value) => setCategoryFilter(value || null)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {Array.from(
                new Set(
                  labs.map((lab) => lab.category).filter(Boolean) as string[]
                )
              ).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex">
            <Button
              variant={view === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("grid")}
              className="rounded-r-none"
            >
              <BarChart4 className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("table")}
              className="rounded-l-none"
            >
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Lab list */}
        {filteredLabs.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <FileCode className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No challenges found</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Get started by creating your first coding challenge.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create Challenge
            </Button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLabs.map((lab) => (
              <Card key={lab._id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge
                      className={`mb-2 ${
                        lab.difficulty === "Easy"
                          ? "bg-green-500"
                          : lab.difficulty === "Medium"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {lab.difficulty}
                    </Badge>
                    <Badge variant={lab.isPublished ? "outline" : "secondary"}>
                      {lab.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{lab.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {lab.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-3">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {lab.tags &&
                      lab.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                  {lab.category && (
                    <div className="mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {lab.category}
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{lab.timeLimit} min</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      <span>{lab.points} pts</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2 pb-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedLab(lab);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/lab?id=${lab._id}`, "_blank")}
                  >
                    <Eye className="h-4 w-4 mr-1" /> Preview
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          navigator.clipboard.writeText(`/lab?id=${lab._id}`);
                          toast.success("Link copied to clipboard");
                        }}
                      >
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateLab(lab)}>
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteLab(lab._id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Time Limit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLabs.map((lab) => (
                  <TableRow key={lab._id}>
                    <TableCell className="font-medium">{lab.title}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          lab.difficulty === "Easy"
                            ? "bg-green-500 text-white"
                            : lab.difficulty === "Medium"
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                        }
                      >
                        {lab.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{lab.points}</TableCell>
                    <TableCell>{lab.timeLimit} min</TableCell>
                    <TableCell>
                      {lab.isPublished ? (
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-500"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" /> Published
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-yellow-500/10 text-yellow-500"
                        >
                          <XCircle className="h-3 w-3 mr-1" /> Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedLab(lab);
                            setIsEditDialogOpen(true);
                          }}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(`/lab?id=${lab._id}`, "_blank")
                          }
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateLab(lab)}
                          title="Duplicate"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLab(lab._id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Create and Edit Dialogs */}
      {isCreateDialogOpen && (
        <LabFormDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreateLab}
          mode="create"
        />
      )}

      {isEditDialogOpen && selectedLab && (
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
