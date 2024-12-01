"use client";
import { Block } from "@/entity";
import { MD5 } from "@/services/crypto.service";
import {
  Globe2Icon,
  MailIcon,
  EllipsisVertical,
  PinIcon,
  TrashIcon,
  Edit2Icon,
  PhoneIcon,
  LinkedinIcon,
} from "lucide-react";
import { FormEvent, ReactNode, useRef, useState } from "react";
import Tag from "../../ui/Tag";
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
import useAppStore from "@/store/app.store";
import ChartBlock from "@/components/blocks/ChartBlock";

const BlockCardShell = ({
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
  const { deleteTag, deleteBlock, addTag } = useAppStore();
  const [showControls, setShowControls] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const tagInput = useRef<HTMLInputElement>(null);
  const date = new Date(createdAt).toISOString().substring(0, 10);

  const onSubmitNewTag = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = e.currentTarget.newTag.value;

    addTag(id, text);

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
          {tags.map((tag, index) => (
            <Tag key={index} tag={tag} onDelete={() => deleteTag(id, tag)} />
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
        <IconButton onClick={() => deleteBlock(id)} variant="ghost" size="1"><TrashIcon className="w-4 h-4" /></IconButton>
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
                  onClick={() => deleteBlock(id)}
                  className="flex gap-2 items-center p-4"
                >
                  <TrashIcon size={16} /> Delete
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
                <button
                  onClick={() => onAction("attachToProject")}
                  className="flex gap-2 items-center p-4"
                >
                  <Edit2Icon size={16} /> Attach to project
                </button>
              </li>
            </nav>
          </div>
        )}
        {/* </div> */}
      </Card>
    </Box>
  );
};

const BlockCard = ({
  block,
  onAction,
}: {
  block: Block;
  onAction: (action: string) => void;
}) => {
  let comp: ReactNode;

  switch (block.type) {
    case "url":
      comp = <BookmarkCard note={block} />;
      break;
    // case "media+image":
    //   comp = <ImageCard note={note} />;
    //   break;
    case "chart":
      comp = <ChartBlock block={block} />;
      break;
    case "contact":
      comp = <ContactCard contact={block} />;
      break;
    default:
      comp = <BasicNote note={block} />;
  }

  return (
    <BlockCardShell
      id={block.id || ""}
      onAction={onAction}
      isPinned={block.isPinned}
      tags={block.tags ?? []}
      createdAt={block.createdAt || new Date().getTime()}
    >
      {comp}
    </BlockCardShell>
  );
};

export default BlockCard;

const BasicNote = ({ note }: { note: Block }) => (
  <Link href={`/edit/${note.id}`} className="p-4 block">
    <Heading size="4" weight={"bold"}>
      {note.title && note.title}
    </Heading>
    <Text color="gray" size="2">
      {note.description && note.description}
    </Text>
  </Link>
);

const BookmarkCard = ({ note }: { note: Block }) => (
  <>
    {note.properties.thumbnail && (
      <Inset clip="padding-box" side="top" pb="current">
        <img
          src={note.properties.thumbnail}
          className="w-full h-36 object-cover object-center"
          alt="screenshot"
        />
      </Inset>
    )}
    <section className="p-4">
      <Link
        href={note.properties.url ?? ""}
        className="font-bold"
        target="_blank"
      >
        {note.title && note.title}
      </Link>
      <p className="text-xs text-muted">
        {note.properties.hostname && note.properties.hostname}
      </p>
      {note.description && (
        <Text size="1" color="gray" className="text-wrap break-words" mt="3">
          {note.description}
        </Text>
      )}
    </section>
  </>
);

const ImageCard = ({ note }: { note: Block }) => (
  <Link
    href={note.properties.url ?? ""}
    target="_blank"
    className="break-inside-avoid"
  >
    <img
      src={note.properties.thumbnail}
      alt={note.title}
      className="rounded-xl shadow border"
    />
  </Link>
);

const ContactCard = ({ contact }: { contact: Block }) => {
  const emailhash =
    contact.properties.emails && MD5(contact.properties.emails[0]);
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
            {contact.properties.emails}
          </Text>
        </p>
        {contact.properties.linkedin && (
          <p className="text-xs text-muted inline-flex gap-2 break-words line-clamp-1">
            <LinkedinIcon size={12} />
            <Link href={contact.properties.linkedin} target="_blank">
              {contact.properties.linkedin}
            </Link>
          </p>
        )}
        {contact.properties.phones &&
          contact.properties.phones.map((phone, index) => (
            <p
              key={index}
              className="inline-flex gap-2 items-center text-xs text-muted"
            >
              <PhoneIcon size={12} />
              <Text>{phone}</Text>
            </p>
          ))}
        {contact.properties.site && (
          <Link
            target="_blank"
            href={contact.properties.site ?? ""}
            className="flex  text-sm gap-2 items-center text-muted hover:text-black break-words line-clamp-1"
          >
            <Globe2Icon size={12} />
            <Text color="gray" size="1">
              {contact.properties.site}
            </Text>
          </Link>
        )}
      </div>
    </Flex>
  );
};
