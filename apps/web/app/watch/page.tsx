"use client";
import { Note } from "@/entity";
import { loadNotes } from "@/services/notes.client";
import usePrefStore from "@/store/pref.store";
import NoteCard from "@/ui/NoteCard";
import {
  LoaderIcon,
  MenuIcon,
  Search,
  SearchIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Watch() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isSidebarOpen, setIsSidebarOpen } = usePrefStore();

  const onSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotes([]);
    const text = e.currentTarget.search.value;
    const type = 'media+video';
    setIsLoading(true);

    const notes = await loadNotes({ query: text, type, noCache: true });
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
    loadNotes({type: 'media+video', noCache: true})
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
        </form>
        <span className="flex-1" />
        <button className="flex lg:hidden">
          <Search size={16} />
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
