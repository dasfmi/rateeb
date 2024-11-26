"use client";
import useNotesStore from "@/store/notes.store";
import NotesContainer from "@/ui/NotesColumns";

export default function Today() {
  const {notes} = useNotesStore();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfDayUnix = startOfDay.getTime();
  const filteredNotes = notes.filter((note) => note.type === "reminder" || note.createdAt && note.createdAt > startOfDayUnix);

  return (
    <NotesContainer notes={filteredNotes} onAction={() => {}} />
  )
}
 