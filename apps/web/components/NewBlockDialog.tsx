import { Block } from "@/entity";
import { createNote } from "@/services/notes.client";
import useAppStore from "@/store/app.store";
import {
  Dialog,
  TextField,
  TextArea,
  Text,
  Button,
  Grid,
  Box,
  Flex,
  Select,
} from "@radix-ui/themes";
import { FormEvent, useEffect, useState } from "react";

export default function NewBlockDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blockType, setBlockType] = useState<string | null>(null);
  const { createBlock } = useAppStore();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const data = new FormData(e.currentTarget);
    const note: Block = {
      // @ts-expect-error not sure how to fix this
      type: data.get("type")?.toString(),
      title: data.get("title")?.toString() || "",
      description: data.get("description")?.toString() || "",
      // @ts-expect-error implement types for properties
      properties: {},
      tags: [],
    };

    data.entries().forEach((e) => {
      if (e[0] in ["type", "title", "description", "tags", "thumbnail"]) return;
      // @ts-expect-error implement types for properties
      note.properties[e[0]] = e[1];
    });

    // for (const [key, value] of data.entries()) {
    //   note[key] = value;
    // }
    await createBlock(note);

    // console.log({ resp})
    setIsLoading(false);
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="ghost">New</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title my="0">Create a new block</Dialog.Title>

        {/* step 1: select note type  */}
        {!blockType && (
          <Box>
            <Dialog.Description my="0" color="gray">
              Choose the type of block you want to create
            </Dialog.Description>
            <Grid gap="2" columns={"3"} my="4">
              <Button onClick={() => setBlockType("document")} variant="soft">
                Document
              </Button>
              <Button onClick={() => setBlockType("chart")} variant="soft">
                Chart
              </Button>
              <Button onClick={() => setBlockType("contact")} variant="soft">
                Contact
              </Button>
              <Button onClick={() => setBlockType("url")} variant="soft">
                Link
              </Button>
              <Button onClick={() => setBlockType("location")} variant="soft">
                Location
              </Button>
            </Grid>
          </Box>
        )}

        {/* step 2  */}
        <form onSubmit={onSubmit}>
          {blockType === "document" && <NewDocumentForm />}
          {blockType === "reminder" && <NewReminderForm />}
          {blockType === "chart" && <NewChartForm />}
          {blockType === "contact" && <NewContactForm />}
          {blockType === "url" && <NewURLForm />}
          {blockType === "location" && <NewLocationForm />}
          <Flex gap="3" mt="4" className="items-center">
            {!!blockType && (
              <Button
                variant="ghost"
                color="gray"
                onClick={() => setBlockType(null)}
              >
                Back
              </Button>
            )}
            <span className="flex-1" />
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit" loading={isLoading}>
              Save
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

const NewURLForm = () => (
  <label>
    <Text>Add URL</Text>
    <TextField.Root
      name="url"
      type="url"
      placeholder="https://something.com/"
    />
    <input type="hidden" name="type" value={"url"} />
  </label>
);

const NewLocationForm = () => (
  <label>
    <Text>Add location URL</Text>
    <TextField.Root
      name="url"
      type="url"
      placeholder="https://maps.google.com/"
    />
    <input type="hidden" name="type" value={"location"} />
  </label>
);

const NewReminderForm = () => (
  <label>
    <Text>Create a reminder</Text>
    <TextField.Root name="title" placeholder="take medicine" />
    <TextArea name="description" placeholder="need to take that at ..." />
    <input type="hidden" name="type" value={"reminder"} />
  </label>
);

const NewChartForm = () => {
  const [datasets, setDatasets] = useState<Block[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/blocks?type=eq:database")
      .then((resp) => resp.json())
      .then((resp) => setDatasets(resp.data))
  }, []);

  return (
    <Flex direction="column">
      <Text>New Chart</Text>
      <label>
        <Text>Title</Text>
        <TextField.Root name="title" placeholder="Accounts pie chart" />
      </label>
      <label>
        <Text>Description</Text>
        <TextArea name="description" placeholder="view accounts..." />
      </label>
      <label>
        <Text>Dataset</Text>
        <Select.Root name="dataset">
          <Select.Trigger placeholder="select target dataset" />
          <Select.Content>
            {datasets.map((d) => (
              <Select.Item key={d.id} value={d.id!}>
                {d.title}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </label>
      <input type="hidden" name="type" value={"chart"} />
    </Flex>
  );
};

const NewDocumentForm = () => (
  <label>
    <Text>Create a document</Text>
    <TextField.Root name="title" placeholder="take medicine" />
    <TextArea name="description" placeholder="need to take that at ..." />
    <input type="hidden" name="type" value={"document"} />
  </label>
);

const NewContactForm = () => (
  <Flex direction={"column"} gap="3">
    <label>
      <Text>Name</Text>
      <TextField.Root
        type="text"
        name="title"
        placeholder="i.e. Ahmed Mohammad"
        required
        autoComplete="off"
      />
    </label>

    <label>
      <Text>Description</Text>
      <TextField.Root
        name="description"
        placeholder="any info to add about the contact?"
        autoComplete="off"
      />
    </label>

    <label>
      <Text>Email</Text>
      <TextField.Root
        name="email"
        type="email"
        placeholder="ahmed@mohammad.com"
        autoComplete="off"
      />
    </label>

    <label>
      <Text>Phone Number</Text>
      <TextField.Root
        name="phone"
        placeholder="i.e. +543721230"
        autoComplete="off"
      />
    </label>

    <label>
      <Text>Address</Text>
      <TextField.Root
        name="address"
        placeholder="Dubai, UAE"
        autoComplete="off"
      />
    </label>

    <label>
      <Text>Site</Text>
      <TextField.Root
        name="site"
        type="url"
        placeholder="https://dasfmi.com"
        autoComplete="off"
      />
    </label>

    <label>
      <Text>Linkedin</Text>
      <TextField.Root
        name="linkedin"
        type="url"
        placeholder="https://linkedin.com/in/dasfmi"
        autoComplete="off"
      />
    </label>

    <label>
      <Text>Github</Text>
      <TextField.Root
        name="github"
        type="url"
        placeholder="https://github.com/dasfmi"
        autoComplete="off"
      />
    </label>

    <input type="hidden" name="type" value={"contact"} />
  </Flex>
);
