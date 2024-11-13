"use client";
import { Note } from "@/entity";
import NoteCard from "@/ui/NoteCard";
import { LoaderIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

const loadNotes = async () => {
  const resp = await fetch("/api/notes?type=contact");
  const data = await resp.json();
  return data.data;
};

export default function Today() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const addNewNote = async (e: FormData) => {
    setIsCreating(true);
    const name = e.get("name")?.toString();
    const email = e.get("email")?.toString();
    const site = e.get("site")?.toString();
    const linkedin = e.get("linkedin")?.toString();
    const github = e.get("github")?.toString();
    const x = e.get("x")?.toString();
    const phones = e.getAll("phone").filter((p) => p) as string[]; // checks if phone is not empty string

    const note: Note = {
      type: "contact",
      title: name ?? "",
      email,
      site,
      tags: [],
      linkedin,
      github,
      x,
      phones,
      createdAt: new Date().getTime(),
    };

    const resp = await fetch("/api/notes", {
      method: "post",
      body: JSON.stringify(note),
    });

    const data = await resp.json();
    console.log({ newNote: data.data });
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
        <h1>Contacts</h1>
        <span className="flex-1" />
        <button onClick={() => setShowForm(true)}>New</button>
      </div>
      <div className="flex w-full flex-1 h-full">
        <section className="w-full">
          {isLoading && (
            <div className="mt-12 mx-auto text-center">
              <LoaderIcon size={24} />
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-3 p-4 w-full">
            {notes.map((n: Note) => (
              <NoteCard
                key={n._id}
                note={n}
                onAction={(action: string) => console.log(action)}
              />
            ))}
          </div>
        </section>

        <aside
          className={`${showForm ? "flex flex-col" : "hidden"} absolute border-left h-full overflow-y-auto top-0 right-0 bottom-0 w-[20rem] shadow bg-white p-4`}
        >
          <form action={addNewNote} className="flex flex-col gap-2 w-full">
            <header className="flex">
              <h4>Create new contact</h4>
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-2">
                  <XIcon size={16} />
              </button>
            </header>
            <label className="text-muted text-xs">title</label>
            <input
              className="rounded-xl border focus:outline-none px-4 py-2"
              name="name"
              placeholder="Muhammad"
              required
            />

            <label className="text-muted text-xs">email</label>
            <input
              className="rounded-xl border focus:outline-none px-4 py-2"
              type="email"
              name="email"
              placeholder="muhammad@ahmed.com"
            />

            <label className="text-muted text-xs">site</label>
            <input
              className="rounded-xl border focus:outline-none px-4 py-2"
              type="url"
              name="site"
            />

            <label className="text-muted text-xs">linkedin</label>
            <input
              className="rounded-xl border focus:outline-none px-4 py-2"
              type="url"
              name="linkedin"
            />

            <label className="text-muted text-xs">github</label>
            <input
              className="rounded-xl border focus:outline-none px-4 py-2"
              type="url"
              name="github"
            />

            <label className="text-muted text-xs">X (twitter)</label>
            <input
              className="rounded-xl border focus:outline-none px-4 py-2"
              type="url"
              name="x"
            />

            <label className="text-muted text-xs">phone numbers</label>
            <input
              className="rounded-xl border focus:outline-none px-4 py-2"
              name="phone"
            />
            <input
              className="rounded-xl border focus:outline-none px-4 py-2"
              name="phone"
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
        </aside>
      </div>
    </div>
  );
}
