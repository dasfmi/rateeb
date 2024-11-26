"use Client";

import { Badge, IconButton, Flex } from "@radix-ui/themes";
import { TrashIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function Tag({
  tag,
  onDelete,
}: {
  tag: string;
  onDelete: () => void;
}) {
  const [showControls, setShowControls] = useState(false);

  return (
    <Badge
      className="whitespace-nowrap"
      onMouseOver={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <Flex gap="1" className="items-center">
        {tag}
        <span className="flex-1" />
        <IconButton
          className={` right-1 ${showControls ? "inline-block" : "invisible"}`}
          variant="ghost"
          size={"1"}
          onClick={onDelete}
        >
          <TrashIcon className="w-3 h-3" />
        </IconButton>
      </Flex>
    </Badge>
  );
}
