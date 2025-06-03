"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Play, CheckCircle, Lock } from "lucide-react";

const lessonData = {
  title: "Python Fundamentals",
  description: "Master the basics of Python programming",
  progress: 65,
  modules: [
    {
      title: "Getting Started with Python",
      lessons: [
        {
          title: "Introduction to Python",
          duration: "10 min",
          completed: true,
        },
        {
          title: "Setting up Your Environment",
          duration: "15 min",
          completed: true,
        },
        {
          title: "Basic Syntax and Variables",
          duration: "20 min",
          completed: false,
        },
      ],
    },
    {
      title: "Control Flow",
      lessons: [
        {
          title: "If Statements",
          duration: "15 min",
          completed: false,
          locked: false,
        },
        {
          title: "Loops in Python",
          duration: "20 min",
          completed: false,
          locked: true,
        },
        {
          title: "Functions and Methods",
          duration: "25 min",
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
            {lessonData.modules[activeModule].lessons.map((lesson, index) => (
              <div
                key={index}
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
                      <p className="text-sm text-gray-500">{lesson.duration}</p>
                    </div>
                  </div>
                  {!lesson.locked && !lesson.completed && (
                    <Button variant="ghost" size="sm">
                      Start
                    </Button>
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
