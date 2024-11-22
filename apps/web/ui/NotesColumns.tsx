import { Note } from "@/entity";
import NoteCard from "./NoteCard";

type Props = {
  notes: Note[];
  onAction: (action: string, index: number, value?: string) => void;
};

export default function NotesContainer({ notes, onAction }: Props) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-5 gap-2 space-y-2">
      {notes &&
        notes.map((n: Note, index: number) => (
          <NoteCard
            key={n._id}
            note={n}
            onAction={(action: string, value?: string) =>
                onAction(action, index, value)
            }
          />
        ))}
    </div>
  );
}
