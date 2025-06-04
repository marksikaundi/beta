"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Play, CheckCircle, Lock } from "lucide-react";
import Link from "next/link";

const lessonData = {
  title: "Python Fundamentals",
  description: "Master the basics of Python programming",
  progress: 65,
  modules: [
    {
      title: "Getting Started with Python",
      lessons: [
        {
          id: "python-basics-1",
          title: "Variables and Data Types",
          type: "interactive",
          duration: "15 min",
          completed: false,
        },
        {
          id: "python-basics-2",
          title: "Basic Operations",
          type: "video",
          duration: "10 min",
          completed: false,
        },
        {
          id: "python-basics-3",
          title: "Control Flow",
          type: "interactive",
          duration: "20 min",
          completed: false,
          locked: true,
        },
      ],
    },
    {
      title: "Functions and Methods",
      lessons: [
        {
          id: "python-functions-1",
          title: "Defining Functions",
          type: "interactive",
          duration: "20 min",
          completed: false,
          locked: true,
        },
        {
          id: "python-functions-2",
          title: "Function Parameters",
          type: "video",
          duration: "15 min",
          completed: false,
          locked: true,
        },
      ],
    },
  ],
};

export default function LessonsPage() {
  const [activeModule, setActiveModule] = useState(0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{lessonData.title}</h1>
        <p className="text-gray-600 mb-4">{lessonData.description}</p>
        <div className="flex items-center gap-4">
          <Progress value={lessonData.progress} className="flex-1" />
          <span className="text-sm font-medium">
            {lessonData.progress}% complete
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Modules List */}
        <Card className="p-4 md:col-span-1">
          <h2 className="font-semibold mb-4">Course Modules</h2>
          <div className="space-y-2">
            {lessonData.modules.map((module, index) => (
              <button
                key={index}
                onClick={() => setActiveModule(index)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeModule === index
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{module.title}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Lessons List */}
        <Card className="p-4 md:col-span-2">
          <h2 className="font-semibold mb-4">
            {lessonData.modules[activeModule].title}
          </h2>
          <div className="space-y-3">
            {lessonData.modules[activeModule].lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`p-4 rounded-lg border ${
                  lesson.locked
                    ? "bg-gray-50"
                    : "hover:border-blue-200 cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {lesson.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : lesson.locked ? (
                      <Lock className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Play className="h-5 w-5 text-blue-500" />
                    )}
                    <div>
                      <h3 className="font-medium">{lesson.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {lesson.duration}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          {lesson.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!lesson.locked && !lesson.completed && (
                    <Link href={`/dashboard/lessons/${lesson.id}`}>
                      <Button variant="ghost" size="sm">
                        Start
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
