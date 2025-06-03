"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function useBootDev(userId: string) {
  // Queries
  const courses = useQuery(api.courses.list);
  const achievements = useQuery(api.achievements.getAchievements, { userId });
  const progress = useQuery(api.progress.getUserProgress, { userId });

  // Mutations
  const updateProgress = useMutation(api.progress.updateProgress);
  const checkAchievements = useMutation(
    api.achievements.checkAndGrantAchievements
  );

  // Helper function to update progress and check achievements
  const completeLesson = async (lessonId: Id<"lessons">, code: string) => {
    await updateProgress({
      userId,
      lessonId,
      completed: true,
      code,
    });

    // Check for new achievements
    const newAchievements = await checkAchievements({ userId });
    return newAchievements;
  };

  return {
    courses,
    achievements,
    progress,
    completeLesson,
  };
}
