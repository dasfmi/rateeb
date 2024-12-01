import { Block } from "@/entity";
import { OutputData } from "@editorjs/editorjs";
import { Container, Flex } from "@radix-ui/themes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const TextEditor = dynamic(() => import("@/ui/TextEditor"), {
  ssr: false,
});

export function DocumentEditor({
  block,
  onSave,
}: {
  block: Block;
  onSave: (block: Block) => void;
}) {
  const [data, setData] = useState({
    blocks: block.blocks,
    version: block.version,
    updatedAt: block.updatedAt,
  });
  const saveData = async (data: OutputData) => {
    const payload: Block = {
      ...block,
      blocks: data.blocks,
      version: data.version,
      updatedAt: data.time,
    };

    onSave(payload);
  };

  const titleChanged = (text: string) => {
    onSave({ ...block, title: text });
  };

  const descriptionChanged = (text: string) => {
    onSave({ ...block, description: text });
  };

  // update date on block changes
  useEffect(() => {
    console.log("id changes, data should be updated", block.blocks);
    setData({
      blocks: block.blocks,
      version: block.version,
      updatedAt: block.updatedAt,
    });
  }, [block]);

  return (
    <>
      <Container size="2">
        <Flex direction={"column"} gap="0">
          <input
            value={block?.title}
            className="border-none font-bold text-4xl focus:outline-none px-5 py-2"
            placeholder="page title..."
            onChange={(e) => titleChanged(e.target.value)}
          />
          <input
            value={block?.description}
            className="border-none text-gray-9 text-lg focus:outline-none px-5 py-2"
            placeholder="summary ..."
            onChange={(e) => descriptionChanged(e.target.value)}
          />
        </Flex>
      </Container>
      <div className="flex w-full h-full overflow-y-auto">
        <TextEditor data={data} onChange={saveData} holder="editor_create" />
      </div>
    </>
  );
}
