"use client";
import { Note } from "@/entity";
import useNotesStore from "@/store/notes.store";
import NewContactDialog from "@/ui/NewContactDialog";
import NotesContainer from "@/ui/NotesColumns";
import { Flex, IconButton, Separator } from "@radix-ui/themes";
import { useEffect, useState } from "react";

// const loadNotes = async () => {
//   const resp = await fetch("/api/notes?type=contact");
//   const data = await resp.json();
//   return data.data;
// };

export default function Today() {
  const { notes } = useNotesStore();
  // const { setIsLoading } = useLoadingIndicator();
  const [contacts, setContacts] = useState<Note[]>(
    notes.filter((note: Note) => note.type === "contact"),
  );

  useEffect(() => {
    console.log("notes changed", notes.length);
    setContacts(notes.filter((note: Note) => note.type === "contact"));
  }, [notes]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   loadNotes().then((notes) => {
  //     setNotes(notes);
  //     setIsLoading(false);
  //   });
  // }, [setNotes]);

  return (
    <>
      <Flex direction={"row"} px="4" className="text-xs items-center" gap="2">
        <h1>Contacts</h1>
        <span className="flex-1" />
        <NewContactDialog>
          <IconButton
            variant={"ghost"}
            size={"1"}
            className="hover:bg-neutral-100 flex flex-col items-start p-4 rounded-none"
          >
            New contact
          </IconButton>
        </NewContactDialog>
      </Flex>
      <Separator size="4" my={"3"} />
      <NotesContainer notes={contacts} onAction={() => {}} />
      {/* <div className="flex w-full flex-1 h-full">
        <section className="w-full">
          {isLoading && (
            <div className="mt-12 mx-auto text-center">
              <LoaderIcon size={24} />
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-3 p-4 w-full">
            {contacts.map((n: Note) => (
              <NoteCard
                key={n._id}
                note={n}
                onAction={(action: string) => console.log(action)}
              />
            ))}
          </div>
        </section>
      </div> */}
    </>
  );
}
