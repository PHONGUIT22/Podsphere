// UserHealthStatsDto.cs
export interface UserHealthStatsDto {
    moodScore: number;
    stressLevel: string;
    sleepHours: number;
    note: string | null;
    updatedAt: string;
}

// HealthRecommendationDto.cs
export interface HealthRecommendationDto {
    moodScore: number;
    mentalStatus: string;
    stressWarning: string;
    suggestedPodcastTags: string[];
    advice: string;
    recommendedPodcasts: string[];
}

// UserJournalDto.cs
export interface UserJournalDto {
    id: string;
    title: string;
    content: string;
    mood: string | null;
    createdAt: string;
}

// MeditationDto.cs
export interface MeditationDto {
  id: string;
  title: string;
  audioUrl: string;
  thumbnail: string;
  duration: number;
  target: string;
  description: string;
}