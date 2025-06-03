"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Users,
  BookOpen,
  Award,
} from "lucide-react";

const stats = [
  {
    name: "Total Students",
    value: "2,345",
    icon: Users,
    change: "+12%",
    changeType: "positive",
  },
  {
    name: "Active Courses",
    value: "24",
    icon: BookOpen,
    change: "+2",
    changeType: "positive",
  },
  {
    name: "Achievements Unlocked",
    value: "12,456",
    icon: Award,
    change: "+23%",
    changeType: "positive",
  },
  {
    name: "Avg. Completion Rate",
    value: "84%",
    icon: BarChart,
    change: "+5%",
    changeType: "positive",
  },
];

export default function AdminPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p
                    className={`ml-2 text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Activity items */}
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">New student enrolled</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Achievement unlocked</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Popular Courses</h2>
          <div className="space-y-4">
            {/* Course items */}
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Python Fundamentals</p>
                <p className="text-xs text-gray-500">843 active students</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Go for Backend</p>
                <p className="text-xs text-gray-500">562 active students</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
