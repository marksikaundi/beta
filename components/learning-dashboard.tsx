"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useBootDev } from "@/hooks/use-boot-dev";
import { Course, Achievement, UserAchievement } from "@/lib/types";

// Temporary user ID for demo purposes
const DEMO_USER_ID = "user123";

export function LearningDashboard() {
  const { courses, achievements, progress } = useBootDev(DEMO_USER_ID);

  if (!courses || !achievements || !progress) {
    return <div>Loading...</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Learning Paths Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Learning Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: Course) => (
            <Card key={course._id} className="p-6">
              {course.imageUrl && (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-40 object-cover mb-4 rounded"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{course.language}</span>
                <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {course.difficulty}
                </span>
              </div>
              <Button className="w-full mt-4">Start Learning</Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Your Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {achievements.available.map((achievement: Achievement) => {
            const isUnlocked = achievements.unlocked.some(
              (ua: UserAchievement) => ua.achievementId === achievement._id
            );
            return (
              <Card
                key={achievement._id}
                className={`p-4 text-center ${
                  isUnlocked ? "bg-green-50" : "bg-gray-50"
                }`}
              >
                <img
                  src={achievement.imageUrl}
                  alt={achievement.title}
                  className={`w-16 h-16 mx-auto mb-2 ${
                    !isUnlocked && "filter grayscale"
                  }`}
                />
                <h4 className="font-medium text-sm mb-1">
                  {achievement.title}
                </h4>
                <p className="text-xs text-gray-600">
                  {achievement.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Progress Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Daily Streak</h3>
            <Progress value={33} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              🔥 Current streak: 7 days
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Embers Available</h3>
            <p className="text-sm text-gray-600">
              ✨ You have 3 embers to keep your streak alive
            </p>
          </div>
        </Card>
      </section>
    </main>
  );
}
