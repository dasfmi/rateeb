"use client";
import { Note, Project } from "@/entity";
import NotesContainer from "@/ui/NotesColumns";
import { Flex, Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<Project>();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetch(`/api/projects/${params.id}`)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.ok) {
          setProject(data.data.project);
          setNotes(data.data.notes);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      {project && (
        <Flex className="border-b items-center" gap="2" py="1">
          <Heading size="5">{project.title}</Heading>
          {/* <p className="text-muted text-sm">{project.description}</p> */}
        </Flex>
      )}
      <div className="container mt-4">
        {isLoading && <p>Loading...</p>}

        <NotesContainer
          notes={notes}
          onAction={function (
            action: string,
            index: number,
            value?: string
          ): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </>
  );
}
