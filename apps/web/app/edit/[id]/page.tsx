"use client";
import { Note } from "@/entity";
import { loadNotes } from "@/services/notes.client";
import NoteCard from "@/ui/NoteCard";
import Spinner from "@/ui/Spinner";
import { OutputData } from "@editorjs/editorjs";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const TextEditor = dynamic(() => import("@/ui/TextEditor"), {
  ssr: false,
});

// import TextEditor from "@/ui/TextEditor";

export default function EditDocument({ params }: { params: { id: string } }) {
  const [id, setID] = useState<string>();
  const [data, setData] = useState<OutputData>({
    blocks: [
      {
        type: "header",
        data: {
          text: "New Document",
          level: 1,
        },
      },
      {
        type: "paragraph",
        data: {
          text: "Start writing your document",
        },
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (params.id !== "new") {
      fetch("/api/notes/" + params.id)
        .then((resp) => resp.json())
        .then((data) => {
          console.log("data is", data.data.body);
          setID(params.id);
          setData(data.data.body);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadNotes({}).then((notes) => {
      setNotes(notes);
    });
  }, []);

  const saveData = async (data: OutputData) => {
    let title = "";
    let description = "";
    let foundTitle = false;
    let foundDesc = false;
    for (let i = 0; i < data.blocks.length && !foundDesc; i++) {
      if (
        data.blocks[i].type === "header" ||
        data.blocks[i].type === "paragraph"
      ) {
        if (!foundTitle) {
          title = data.blocks[i].data.text;
          foundTitle = true;
        } else if (!foundDesc) {
          description = data.blocks[i].data.text;
          foundDesc = true;
          break;
        }
      }
    }

    const payload = {
      type: "note",
      title,
      description,
      body: data,
      updatedAt: data.time,
    };

    console.log("checking for id", id);
    if (!id) {
      const resp = await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((r) => r.json());

      console.log("created new document", resp.data._id);
      setID(resp.data._id);
      console.log("id has been set to", id);
    } else {
      console.log("it should update the document", { id });

      await fetch(`/api/notes/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((r) => r.json());

      console.log("update note", id);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white w-full h-screen p-4 text-center flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex w-full h-full overflow-y-auto">
      <TextEditor data={data} onChange={saveData} holder="editor_create" />
      <aside className="flex flex-col gap-3 w-1/4 p-4 max-h-full overflow-y-auto">
        {notes.map((note) => (
          <NoteCard key={note._id} note={note} onAction={() => {}} />
        ))}
      </aside>
    </div>
  );
}
