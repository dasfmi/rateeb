"use client";
import { Block } from "@/entity";
import BlocksContainer from "@/components/blocks/BlocksContainer";
import { useEffect, useState } from "react";
import TodayPage from "./today/page";

export default function Homepage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [homepage, setHomepage] = useState<Block | null>(null);

  useEffect(() => {
    fetch(`http://localhost:4000/api/blocks/homepage`)
      .then((resp) => resp.json())
      .then((data) => {
        setHomepage(data.data);
        console.log(data.children)
        setBlocks(data.children);
      })
      .catch(() => setHomepage(null));
  }, [])

  if (homepage) {
    return <BlocksContainer blocks={blocks} onAction={() => {}} display="grid" />;
  }
  
  return <TodayPage />
}
