"use client";
import { loadNotes } from "@/services/notes.client";
import BlocksContainer, {
  BlocksDisplayType,
} from "@/components/blocks/BlocksContainer";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Button,
  Flex,
  SegmentedControl,
  Select,
  TextField,
} from "@radix-ui/themes";
import { MenuIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import NewBlockDialog from "./NewBlockDialog";
import useAppStore from "@/store/app.store";

type Props = {
  constraints?: {
    type?: string;
    tags?: string;
  };
};

export default function BlocksManager({ constraints }: Props) {
  const { blocks, setBlocks, setIsLoading, isSidebarOpen, setIsSidebarOpen } =
    useAppStore();
  const [display, setDisplay] = useState<BlocksDisplayType>("split");

  const onSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBlocks([]);
    const text = e.currentTarget.search.value;

    setIsLoading(true);

    const notes = await loadNotes({ query: text, ...constraints });
    setBlocks(notes);
    setIsLoading(false);
  };

  const filterByType = async (type: string) => {
    setBlocks([]);
    setIsLoading(true);

    const notes = await loadNotes({ type });
    setBlocks(notes);
    setIsLoading(false);
  };

  const onActionClicked = async (
    action: string,
    index: number,
    value?: string
  ) => {
    const id = blocks[index].id;
    if (!id) {
      return;
    }
    switch (action) {
      case "pin":
        blocks[index].isPinned = true;
        // move to the top
        setBlocks([blocks[index], ...blocks.filter((n, i) => i !== index)]);
        await fetch("/api/notes/" + id, {
          method: "PATCH",
          body: JSON.stringify({
            action: "pin",
          }),
        });
        break;
      case "delete":
        // const note = notes[index];
        setBlocks(blocks.filter((_n, i) => i !== index));
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
        if (!blocks[index].tags) {
          blocks[index].tags = [];
        }
        blocks[index].tags.push(value as string);
        setBlocks([...blocks]);

        try {
          await fetch("http://localhost:4000/api/blocks/" + id, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "append",
              target: "tags",
              value,
            }),
          });
        } catch (err) {
          console.log(err);
          blocks[index].tags.pop();
          setBlocks([...blocks]);
        }

        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    loadNotes({ ...constraints })
      .then((data) => setBlocks(data))
      .finally(() => setIsLoading(false));
  }, [constraints, setIsLoading]);

  return (
    <Flex direction="column" width={"full"} className="" overflowY={"auto"}>
      <Flex
        direction={"row"}
        gap="3"
        className="items-center text-xs border-b border-gray-4"
      >
        <Button
          className="flex lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          variant="soft"
          size="2"
        >
          <MenuIcon size={16} />
        </Button>
        <span className="">Blocks</span>

        <span className="flex-1" />
        <NewBlockDialog />
      </Flex>

      <Flex
        direction={"row"}
        gap="3"
        py="2"
        className="items-center text-xs border-b border-gray-4"
      >
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
              <Select.Item value="database">Database</Select.Item>
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

        <SegmentedControl.Root
          defaultValue={display}
          onValueChange={(v: BlocksDisplayType) => setDisplay(v)}
        >
          <SegmentedControl.Item value="list">List</SegmentedControl.Item>
          <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
          <SegmentedControl.Item value="split">Split</SegmentedControl.Item>
        </SegmentedControl.Root>
      </Flex>

      <div className="overflow-y-auto max-w-full">
        <BlocksContainer
          blocks={blocks}
          onAction={onActionClicked}
          display={display}
        />
      </div>
    </Flex>
  );
}
