"use client";
import { Note } from "../entity";
import NoteCard from "../components/NoteCard";
import { LoaderIcon, PlusIcon, Search, SearchIcon } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import QuickJump from "../components/QuickJump";

const loadNotes = async ({
  query,
  type,
}: {
  query?: string;
  type?: string;
}) => {
  const searchParams = new URLSearchParams();
  if (query) {
    searchParams.set("title", query);
  }
  console.log({type})
  if (type) {
    searchParams.set("type", type);
  }

  // try load to load notes from localStorage, if not found, fetch from the server
  if (searchParams.size === 0) {
    const notes = localStorage.getItem('notes')
    if (notes) {
      console.log({ localNotes: notes })
      const payload = JSON.parse(notes)
      // if payload is saved for more than 60 minutes, then fetch from the server
      if (payload.createdAt + (60 * 60 * 1000) > new Date().getTime() && payload.notes?.length > 0) {
        return payload.notes
      }
    }
  }

  const resp = await fetch("https://rateeb.dasfmi.com/api/notes?" + searchParams.toString());
  const { data } = await resp.json();
  // save the notes to localStorage
  if (searchParams.size === 0) {
    localStorage.setItem('notes', JSON.stringify({createdAt: new Date().getTime(), notes: data}))
  }

  return data;
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const addNewNote = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    const text = e.currentTarget.get("input")?.toString();

    const note: Note = {
      type: "note",
      title: "",
      text: text,
      tags: [],
      createdAt: new Date().getTime(),
    };

    const resp = await fetch("https://rateeb.dasfmi.com/api/notes", {
      method: "post",
      body: JSON.stringify(note),
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
        await fetch("https://rateeb.dasfmi.com/api/notes/" + id, {
          method: "PATCH",
          body: JSON.stringify({
            action: "pin",
          }),
        });
        notes[index].isPinned = true;
        // move to the top
        setNotes([notes[index], ...notes.filter((_n, i) => i !== index)]);
        break;
      case "delete":
        await fetch("https://rateeb.dasfmi.com/api/notes/" + id, {
          method: "DELETE",
        });
        setNotes(notes.filter((_n, i) => i !== index));
        break;
      case "addTag":
        if (!notes[index].tags) {
          notes[index].tags = [];
        }
        notes[index].tags.push(value as string);
        setNotes([...notes])

        try {
          await fetch("https://rateeb.dasfmi.com/api/notes/" + id, {
            method: "PATCH",
            body: JSON.stringify({
              action: "addTag",
              tag: value,
            }),
          });
        } catch (err) {
          console.log(err)
          notes[index].tags.pop();
          setNotes([...notes])
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

  return (
    <div className="flex flex-col h-full overflow-y-auto w-full max-w-full relative">
      <div className="flex p-4 gap-3 right-0 left-0 z-20 bg-neutral-50 border-b items-center absolute">
        <h3 className="text-center">Notes</h3>

        <form onSubmit={onSearch} className="hidden lg:flex gap-3 items-center w-1/3">
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
        <button className="flex lg:hidden"><Search size={16} /></button>
        <button type="submit" className="btn-primary flex lg:hidden" disabled={isCreating}>
            {isCreating ? (
              <span className="animate-spin">
                <LoaderIcon size={12} />
              </span>
            ) : (
              <PlusIcon size={16} />
            )}
          </button>
        <form className="hidden lg:flex gap-2" onSubmit={addNewNote}>
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
      </div>
      <QuickJump />
      {isLoading && (
        <div className="mt-24 mx-auto text-center animate-spin">
          <LoaderIcon size={24} />
        </div>
      )}
      <div className="overflow-y-auto max-w-full p-4 h-full">
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-5 gap-4 space-y-4">
          {notes && notes.map((n: Note, index: number) => (
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
