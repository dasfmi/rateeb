"use client";
import { Block, View, ViewColumn } from "@/entity";
import useAppStore from "@/store/app.store";
import BlockCard from "@/components/blocks/BlockCard";
import BlocksContainer from "@/components/blocks/BlocksContainer";
import { Flex, Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";

export default function ViewDetail({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<View>();
  const { blocks, setBlocks } = useAppStore();

  useEffect(() => {
    fetch(`http://localhost:4000/api/views/${params.id}`)
      .then((resp) => resp.json())
      .then((resp) => {
        setView(resp.data);
        setBlocks(resp.data.blocks);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [params.id]);

  return (
    <>
      {view && (
        <Flex className="border-b items-center" gap="2" py="1">
          <Heading size="5">{view.title}</Heading>
          {/* <p className="text-muted text-sm">{project.description}</p> */}
        </Flex>
      )}
      <div className="container mt-4">
        {isLoading && <p>Loading...</p>}

        {view?.type === "kanban" && (
          <KanbanBoard columns={view.properties?.columns} blocks={blocks} />
        )}

        {view?.type === "list" && (
          <BlocksContainer
            display="grid"
            blocks={view?.blocks ?? []}
            onAction={function (
              action: string,
              index: number,
              value?: string
            ): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
      </div>
    </>
  );
}

export const KanbanBoard = ({
  columns,
  blocks,
}: {
  columns: Record<string, ViewColumn>;
  blocks: Block[];
}) => {
  return (
    <Flex gap="4" className="overflow-x-auto">
      {Object.keys(columns).map((key) => {
        const column = columns[key];
        return (
          <KanbanColumn
            key={key}
            title={column.title}
            tag={column.tag}
            color={column.color}
            blocks={
              column.tag
                ? blocks.filter((b) => b.tags.includes(column.tag))
                : blocks
            }
          />
        );
      })}
    </Flex>
  );
};

export const KanbanColumn = ({
  title,
  tag,
  color,
  blocks,
}: {
  title: string;
  tag: string;
  color: string;
  blocks: Block[];
}) => {
  return (
    <Flex direction="column" gap="4" className="p-2 w-1/4">
      <Heading size="3">{title}</Heading>
      {blocks.map((block) => (
        <BlockCard
          key={block.id}
          block={block}
          onAction={function (action: string): void {
            throw new Error("Function not implemented.");
          }}
        />
      ))}
    </Flex>
  );
};
