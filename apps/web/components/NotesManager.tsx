"use client";
import { Note, Project } from "@/entity";
import { loadNotes } from "@/services/notes.client";
import useNotificationsStore from "@/store/notifications.store";
import usePrefStore from "@/store/pref.store";
import NotesContainer from "@/ui/NotesColumns";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Flex,
  Select,
  Separator,
  TextField,
} from "@radix-ui/themes";
import {
  LoaderIcon,
  MenuIcon,
  PlusIcon,
  Search,
  SearchIcon,
  ChevronDownIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  constraints?: {
    type?: string;
    tags?: string;
  };
};

export default function NotesManager({ constraints }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showAttachToProjectDialog, setShowAttachToProjectDialog] =
    useState<string>();
  const [projects, setProjects] = useState<Project[]>([]);
  const { isSidebarOpen, setIsSidebarOpen } = usePrefStore();
  const { queueNotification } = useNotificationsStore();

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

    setIsLoading(true);

    const notes = await loadNotes({ query: text, ...constraints });
    setNotes(notes);
    setIsLoading(false);
  };

  const filterByType = async (type: string) => {
    // e.preventDefault();
    setNotes([]);
    // const type = e.target.value;
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
        notes[index].isPinned = true;
        // move to the top
        setNotes([notes[index], ...notes.filter((n, i) => i !== index)]);
        await fetch("/api/notes/" + id, {
          method: "PATCH",
          body: JSON.stringify({
            action: "pin",
          }),
        });
        break;
      case "delete":
        // const note = notes[index];
        setNotes(notes.filter((_n, i) => i !== index));
        try {
          await fetch("/api/notes/" + id, {
            method: "DELETE",
          });
        } catch (e) {
          console.log(e);
          // TODO: insert the note back at its index
        }
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
      case "attachToProject":
        setShowAttachToProjectDialog(notes[index]._id);
      default:
        break;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const initialNotes: Note[] = localStorage.getItem("notes")
      ? JSON.parse(localStorage.getItem("notes") || "").data
      : [];
    setNotes(initialNotes);
    loadNotes({
      ...constraints,
    })
      .then((notes) => {
        console.log({ notes });
        setNotes(notes);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err instanceof Error) {
          console.log(err.message);
          queueNotification({
            title: "Error",
            description: err.message,
            color: "danger",
          });
        }
        setIsLoading(false);
      });
  }, [constraints]);

  useEffect(() => {
    fetch("/api/projects")
      .then((resp) => resp.json())
      .then((resp) => resp.data)
      .then(setProjects)
      .catch((err) => {
        if (err instanceof Error) {
          console.log(err.message);
          queueNotification({
            title: "Error",
            description: err.message,
            color: "danger",
          });
        }
      });
  }, []);

  const refetch = async () => {
    setNotes([]);
    setIsLoading(true);
    const notes = await loadNotes({ noCache: true });
    setNotes(notes);
    setIsLoading(false);
  };

  return (
    <Flex direction="column" width={"full"} className="relative">
      {/* <div className="flex flex-col h-full overflow-y-auto w-full max-w-full relative"> */}
      <Flex
        direction={"row"}
        px="6"
        py="2"
        gap="3"
        className="right-0 left-0 z-20 items-center absolute text-xs"
      >
        {/* <div className="flex px-6 py-2 gap-3 right-0 left-0 z-20 border-b items-center absolute text-xs bg-white"> */}
        <Button
          className="flex lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          variant="soft"
          size="2"
        >
          <MenuIcon size={16} />
        </Button>
        <span className="">Notes</span>

        <form
          onSubmit={onSearch}
          className="hidden lg:flex gap-3 items-center w-1/3"
        >
          {/* <div className="inline-flex gap-2 items-center border rounded-xl px-4 py-2 "> */}
          {/* <SearchIcon size={16} className="text-gray-400" /> */}
          <TextField.Root
            type="search"
            className="border-l-none"
            placeholder="search by title..."
            name="search"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon />
            </TextField.Slot>
          </TextField.Root>
          {/* </div> */}
          <Select.Root
            // className="px-4 py-2 rounded-xl border focus:outline-none"
            name="type"
            onValueChange={filterByType}
          >
            <Select.Trigger placeholder="Type" />
            <Select.Content>
              {/* <Select.Label>Select note type</Select.Label> */}
              {/* <Select.Item value="">All</Select.Item> */}
              <Select.Item value="doc">Document</Select.Item>
              <Select.Item value="note">Note</Select.Item>
              <Select.Item value="url">URL</Select.Item>
              <Select.Item value="image">Image</Select.Item>
              <Select.Item value="video">Video</Select.Item>
              <Select.Item value="person">Person</Select.Item>
              <Select.Item value="other">Other</Select.Item>
            </Select.Content>
          </Select.Root>
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

        <AddMenu />
        <button onClick={refetch} className="btn-primary">
          Refresh
        </button>
      </Flex>

      {/* <Separator my="3" size="4" /> */}

      {isLoading && (
        <div className="mt-24 mx-auto text-center animate-spin">
          <LoaderIcon size={24} />
        </div>
      )}

      <div className="overflow-y-auto max-w-full py-16">
        <NotesContainer notes={notes} onAction={onActionClicked} />
      </div>

      <div
        className={`${showAttachToProjectDialog ? "absolute w-[60ch] h-auto rounded-xl shadow border p-4 top-24 bg-white z-40 left-[7.5%] flex flex-col" : "hidden"}`}
      >
        <AttachToProjectModal
          projects={projects}
          noteId={showAttachToProjectDialog}
        />
      </div>
      {/* </div> */}
    </Flex>
  );
}

