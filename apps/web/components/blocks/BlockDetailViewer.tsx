import { Block } from "@/entity";
import CanvasRoot from "@/ui/canvas/CanvasRoot";
import { OutputData } from "@editorjs/editorjs";
import { Container, Flex, Spinner, TextField } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import ChartBlock from "./ChartBlock";
import DatabaseBlock from "./DatabaseBlock";
import { DocumentEditor } from "./DocumentEditor";
import BlockCard from "@/components/blocks/BlockCard";

export const BlockDetailViewer = ({ initialId: id }: { initialId: string }) => {
  const [block, setBlock] = useState<Block | null>();
  const [isLoading, setIsLoading] = useState(true);
  // const type = query.get("type") || "note";

  // const onSave = async (payload: OutputData) => {
  //   if (id.current === "new") {
  //     const resp = await fetch("http://localhost:4000/api/blocks", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         ...block,
  //         ...payload,
  //         createdAt: new Date().getTime(),
  //       }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }).then((r) => r.json());

  //     // setID(resp.data._id);
  //     id.current = resp.data._id;
  //   } else {
  //     await fetch(`http://localhost:4000/api/blocks/${id.current}`, {
  //       method: "PATCH",
  //       body: JSON.stringify({
  //         action: "updateDocument",
  //         value: { ...block, ...payload },
  //       }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //       .then((r) => r.json())
  //       .catch(console.error);
  //   }
  // };

  const saveBlock = async (block: Block) => {
    console.log('new block', block)
    setBlock(block);
    await fetch(`http://localhost:4000/api/blocks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        action: "updateDocument",
        value: { ...block },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .catch(console.error);
  };

  useEffect(() => {
    fetch("http://localhost:4000/api/blocks/" + id)
      .then((resp) => resp.json())
      .then((resp) => {
        setBlock(resp.data);
        setIsLoading(false);
      });
  }, [id]);

  if (!block || isLoading) {
    return (
      <div className="bg-white w-full h-screen p-4 text-center flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  switch (block.type) {
    case "document":
      return (
        <DocumentEditor block={block} onSave={saveBlock} />
      );
    case "chart":
      return <ChartBlock block={block} />;
    case "canvas":
      return <CanvasRoot data={data} />;
    case "database":
      return (
        <DatabaseBlock
          block={block}
          onSave={(b) => {
            saveBlock(b);
          }}
        />
      );
    default:
      return (
        <Container size="1">
          <BlockCard block={block} onAction={() => {}} />
        </Container>
      );
  }
};
