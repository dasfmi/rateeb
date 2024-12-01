import useNotificationsStore from "@/store/notifications.store";
import useProjectsStore from "@/store/projects.store";
import { Text, Dialog, Select, Flex, Button } from "@radix-ui/themes";
import { useState } from "react";

export default function AttachToProjectDialog({
  noteId,
  children,
}: {
  noteId: string | undefined;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { projects } = useProjectsStore();
  const { queueNotification } = useNotificationsStore();

  const onAttachToProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
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
      setIsLoading(false);
      setOpen(false);
    } else {
      alert("Failed to attach note to project");
      queueNotification({
        title: "Error",
        description: "Failed to attach note",
        color: "danger",
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Attach note to project</Dialog.Title>
        <Dialog.Description>Select the project</Dialog.Description>
        <form onSubmit={onAttachToProject} className="mt-4">
          <label>
            <Text>Project</Text>
            <Select.Root name="projectId">
              <Select.Trigger placeholder="select project..." />
              <Select.Content>
                {/* <Select.Item value="">Select a project</Select.Item> */}
                {projects.map((proj) => (
                  <Select.Item key={proj.id} value={proj.id!}>
                    {proj.title}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </label>

          <Flex gap="2" direction={"row"} justify={"end"} mt="4">
            <Dialog.Close>
              <Button variant="surface" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
          <Button type="submit" className="btn-primary" loading={isLoading}>
            Attach
          </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
