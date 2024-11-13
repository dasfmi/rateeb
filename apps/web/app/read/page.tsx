"use client";
import NotesManager from "@/components/NotesManager";

export default function Music() {
  return <NotesManager constraints={{ tags: "read-later" }} />;
}
