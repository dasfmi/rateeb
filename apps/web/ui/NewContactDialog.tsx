import { Block } from "@/entity";
import { createNote } from "@/services/notes.client";
import useNotificationsStore from "@/store/notifications.store";
import { Button, Dialog, Flex, TextField, Text } from "@radix-ui/themes";
import { FormEvent, ReactNode } from "react";

type Props = {
  // open: boolean;
  // onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
};

export default function NewContactDialog({ children }: Props) {
  const { queueNotification } = useNotificationsStore();

  const _onCreateNewContact = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const contact: Block = {
      type: "contact",
      title: "",
      tags: [],
    };
    // run validation
    if (!e.currentTarget.contactTitle.value) {
      queueNotification({
        color: "danger",
        title: "Title is required",
        description: "fill in the contact name",
      });
    }
    contact.title = e.currentTarget.contactTitle.value;
    contact.description = e.currentTarget.description.value;
    contact.email = e.currentTarget.email.value;
    contact.phones = e.currentTarget.phones.value;
    contact.address = e.currentTarget.address.value;
    contact.site = e.currentTarget.address.value;
    contact.linkedin = e.currentTarget.linkedin.value;
    contact.github = e.currentTarget.github.value;

    const resp = await createNote(contact);
    if (!resp.ok) {
      queueNotification({
        color: "danger",
        title: "Failed to create block",
        description: resp.errors[0],
      });
      return;
    }

    // setNewContactDialogOpen(false);
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Create new contact</Dialog.Title>
        <Dialog.Description size="2" mb="4" color="gray">
          Fill in contact details
        </Dialog.Description>

        <form onSubmit={_onCreateNewContact}>
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

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button>Save</Button>
              </Dialog.Close>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
