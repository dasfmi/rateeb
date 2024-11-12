import { LoaderIcon } from "lucide-react";

export default function Spinner() {
  return (
    <span className="animate-spin">
      <LoaderIcon size={16} />
    </span>
  );
}
