"use client";
import { Note } from "@/entity";
import { loadNotes } from "@/services/notes.client";
import usePrefStore from "@/store/pref.store";
import NoteCard from "@/ui/NoteCard";
import {
  LoaderIcon,
  MenuIcon,
  PlusIcon,
  Search,
  SearchIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Today() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { isSidebarOpen, setIsSidebarOpen } = usePrefStore();

  const addNewNote = async (e: FormData) => {
    setIsCreating(true);
    const text = e.get("input")?.toString();

    const resp = await fetch("/api/notes", {
      method: "post",
      body: JSON.stringify(text),
    });

    const data = await resp.json();
    setNotes([data.data, ...notes]);
    setIsCreating(false);
  };

  const onSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotes([]);
    const text = e.currentTarget.search.value;
    const type = e.currentTarget.type.value;
    setIsLoading(true);

    const notes = await loadNotes({ query: text, type });
    setNotes(notes);
    setIsLoading(false);
  };

  const filterByType = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setNotes([]);
    const type = e.target.value;
    setIsLoading(true);

    const notes = await loadNotes({ type });
    setNotes(notes);
    setIsLoading(false);
  };

  const onActionClicked = async (
    action: string,
    index: number,
    value?: string
  ) => {
    const id = notes[index]._id;
    if (!id) {
      return;
    }
    switch (action) {
      case "pin":
        await fetch("/api/notes/" + id, {
          method: "PATCH",
          body: JSON.stringify({
            action: "pin",
          }),
        });
        notes[index].isPinned = true;
        // move to the top
        setNotes([notes[index], ...notes.filter((n, i) => i !== index)]);
        break;
      case "delete":
        await fetch("/api/notes/" + id, {
          method: "DELETE",
        });
        setNotes(notes.filter((n, i) => i !== index));
        break;
      case "addTag":
        if (!notes[index].tags) {
          notes[index].tags = [];
        }
        notes[index].tags.push(value as string);
        setNotes([...notes]);

        try {
          await fetch("/api/notes/" + id, {
            method: "PATCH",
            body: JSON.stringify({
              action: "addTag",
              tag: value,
            }),
          });
        } catch (err) {
          console.log(err);
          notes[index].tags.pop();
          setNotes([...notes]);
        }

        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    loadNotes({})
      .then((notes) => {
        setNotes(notes);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
      });
  }, []);

  const refetch = async () => {
    setNotes([])
    setIsLoading(true);
    const notes = await loadNotes({ noCache: true });
    setNotes(notes);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto w-full max-w-full relative">
      <div className="flex p-4 gap-3 right-0 left-0 z-20 bg-neutral-50 border-b items-center absolute">
        <button
          className="flex lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <MenuIcon size={16} />
        </button>
        <h3 className="text-center">Notes</h3>

        <form
          onSubmit={onSearch}
          className="hidden lg:flex gap-3 items-center w-1/3"
        >
          <div className="inline-flex gap-2 items-center border rounded-xl px-4 py-2 bg-white">
            <SearchIcon size={16} className="text-gray-400" />
            <input
              type="search"
              className="focus:outline-none text-gray-800"
              placeholder="search by title..."
              name="search"
            />
          </div>
          <select
            className="px-4 py-2 rounded-xl border focus:outline-none"
            name="type"
            onChange={filterByType}
          >
            <option value="">All</option>
            <option value="note">Note</option>
            <option value="url">URL</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="person">Person</option>
            <option value="other">Other</option>
          </select>
        </form>
        {/* <h3 className="pl-[9rem] w-1/3">Notes</h3> */}
        <span className="flex-1" />
        <button className="flex lg:hidden">
          <Search size={16} />
        </button>
        <button
          type="submit"
          className="btn-primary flex lg:hidden"
          disabled={isCreating}
        >
          {isCreating ? (
            <span className="animate-spin">
              <LoaderIcon size={12} />
            </span>
          ) : (
            <PlusIcon size={16} />
          )}
        </button>
        <form action={addNewNote} className="hidden lg:flex gap-2">
          <input
            className="rounded-xl border focus:outline-none px-4 py-2"
            placeholder="enter a URL or email or just a note"
            name="input"
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
        <button onClick={refetch} className="btn-primary">
          Refresh
        </button>
      </div>
      {isLoading && (
        <div className="mt-24 mx-auto text-center animate-spin">
          <LoaderIcon size={24} />
        </div>
      )}
      <div className="overflow-y-auto max-w-full p-4 pt-24">
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-5 gap-4 space-y-4">
          {notes &&
            notes.map((n: Note, index: number) => (
              <NoteCard
                key={n._id}
                note={n}
                onAction={(action: string, value?: string) =>
                  onActionClicked(action, index, value)
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
}
