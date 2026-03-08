import { create } from 'zustand';
import { EpisodeDto } from '@/types/podcast';

interface PlayerState {
  currentEpisode: EpisodeDto | null;
  isPlaying: boolean;
  queue: EpisodeDto[];
  setCurrentEpisode: (episode: EpisodeDto) => void;
  togglePlay: () => void;
  setPlaying: (status: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentEpisode: null,
  isPlaying: false,
  queue: [],

  setCurrentEpisode: (episode) => set({ currentEpisode: episode, isPlaying: true }),
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setPlaying: (status) => set({ isPlaying: status }),
}));