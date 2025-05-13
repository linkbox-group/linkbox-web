import { create } from "zustand";

interface TagStore {
  shouldRefreshTags: boolean;
  setShouldRefreshTags: (value: boolean) => void;
}

export const useTagStore = create<TagStore>((set) => ({
  shouldRefreshTags: false,
  setShouldRefreshTags: (value) => set({ shouldRefreshTags: value }),
}));