const AttachToProjectModal = ({
  projects,
  noteId,
}: {
  projects: Project[];
  noteId: string | undefined;
}) => {
  const { queueNotification } = useNotificationsStore();

  const onAttachToProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resp = await fetch(
      `/api/projects/${e.currentTarget.projectId.value}/notes`,
      {
        method: "POST",
        body: JSON.stringify({ noteId }),
      }
    ).then((resp) => resp.json());

    if (resp.ok) {
      alert("Note attached to project successfully");
      queueNotification({
        title: "Note added to project",
        description: "Note attached to project successfully",
        color: "success",
      });
    } else {
      alert("Failed to attach note to project");
      queueNotification({
        title: "Error",
        description: "Failed to attach note",
        color: "danger",
      });
    }
  };

  return (
    <>
      <h4>Attach note to project</h4>
      <form onSubmit={onAttachToProject}>
        <Select.Root name="projectId">
          <Select.Trigger />
          <Select.Content>
            {/* <Select.Item value="">Select a project</Select.Item> */}
            {projects.map((proj) => (
              <Select.Item key={proj._id} value={proj._id!}>
                {proj.title}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <button type="submit" className="btn-primary">
          Attach
        </button>
      </form>
    </>
  );
};

const AddMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="btn-primary flex gap-2 h-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <PlusIcon size={16} />
        <ChevronDownIcon size={16} />
      </button>
      <nav
        className={`bg-white rounded-lg shadow absolute flex flex-col divide-y min-w-[12rem] right-0 ${isOpen ? "block" : "hidden"}`}
        id="add-menu"
      >
        <Link
          href="/edit/new"
          className="p-4 hover:bg-neutral-100 rounded-lg text-left"
        >
          Document
          <p className="text-muted text-xs">notion like document</p>
        </Link>
        <Link
          href="/edit/new?type=contact"
          className="p-4 hover:bg-neutral-100 rounded-lg text-left"
        >
          Contact
          <p className="text-muted text-xs">i.e: person or a company</p>
        </Link>
        <Link
          href="/edit/new?type=url"
          className="p-4 hover:bg-neutral-100 rounded-lg text-left"
        >
          Link
          <p className="text-muted text-xs">i.e: a site or a youtube video</p>
        </Link>
        <Link
          href="/edit/new?type=canvas"
          className="p-4 hover:bg-neutral-100 rounded-lg text-left"
        >
          Canvas
          <p className="text-muted text-xs">write your notes on infinitely</p>
        </Link>
      </nav>
    </div>
  );
};
