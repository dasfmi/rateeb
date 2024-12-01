import { Dialog, Button, Flex, TextField, Select, Text } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import useAppStore from "@/store/app.store";

export default function NewViewDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { views, setViews } = useAppStore();

  const createNewView = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData(e.currentTarget);
    const title = data.get("title");
    const description = data.get("description");
    const tags = data.getAll("tags");
    const view = {
      title,
      description,
      target: { tags },
      type: "list",
      createdAt: new Date().getTime(),
    };
    const newView = await fetch("http://localhost:4000/api/views", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(view),
    })
      .then((r) => r.json())
      .catch(console.error);
    setIsLoading(false);
    setOpen(false);
    setViews([...views, newView.data]);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant={"ghost"} size="1">
          <PlusIcon />
          Create view
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Create new view</Dialog.Title>
        <Dialog.Description size="2" mb="4" color="gray">
          Create a new view to group your ideas
        </Dialog.Description>

        <form onSubmit={createNewView}>
          <Flex direction={"column"} gap="3">
            <label>
              <Text>Project title</Text>
              <TextField.Root
                type="text"
                name="title"
                placeholder="i.e. Building a table"
              />
            </label>

            <label>
              <Text>description</Text>
              <TextField.Root
                name="description"
                placeholder="collect all the information related to building the table"
              />
            </label>

            <label className="flex flex-col">
              <Text>Type</Text>
              <Select.Root name="type" value="list">
                <Select.Trigger placeholder="select type" />
                <Select.Content>
                  <Select.Item value="list">List</Select.Item>
                  <Select.Item value="kanban">Kanban</Select.Item>
                </Select.Content>
              </Select.Root>
            </label>

            <label>
              <Text>Tags</Text>
              <TextField.Root
                name="tags"
                placeholder="tags to show blocks that contains it"
              />
            </label>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" loading={isLoading}>
                Save
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
