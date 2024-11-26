import { createNote } from "@/services/notes.client";
import {
  Dialog,
  TextField,
  TextArea,
  Text,
  Button,
  Grid,
  Box,
  Flex,
} from "@radix-ui/themes";
import { FormEvent, useState } from "react";

export default function NewNoteDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noteType, setNoteType] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const data = new FormData(e.currentTarget);
    console.log(e.currentTarget.value);
    const note: Record<string, string> = {
      // type: data.get("type") as string,
      // title: e.currentTarget.reminder.value,
      // description: e.currentTarget.description.value,
      // tags: [],
    };

    data.entries().forEach((e) => {
      note[e[0]] = e[1];
    })

    // for (const [key, value] of data.entries()) {
    //   note[key] = value;
    // }

    const resp = await createNote(note);
    setIsLoading(false);
    console.log(resp);
    setOpen(false)
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="ghost">New</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title my="0">Create a new note</Dialog.Title>
        <Dialog.Description my="0">
          Choose the type of block you want to create
        </Dialog.Description>

        {/* step 1: select note type  */}
        {!noteType && (
          <Box>
            <Grid gap="2" columns={"3"} my="4">
              <Button onClick={() => setNoteType("document")} variant="soft">
                Document
              </Button>
              <Button onClick={() => setNoteType("note")} variant="soft">
                Note
              </Button>
              <Button onClick={() => setNoteType("reminder")} variant="soft">
                Reminder
              </Button>
              <Button onClick={() => setNoteType("contact")} variant="soft">
                Contact
              </Button>
              <Button onClick={() => setNoteType("url")} variant="soft">
                Link
              </Button>
              <Button onClick={() => setNoteType("location")} variant="soft">
                Location
              </Button>
            </Grid>
          </Box>
        )}

        {/* step 2  */}
        <form onSubmit={onSubmit}>
          {noteType === "document" && <NewDocumentForm />}
          {noteType === "reminder" && <NewReminderForm />}
          {noteType === "note" && <NewBasicNoteForm />}
          {noteType === "contact" && <NewContactForm />}
          {noteType === "url" && <NewURLForm />}
          {noteType === "location" && <NewLocationForm />}
          <Flex gap="3" mt="4" className="items-center">
            {!!noteType && (
              <Button
                variant="ghost"
                color="gray"
                onClick={() => setNoteType(null)}
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
    <Text>Create a reminder</Text>
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
    <Text>Create a reminder</Text>
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
    <TextField.Root name="reminder" placeholder="take medicine" />
    <TextArea name="description" placeholder="need to take that at ..." />
    <input type="hidden" name="type" value={"reminder"} />
  </label>
);

const NewBasicNoteForm = () => (
  <label>
    <Text>New Note</Text>
    <TextField.Root name="reminder" placeholder="take medicine" />
    <TextArea name="description" placeholder="need to take that at ..." />
    <input type="hidden" name="type" value={"note"} />
  </label>
);

const NewDocumentForm = () => (
  <label>
    <Text>Create a document</Text>
    <TextField.Root name="reminder" placeholder="take medicine" />
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
        name="contactTitle"
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
