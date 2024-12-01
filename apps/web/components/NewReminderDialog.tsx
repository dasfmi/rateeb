import { Block } from "@/entity";
import { createNote } from "@/services/notes.client";
import {
  Dialog,
  IconButton,
  TextField,
  TextArea,
  Text,
  Button,
} from "@radix-ui/themes";
import { FormEvent, useState } from "react";

export default function NewReminderDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const note: Block = {
      type: "reminder",
      title: e.currentTarget.reminder.value,
      description: e.currentTarget.description.value,
      tags: [],
    };

    const resp = await createNote(note);
    setIsLoading(false);
    console.log(resp);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton variant="ghost">Reminder</IconButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Create a reminder</Dialog.Title>
        <form onSubmit={onSubmit}>
          <label>
            <Text>Create a reminder</Text>
            <TextField.Root name="reminder" placeholder="take medicine" />
            <TextArea
              name="description"
              placeholder="need to take that at ..."
            />
          </label>
          <Button type="submit" loading={isLoading}>
          Create
        </Button>
        </form>

      
      </Dialog.Content>
    </Dialog.Root>
  );
}
