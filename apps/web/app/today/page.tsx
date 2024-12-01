"use client";
import { Block } from "@/entity";
import BlocksContainer from "@/components/blocks/BlocksContainer";
import { useEffect, useState } from "react";

export default function TodayPage() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfDayUnix = startOfDay.getTime();
  // const filteredNotes = notes.filter(
  //   (note) =>
  //     note.type === "reminder" ||
  //     (note.createdAt && note.createdAt > startOfDayUnix)
  // );
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    fetch(`http://localhost:4000/api/blocks?createdAt=gt:${startOfDayUnix}`)
      .then((resp) => resp.json())
      .then((data) => {
        setBlocks(data.data);
      });
  }, [])

  return <BlocksContainer blocks={blocks} onAction={() => {}} />;
}
