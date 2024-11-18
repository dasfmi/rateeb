"use client";
import { Note } from "@/entity";
import { loadNotes } from "@/services/notes.client";
import CanvasRoot from "@/ui/canvas/CanvasRoot";
import NoteCard from "@/ui/NoteCard";
import Spinner from "@/ui/Spinner";
import { OutputData } from "@editorjs/editorjs";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
const TextEditor = dynamic(() => import("@/ui/TextEditor"), {
  ssr: false,
});

export default function EditBlock({ params }: { params: { id: string } }) {
  const query = useSearchParams();
  const [id, setID] = useState<string>("new");
  const [data, setData] = useState<OutputData>({
    blocks: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const type = query.get("type") || "note";

  const onSave = async (payload: OutputData) => {
    if (id === 'new') {
      const resp = await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((r) => r.json());

      setID(resp.data._id);
    } else {
      await fetch(`/api/notes/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((r) => r.json()).catch(console.error);
    }
  };

  useEffect(() => {
    if (params.id !== "new") {
      fetch("/api/notes/" + params.id)
        .then((resp) => resp.json())
        .then((data) => {
          setID(params.id);
          setData(data.data ?? { blocks: [] });
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="bg-white w-full h-screen p-4 text-center flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  switch (type) {
    case "canvas":
      return <CanvasRoot data={data} />;
    default:
      return <EditDocument id={id} data={data} onSave={onSave} />;
  }
}

function EditDocument({
  data,
  onSave,
}: {
  id: string;
  data: OutputData;
  onSave: (payload: OutputData) => void;
}) {
  const [notes, setNotes] = useState<Note[]>([]);

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
      type: "doc",
      title,
      description,
      blocks: data.blocks,
      version: data.version,
      updatedAt: data.time,
    };

    onSave(payload);
  };

  return (
    <div className="flex w-full h-full overflow-y-auto">
      <div className="w-3/4">
        <TextEditor data={data} onChange={saveData} holder="editor_create" />
      </div>
      <aside className="flex flex-col gap-3 w-1/4 p-4 max-h-full overflow-y-auto">
        {notes.map((note) => (
          <NoteCard key={note._id} note={note} onAction={() => {}} />
        ))}
      </aside>
    </div>
  );
}
