"use client";
import { Project } from "@/entity";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Projects() {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  const createNewProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
  };

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
  }, []);

  return (
    <>
      <section className="bg-white p-4 flex flex-col">
        <h4 className="leading-9">Projects</h4>
        <p className="text-muted">Organize your ideas into work directories</p>
      </section>
      <div className="container flex flex-col">
        <form onSubmit={createNewProject}>
          <input type="text" name="projTitle" placeholder="Project title" />
          <input
            type="text"
            name="description"
            placeholder="Project description"
          />
          <button type="submit" className="btn-primary">
            Create
          </button>
        </form>

        {isLoading && <p>Loading...</p>}

        {projects.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-8">
            {projects.map((proj) => (
              <Link
                key={proj._id}
                href={`/projects/${proj._id}`}
                className="card"
              >
                <h5 className="font-bold leading-9">{proj.title}</h5>
                <p className="text-sm text-muted">{proj.description}</p>
              </Link>
            ))}
          </section>
        )}

        {projects.length == 0 && isLoading === false && (
          <p>No projects found</p>
        )}
      </div>
    </>
  );
}
