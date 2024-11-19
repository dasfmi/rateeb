"use client";
import { Note, Project } from "@/entity";
import NotesContainer from "@/ui/NotesColumns";
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
        <section className="bg-white py-2 px-10 border-b">
          <h5 className="leading-9">{project.title}</h5>
          <p className="text-muted text-sm">{project.description}</p>
        </section>
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
