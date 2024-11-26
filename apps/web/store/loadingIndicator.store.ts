import { create } from "zustand";

interface AppStore {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isOnline: boolean;
  setIsOnline: (isOnline: boolean) => void;
}

const useAppStore = create<AppStore>()((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) =>
    set((state) => ({ ...state, isLoading })),
  isOnline: true,
  setIsOnline: (isOnline: boolean) => set((state) => ({ ...state, isOnline })),
}));

export default useAppStore;
