"use client";
import { BlockDetailViewer } from "@/components/blocks/BlockDetailViewer";

export default function EditBlock({ params }: { params: { id: string } }) {
  return <BlockDetailViewer initialId={params.id} />;
}
