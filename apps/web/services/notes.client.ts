"use client";

import { Block } from "@/entity";

// loadNotes: tries to load notes from cache, if not found, fetch from the server
export const loadNotes = async ({
  query,
  type,
  tags,
}: {
  query?: string;
  type?: string;
  tags?: string;
  noCache?: boolean;
}) => {
  const searchParams = new URLSearchParams();
  if (query) {
    searchParams.set("title", `contains:${query}`);
  }
  if (type) {
    searchParams.set("type", `eq:${type}`);
  }
  if (tags) {
    searchParams.set("tags", `in:${tags}`);
  }


  const { data } = await fetch("http://localhost:4000/api/blocks?" + searchParams.toString()).then(
    (resp) => resp.json(),
  );
  
  return data;
};

export const createNote = async (note: Block) => {
  const resp = await fetch("/api/notes", {
    method: "POST",
    body: JSON.stringify(note),
  }).then((resp) => resp.json());

  return resp;
};
