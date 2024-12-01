import { Block } from "@/entity";
import BlockCard from "./BlockCard";
import {
  Box,
  Button,
  Flex,
  Link,
  ScrollArea,
  Section,
  Text,
} from "@radix-ui/themes";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { BlockDetailViewer } from "@/components/blocks/BlockDetailViewer";
import { useRouter, useSearchParams } from "next/navigation";
import { Scroll } from "lucide-react";
export type BlocksDisplayType = "list" | "grid" | "split";

type Props = {
  blocks: Block[];
  display: BlocksDisplayType;
  onAction: (action: string, index: number, value?: string) => void;
};

type DisplayProps = Omit<Props, "display">;

function GridView({ blocks: notes, onAction }: DisplayProps) {
  return (
    <ScrollArea style={{ height: "calc(100vh - 4rem)", width: "100%" }}>
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-5 gap-2 space-y-2 overflow-y-auto py-4">
        {notes &&
          notes.map((n: Block, index: number) => (
            <BlockCard
              key={n.id}
              block={n}
              onAction={(action: string, value?: string) =>
                onAction(action, index, value)
              }
            />
          ))}
      </div>
    </ScrollArea>
  );
}

const ListItem = ({ block }: { block: Block; onClick: () => void }) => {
  const date = new Date(block.createdAt ?? 0).toISOString().substring(0, 10);

  return (
    <Flex direction="row" gap="2" p="2">
      <DotsHorizontalIcon />
      <Link href={`/edit/${block.id}`} color="gray">
        {block.title}
      </Link>
      <span className="flex-1" />
      <Text color="gray" size="1">
        {date}
      </Text>
    </Flex>
  );
};

const SplitViewListItem = ({
  block,
  isActive,
  onClick,
}: {
  block: Block;
  isActive: boolean;
  onClick: () => void;
}) => {
  const date = new Date(block.createdAt ?? 0).toISOString().substring(0, 10);

  return (
    <Box
      onClick={onClick}
      className={`text-start border-b border-gray-4 cursor-pointer hover:bg-gray-3 ${isActive ? "bg-gray-4" : ""}`}
      p="0"
    >
      <Flex direction="row" gap="2" p="2">
        <Flex direction="column" gap="1">
          <Text>{block.title}</Text>
          <Text size="2" color="gray">
            {block.description}
          </Text>
        </Flex>
        <span className="flex-1" />
        <Text color="gray" size="1">
          {date}
        </Text>
      </Flex>
    </Box>
  );
};

function ListView({ blocks, onAction }: DisplayProps) {
  return (
    <ScrollArea style={{ height: "100vh" }}>
      <Flex direction="column" gap="2" className="bg-white-10">
        {blocks &&
          blocks.map((n: Block, index: number) => (
            <ListItem key={n.id} block={n} onClick={() => {}} />
          ))}
      </Flex>
    </ScrollArea>
  );
}

function SplitView({ blocks }: DisplayProps) {
  const router = useRouter();
  const params = useSearchParams();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const onItemClicked = (index: number) => {
    router.push(`/feed?selected=${index}`);
  };

  useEffect(() => {
    const selected = params.get("selected");
    setSelectedIndex(selected ? parseInt(selected) : null);
  }, [params]);

  return (
    <Flex direction="row" height={"full"} overflow={"hidden"}>
      <ScrollArea
        type="always"
        className="w-1/4"
        scrollbars="vertical"
        style={{ height: "100vh" }}
      >
        <Box pr="8">
          <Flex direction="column">
            {blocks &&
              blocks.map((n: Block, index: number) => (
                <SplitViewListItem
                  key={n.id}
                  block={n}
                  isActive={selectedIndex === index}
                  onClick={() => onItemClicked(index)}
                />
              ))}
          </Flex>
        </Box>
      </ScrollArea>

      {/* reader view  */}
      <Section className="flex-1" my="0" p="4">
        {selectedIndex != null && blocks.length && (
          <BlockDetailViewer initialId={blocks[selectedIndex].id!} />
        )}
      </Section>
    </Flex>
  );
}

export default function BlocksContainer({
  blocks: notes,
  onAction,
  display,
}: Props) {
  if (display === "grid") {
    return <GridView blocks={notes} onAction={onAction} />;
  } else if (display === "split") {
    return <SplitView blocks={notes} onAction={onAction} />;
  }

  return <ListView blocks={notes} onAction={onAction} />;
}
