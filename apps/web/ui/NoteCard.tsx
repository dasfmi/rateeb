"use client";
import { Note } from "@/entity";
import { MD5 } from "@/services/crypto.service";
import {
  Globe2Icon,
  MailIcon,
  EllipsisVertical,
  PinIcon,
  TrashIcon,
  Edit2Icon,
  TagIcon,
  PhoneIcon,
  LinkedinIcon,
} from "lucide-react";
import { FormEvent, ReactNode, useRef, useState } from "react";
import Tag from "./Tag";
import {
  Box,
  Card,
  Link,
  IconButton,
  Inset,
  Flex,
  Text,
  Heading,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import AttachToProjectDialog from "@/components/AttachToProjectDialog";

const NoteContainer = ({
  children,
  id,
  onAction,
  isPinned,
  tags,
  createdAt,
}: {
  children: ReactNode;
  id: string;
  onAction: (name: string, value?: unknown) => void;
  isPinned?: boolean;
  tags: string[];
  createdAt: number;
}) => {
  const [showControls, setShowControls] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const tagInput = useRef<HTMLInputElement>(null);
  const date = new Date(createdAt).toISOString().substring(0, 10);

  const onSubmitNewTag = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = e.currentTarget.newTag.value;

    onAction("addTag", text);
    e.currentTarget.newTag.value = "";
    setShowTagInput(false);
  };

  return (
    <Box
      p="0"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <Card m="0">
        {/* <div
      className="bg-white shadow rounded-xl border border-gray-200 break-inside-avoid relative"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    > */}
        {showControls && (
          <div className="absolute top-0 left-0 right-0 z-20  text-black flex rounded-t px-4 py-4">
            <span className="flex-1" />
            {isPinned && (
              <button onClick={() => onAction("unpin")}>
                <PinIcon
                  size={16}
                  className="fill-red-800 hover:fill-gray-600"
                />
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
        <section className="mt-4 px-4">
          <Text color="gray" size={"1"}>
            {date}
          </Text>
        </section>
        <section className="flex gap-2 flex-wrap items-center p-2 px-4 z-30 mt-1">
          <TagIcon size={12} className="text-muted" />
          {tags.map((tag, index) => (
            <Tag
              key={index}
              tag={tag}
              onDelete={function (): void {
                throw new Error("Function not implemented.");
              }}
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
            <IconButton
              onClick={() => {
                setShowTagInput(true);
                tagInput.current?.focus();
              }}
              type="button"
              variant="soft"
              size={"1"}
            >
              <PlusIcon width={"12"} className="" />
            </IconButton>
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
              <li className="list-none hover:bg-black hover:text-white last:rounded-b-xl">
                <AttachToProjectDialog noteId={id}>
                  <button
                    onClick={() => onAction("attachToProject")}
                    className="flex gap-2 items-center p-4"
                  >
                    <Edit2Icon size={16} /> Attach to project
                  </button>
                </AttachToProjectDialog>
              </li>
            </nav>
          </div>
        )}
        {/* </div> */}
      </Card>
    </Box>
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
    case "media+video":
      comp = <BookmarkCard note={note} />;
      break;
    case "media+image":
      comp = <ImageCard note={note} />;
      break;
    case "contact":
      comp = <ContactCard contact={note} />;
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
      createdAt={note.createdAt || new Date().getTime()}
    >
      {comp}
    </NoteContainer>
  );
};

export default NoteCard;

const BasicNote = ({ note }: { note: Note }) => (
  <Link href={`/edit/${note._id}`} className="p-4 block">
    <Heading size="4" weight={"bold"}>
      {note.title && note.title}
    </Heading>
    <Text color="gray" size="2">
      {note.description && note.description}
    </Text>
  </Link>
);

const BookmarkCard = ({ note }: { note: Note }) => (
  <>
    {note.image && (
      <Inset clip="padding-box" side="top" pb="current">
        <img
          src={note.image}
          className="w-full h-36 object-cover object-center"
          alt="screenshot"
        />
      </Inset>
    )}
    <section className="p-4">
      <Link href={note.url ?? ""} className="font-bold" target="_blank">
        {note.title && note.title}
      </Link>
      <p className="text-xs text-muted">{note.hostname && note.hostname}</p>
      {note.description && (
        <Text size="1" color="gray" className="text-wrap break-words" mt="3">
          {note.description}
        </Text>
      )}
    </section>
  </>
);

const ImageCard = ({ note }: { note: Note }) => (
  <Link href={note.url ?? ""} target="_blank" className="break-inside-avoid">
    <img
      src={note.image}
      alt={note.title}
      className="rounded-xl shadow border"
    />
  </Link>
);

const ContactCard = ({ contact }: { contact: Note }) => {
  const emailhash = contact.email && MD5(contact.email);
  const gravatarUrl = emailhash
    ? `https://www.gravatar.com/avatar/${emailhash}`
    : "";

  return (
    <Flex>
      {/* {gravatarUrl && (
        <div className="w-4/10 p-4">
          <img
            src={gravatarUrl}
            className="rounded-full shadow object-cover "
          />
        </div>
      )} */}

      <div className="flex flex-col px-2 py-4 w-6/10">
        <h4 className="font-medium">{contact.title}</h4>
        <p className="text-muted text-sm flex items-center gap-2 mt-2 hover:text-black break-words line-clamp-1">
          <MailIcon size={12} />
          <Text color="gray" size={"1"}>
            {contact.email}
          </Text>
        </p>
        {contact.linkedin && (
          <p className="text-xs text-muted inline-flex gap-2 break-words line-clamp-1">
            <LinkedinIcon size={12} />
            <Link href={contact.linkedin} target="_blank">
              {contact.linkedin}
            </Link>
          </p>
        )}
        {contact.phones &&
          contact.phones.map((phone, index) => (
            <p
              key={index}
              className="inline-flex gap-2 items-center text-xs text-muted"
            >
              <PhoneIcon size={12} />
              <Text>{phone}</Text>
            </p>
          ))}
        {contact.site && (
          <Link
            target="_blank"
            href={contact.site ?? ""}
            className="flex  text-sm gap-2 items-center text-muted hover:text-black break-words line-clamp-1"
          >
            <Globe2Icon size={12} />
            <Text color="gray" size="1">
              {contact.site}
            </Text>
          </Link>
        )}
      </div>
    </Flex>
  );
};
