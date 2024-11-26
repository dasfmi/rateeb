import { Note } from "@/entity";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface NotesStore {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
}

const useNotesStore = create<NotesStore>()(
  devtools(
    persist(
      (set) => ({
        notes: [],
        setNotes: (notes: Note[]) =>
          set((state: NotesStore) => {
            return {
              ...state,
              notes,
            };
          }),
      }),
      {
        name: "notes-storage",
      },
    ),
  ),
);

export default useNotesStore;
