"use Client";

import { Badge, IconButton } from "@radix-ui/themes";
import { Cross1Icon } from "@radix-ui/react-icons";
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
      className="px-2 py-1 bg-muted text-[0.6rem] rounded-lg text-muted inline-flex items-center gap-1 relative whitespace-nowrap"
      onMouseOver={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {tag}
      <span className="flex-1" />
      <IconButton
        className={`absolute right-1 ${showControls ? "inline-block" : "hidden"}`}
        variant="soft"
        size={"1"}
      >
        <Cross1Icon width={"6"} />
      </IconButton>
    </Badge>
  );
}
