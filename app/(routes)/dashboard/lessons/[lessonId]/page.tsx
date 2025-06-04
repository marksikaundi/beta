"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { InteractiveLesson } from "@/components/interactive-lesson";
import Link from "next/link";

// Mock lesson data - in a real app, this would come from your backend
const lessonData = {
  id: "python-basics-1",
  title: "Python Variables and Data Types",
  description:
    "Learn about Python variables and basic data types through hands-on coding.",
  initialCode: `# Define a variable called 'name' with your name
# Define a variable called 'age' with your age
# Print both variables

name = ""
age = 0

print(f"My name is {name} and I am {age} years old")`,
};

export default function LessonPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleLessonComplete = () => {
    setIsCompleted(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/lessons">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Interactive Lesson</h1>
        </div>
        {isCompleted && (
          <div className="flex items-center gap-2 text-green-600">
            <span className="text-sm font-medium">Completed!</span>
          </div>
        )}
      </div>

      <InteractiveLesson
        title={lessonData.title}
        description={lessonData.description}
        initialCode={lessonData.initialCode}
        testCases={[
          {
            input: "",
            expectedOutput: "My name is",
          },
        ]}
        onComplete={handleLessonComplete}
      />
    </div>
  );
}
