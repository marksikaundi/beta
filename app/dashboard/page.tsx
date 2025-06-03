"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, BookOpen, Award } from "lucide-react";
import Link from "next/link";

const courses = [
  {
    id: 1,
    title: "Python Fundamentals",
    description: "Learn the basics of Python programming",
    progress: 65,
    language: "Python",
    totalLessons: 24,
    completedLessons: 16,
  },
  {
    id: 2,
    title: "Go Backend Development",
    description: "Build scalable backends with Go",
    progress: 30,
    language: "Go",
    totalLessons: 32,
    completedLessons: 10,
  },
  {
    id: 3,
    title: "SQL Mastery",
    description: "Master database design and queries",
    progress: 15,
    language: "SQL",
    totalLessons: 18,
    completedLessons: 3,
  },
];

const achievements = [
  {
    title: "Fast Learner",
    description: "Complete 5 lessons in one day",
    earned: true,
  },
  {
    title: "Python Master",
    description: "Complete all Python courses",
    earned: false,
  },
  {
    title: "Perfect Streak",
    description: "Maintain a 7-day learning streak",
    earned: true,
  },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Student!</h1>
        <p className="text-gray-600">Continue your learning journey</p>
      </div>

      {/* Learning Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Course Progress</h3>
              <p className="text-sm text-gray-500">29 lessons completed</p>
            </div>
          </div>
          <Progress value={45} className="mb-2" />
          <p className="text-sm text-gray-600">45% of total courses completed</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Achievements</h3>
              <p className="text-sm text-gray-500">2 of 3 earned</p>
            </div>
          </div>
          <Progress value={66} className="mb-2" />
          <p className="text-sm text-gray-600">66% of achievements unlocked</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Current Streak</h3>
              <p className="text-sm text-gray-500">7 days</p>
            </div>
          </div>
          <Progress value={70} className="mb-2" />
          <p className="text-sm text-gray-600">🔥 Keep it up!</p>
        </Card>
      </div>

      {/* Active Courses */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <div className="p-6">
                <h3 className="font-semibold mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{course.completedLessons} of {course.totalLessons} lessons</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </div>
                <Link href={`/dashboard/lessons`}>
                  <Button className="w-full">
                    Continue Learning
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Achievements */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <Card 
              key={index}
              className={`p-4 ${achievement.earned ? 'bg-green-50' : 'bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <Award className={`h-5 w-5 ${achievement.earned ? 'text-green-600' : 'text-gray-400'}`} />
                <div>
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
