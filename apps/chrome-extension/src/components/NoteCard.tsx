"use client";
import { Note } from "../entity";
import {
  Globe2Icon,
  MailIcon,
  EllipsisVertical,
  PinIcon,
  TrashIcon,
  Edit2Icon,
  PlusIcon,
  TagIcon,
} from "lucide-react";
import { FormEvent, ReactNode, useRef, useState } from "react";
import Tag from "./Tag";

const NoteContainer = ({
  children,
  id,
  onAction,
  isPinned,
  tags,
}: {
  children: ReactNode;
  id: string;
  onAction: (name: string, value?: unknown) => void;
  isPinned?: boolean;
  tags: string[];
}) => {
  const [showControls, setShowControls] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const tagInput = useRef<HTMLInputElement>(null);

  const onSubmitNewTag = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = e.currentTarget.newTag.value;

    onAction("addTag", text);
    e.currentTarget.newTag.value = "";
    setShowTagInput(false);
  };

  return (
    <div
      className="bg-white shadow rounded-xl border border-gray-200 break-inside-avoid relative"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {showControls && (
        <div className="absolute top-0 left-0 right-0 z-20  text-black flex rounded-t-xl px-4 py-4">
          <span className="flex-1" />
          {isPinned && (
            <button onClick={() => onAction("unpin")}>
              <PinIcon size={16} className="fill-red-800 hover:fill-gray-600" />
            </button>
          )}
          {!isPinned && (
            <button onClick={() => onAction("pin")}>
              <PinIcon size={16} className="fill-white hover:fill-gray-600" />
            </button>
          )}
        </div>
      )}
      {children}
      <section className="flex gap-2 flex-wrap items-center p-2 px-4 z-30 mt-4">
        <TagIcon size={12} className="text-muted" />
        {tags.map((tag, index) => (
          <Tag
            key={index}
            tag={tag}
            onDelete={() => {}}
          />
        ))}
        <form onSubmit={onSubmitNewTag} className="flex items-center gap-2">
          <input
            id={`newTag-${id}`}
            name="newTag"
            type="text"
            className={`px-2 py-1 bg-muted border text-xs rounded-lg w-24 focus:outline-none ${
              showTagInput ? "flex" : "hidden"
            }`}
            placeholder="new tag"
            ref={tagInput}
          />
          <button
            onClick={() => {
              setShowTagInput(true);
              tagInput.current?.focus();
            }}
            type="button"
          >
            <PlusIcon size={12} className="" />
          </button>
        </form>
      </section>
      {showControls && (
        <div className="absolute bottom-0 right-0 z-20 flex p-4 rounded-xl">
          <span className="flex-1" />
          <button onClick={() => setMenuOpen(true)}>
            <EllipsisVertical size={16} />
          </button>
          <nav
            role="menu"
            className={`bg-white rounded-xl shadow border min-w-[8rem] bottom-0 ${
              menuOpen ? "block" : "hidden"
            }`}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <li className="list-none hover:bg-black hover:text-white first:rounded-t-xl">
              <button
                onClick={() => onAction("delete")}
                className="flex gap-2 items-center p-4"
              >
                <TrashIcon size={16} /> Delete note
              </button>
            </li>
            <li className="list-none hover:bg-black hover:text-white last:rounded-b-xl">
              <button
                onClick={() => onAction("edit")}
                className="flex gap-2 items-center p-4"
              >
                <Edit2Icon size={16} /> Edit
              </button>
            </li>
          </nav>
        </div>
      )}
    </div>
  );
};

const NoteCard = ({
  note,
  onAction,
}: {
  note: Note;
  onAction: (action: string) => void;
}) => {
  let comp: ReactNode;

  switch (note.type) {
    case "url":
    case "video":
      comp = <BookmarkCard note={note} />;
      break;
    case "image":
      comp = <ImageCard note={note} />;
      break;
    case "person":
      comp = <PersonCard person={note} />;
      break;
    default:
      comp = <BasicNote note={note} />;
  }

  return (
    <NoteContainer
      id={note._id || ""}
      onAction={onAction}
      isPinned={note.isPinned}
      tags={note.tags ?? []}
    >
      {comp}
    </NoteContainer>
  );
};

export default NoteCard;

const BasicNote = ({ note }: { note: Note }) => (
  <section className="p-4">
    <p className="font-bold">{note.title && note.title}</p>
    <p className="text-sm text-muted mt-3">{note.text && note.text}</p>
  </section>
);

const BookmarkCard = ({ note }: { note: Note }) => (
  <>
    {note.image && (
      <img
        src={note.image}
        className="w-full h-36 object-cover object-top rounded-t-xl border-b"
        alt="screenshot"
      />
    )}
    <section className="p-4">
      <a href={note.url ?? ""} className="font-bold" target="_blank">
        {note.title && note.title}
      </a>
      <p className="text-xs text-muted">{note.hostname && note.hostname}</p>
      {note.description && (
        <p className="text-sm text-muted mt-3 text-wrap break-words">
          {" "}
          {note.description}
        </p>
      )}
    </section>
  </>
);

const ImageCard = ({ note }: { note: Note }) => (
  <a href={note.url ?? ""} target="_blank" className="break-inside-avoid">
    <img
      src={note.image}
      alt={note.title}
      className="rounded-xl shadow border"
    />
  </a>
);

const PersonCard = ({ person }: { person: Note }) => {
  return (
    <div className="flex">
      <div className="flex flex-col px-2 py-4 w-6/10">
        <h4 className="font-medium">{person.title}</h4>
        <p className="text-muted text-sm flex items-center gap-2 mt-2 hover:text-black">
          <MailIcon size={12} />
          {person.email}
        </p>
        {person.site && (
          <a
            target="_blank"
            href={person.site ?? ""}
            className="flex  text-sm gap-2 items-center text-muted hover:text-black"
          >
            <Globe2Icon size={12} />
            {person.site}
          </a>
        )}
      </div>
    </div>
  );
};
