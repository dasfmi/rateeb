"use Client";

import { XIcon } from "lucide-react";
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
    <div
      className="px-2 py-1 bg-muted border text-[0.6rem] rounded-lg text-muted inline-flex items-center gap-1 w-min relative"
      onMouseOver={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {tag}
      <span className="flex-1" />
      <button className={`absolute right-1 ${showControls ? "inline-block" : "hidden"}`}>
        <XIcon size={8} />
      </button>
    </div>
  );
}
