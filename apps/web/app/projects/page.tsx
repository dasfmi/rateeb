"use client";
import useProjectsStore from "@/store/projects.store";
import {
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  SegmentedControl,
  Text,
  TextField,
  Table,
  Link,
  Heading,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { FormEvent, useEffect, useState } from "react";
import useAppStore from "@/store/loadingIndicator.store";

export default function Projects() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const { setIsLoading } = useAppStore();
  const { projects, setProjects } = useProjectsStore();

  useEffect(() => {
    fetch("/api/projects")
      .then((resp) => resp.json())
      .then((data) => {
        if (data.ok) {
          setProjects(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [setIsLoading, setProjects]);

  return (
    <>
      <Flex py="2" px="4" className="items-center" gap="2">
        <Heading size="1">Projects</Heading>
        <Text color="gray">Organize your ideas into work directories</Text>
        <span className="flex-1" />

        <NewProjectModal />

        <SegmentedControl.Root
          defaultValue={view}
          size={"1"}
          onValueChange={(v: "grid" | "list") => setView(v)}
        >
          <SegmentedControl.Item value="grid" aria-label="grid">
            Grid
          </SegmentedControl.Item>
          <SegmentedControl.Item value="list" aria-label="list">
            List
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </Flex>
      <div className="container flex flex-col">
        {projects.length > 0 && view === "grid" && (
          <Grid
            gap="4"
            mt="4"
            columns={{ initial: "1", md: "2", lg: "3", xl: "4" }}
          >
            {projects.map((proj) => (
              <Card key={proj._id}>
                <Link href={`/projects/${proj._id}`}>
                  <Heading size="4">{proj.title}</Heading>
                  <Text size="2" color="gray">
                    {proj.description}
                  </Text>
                </Link>
              </Card>
            ))}
          </Grid>
        )}

        {projects.length > 0 && view === "list" && (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Cell>Title</Table.Cell>
                <Table.Cell>Description</Table.Cell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {projects.map((proj) => (
                <Table.Row key={proj._id}>
                  <Table.RowHeaderCell>
                    <Link href={`/projects/${proj._id}`}>{proj.title}</Link>
                  </Table.RowHeaderCell>
                  <Table.Cell>{proj.description}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}

        {projects.length == 0 && <p>No projects found</p>}
      </div>
    </>
  );
}

const NewProjectModal = ({}: {}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { projects, setProjects } = useProjectsStore();

  const createNewProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const title = e.currentTarget.projTitle.value;
    const desc = e.currentTarget.description.value;
    const proj = {
      title,
      description: desc,
      createdAt: new Date().getTime(),
      notes: [],
    };
    setProjects([{ _id: "new", ...proj }, ...projects]);
    await fetch("/api/projects", {
      method: "POST",
      body: JSON.stringify(proj),
    })
      .then((r) => r.json())
      .catch(console.error);
    setIsLoading(false);
    setOpen(false)
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant={"ghost"} size="1">
          <PlusIcon />
          Create project
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Create new project</Dialog.Title>
        <Dialog.Description size="2" mb="4" color="gray">
          Create a new project to organize your ideas
        </Dialog.Description>

        <form onSubmit={createNewProject}>
          <Flex direction={"column"} gap="3">
            <label>
              <Text>Project title</Text>
              <TextField.Root
                type="text"
                name="projTitle"
                placeholder="i.e. Building a table"
              />
            </label>

            <label>
              <Text>Project description</Text>
              <TextField.Root
                name="description"
                placeholder="collect all the information related to building the table"
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
};
