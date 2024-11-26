"use client";
import { Note, Project } from "@/entity";
import { loadNotes } from "@/services/notes.client";
import useAppStore from "@/store/loadingIndicator.store";
import useNotificationsStore from "@/store/notifications.store";
import usePrefStore from "@/store/pref.store";
import NotesContainer from "@/ui/NotesColumns";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Button,
  Flex,
  Select,
  TextField,
} from "@radix-ui/themes";
import { MenuIcon, Search, } from "lucide-react";
import { useEffect, useState } from "react";
import NewNoteDialog from "./NewNoteDialog";

type Props = {
  constraints?: {
    type?: string;
    tags?: string;
  };
};

export default function NotesManager({ constraints }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const { setIsLoading } = useAppStore();
  const [showAttachToProjectDialog, setShowAttachToProjectDialog] =
    useState<string>();
  const [projects, setProjects] = useState<Project[]>([]);
  const { isSidebarOpen, setIsSidebarOpen } = usePrefStore();
  const { queueNotification } = useNotificationsStore();

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
    setNotes([]);
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
  }, [queueNotification]);

  useEffect(() => {
    setIsLoading(true)
    loadNotes({ ...constraints }).then((data) => setNotes(data)).finally(() => setIsLoading(false))
  }, [])


  const refetch = async () => {
    setNotes([]);
    setIsLoading(true);
    const notes = await loadNotes({ noCache: true });
    setNotes(notes);
    setIsLoading(false);
  };

  return (
    <Flex direction="column" width={"full"} className="relative">
      <Flex
        direction={"row"}
        px="2"
        py="2"
        gap="3"
        className="right-0 left-0 z-20 items-center absolute text-xs"
      >
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
          <Select.Root name="type" onValueChange={filterByType}>
            <Select.Trigger placeholder="Type" />
            <Select.Content>
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
        <span className="flex-1" />
        <button className="flex lg:hidden">
          <Search size={16} />
        </button>

        <NewNoteDialog />
        <Button variant="ghost" onClick={refetch} className="btn-primary">
          Refresh
        </Button>
      </Flex>

      <div className="overflow-y-auto max-w-full py-16">
        <NotesContainer notes={notes} onAction={onActionClicked} />
      </div>

     
      {/* </div> */}
    </Flex>
  );
}

