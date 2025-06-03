export type Course = {
  _id: string;
  title: string;
  description: string;
  language: string;
  difficulty: string;
  order: number;
  imageUrl?: string;
};

export type Achievement = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  requiredPoints: number;
};

export type UserAchievement = {
  _id: string;
  userId: string;
  achievementId: string;
  unlockedAt: number;
};
