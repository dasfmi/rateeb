"use client";
import { Note } from "@/entity";
import NoteCard from "@/ui/NoteCard";
import Spinner from "@/ui/Spinner";
import { useEffect, useState } from "react";

export default function TrashPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const loadNotes = async () => {
      const resp = await fetch("/api/notes?isDeleted=true");
      const data = await resp.json();
      setNotes(data.notes);
      setIsLoading(false);
    };

    loadNotes();
  }, []);

  if (isLoading) {
    return (
      <div className="my-12 mx-auto flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <h1 className="text-center">Trash</h1>
      </div>

      <section className="overflow-y-auto max-w-full p-4 pt-24">
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-5 gap-4 space-y-4">
          {notes.map((n: Note) => (
            <NoteCard
              key={n._id}
              note={n}
              onAction={() => {}}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
