"use client";
import { Note } from "@/entity";
import NoteCard from "@/ui/NoteCard";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";

const loadNotes = async () => {
  const resp = await fetch("/api/notes?type=person");
  const data = await resp.json();
  return data.data;
};

export default function Today() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const addNewNote = async (e: FormData) => {
    setIsCreating(true);
    const name = e.get("name")?.toString();
    const email = e.get("email")?.toString();
    const site = e.get("site")?.toString();

    const note: Note = {
      type: "person",
      title: name ?? '',
      email,
      site,
      tags: [],
      createdAt: new Date().getTime(),
    };

    const resp = await fetch("/api/notes", {
      method: "post",
      body: JSON.stringify(note),
    });

    const data = await resp.json();
    console.log({newNote: data.data})
    setNotes([data.data, ...notes]);
    setIsCreating(false);
  };

  useEffect(() => {
    setIsLoading(true);
    loadNotes().then((notes) => {
      setNotes(notes);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col py-4">
      <div className="flex px-4">
        <h1>People</h1>
        <span className="flex-1" />
        <form action={addNewNote} className="flex gap-2">
          <input
            className="rounded-xl border focus:outline-none px-4 py-2"
            name="name"
          />
          <input
            className="rounded-xl border focus:outline-none px-4 py-2"
            type="email"
            name="email"
          />
          <input
            className="rounded-xl border focus:outline-none px-4 py-2"
            name="site"
          />
          <button type="submit" className="btn-primary" disabled={isCreating}>
            {isCreating ? (
              <span className="animate-spin">
                <LoaderIcon size={12} />
              </span>
            ) : (
              "Create"
            )}
          </button>
        </form>
      </div>
      {isLoading && <div className="mt-12 mx-auto text-center animate-spin"><LoaderIcon size={24} /></div>}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-3 p-4">
        {notes.map((n: Note) => (
          <NoteCard key={n._id} note={n} onAction={(action: string) => console.log(action)} />
        ))}
      </div>
    </div>
  );
}
