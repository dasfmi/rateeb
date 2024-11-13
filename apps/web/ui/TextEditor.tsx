"use client";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
// @ts-expect-error - no types available
import LinkTool from "@editorjs/link";
// @ts-expect-error - no types available
import CheckList from "@editorjs/checklist";
// @ts-expect-error - no types available
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";
// @ts-expect-error - no types available
import Warning from '@editorjs/warning';
import Table from '@editorjs/table'
// @ts-expect-error - no types available
import Marker from '@editorjs/marker';
import { useEffect, useRef } from "react";
import { NotePreview } from "./plugins/NotePreview";

export type Props = {
  data: OutputData;
  onChange: (data: OutputData) => void;
  holder: string;
};

export default function Editor({ data, onChange, holder }: Props) {
  //add a reference to editor
  const ref = useRef<EditorJS>();
  //initialize editorjs
  useEffect(() => {
    //initialize editor if we don't have a reference
    if (!ref.current) {
      const editor = new EditorJS({
        holder,
        autofocus: true,
        placeholder: 'New page',
        tools: {
          header: Header,
          list: {
            // @ts-expect-error - we need to fix this
            class: List,
            inlineToolbar: true,
          },
          link: {
            class: LinkTool,
            config: {
              endpoint: "http://localhost:3000/api/fetchUrl",
            },
          },
          warning: Warning,
          checklist: {
            class: CheckList,
            inlineToolbar: true,
          },
          embed: Embed,
          quote: Quote,
          table: Table,
          marker: {
            class: Marker,
            shortcut: 'CMD+SHIFT+M',
          },
          note: {
            // @ts-expect-error - we need to fix this
            class: NotePreview,
            inlineToolbar: true,
          }
        },
        data,
        async onChange(api, event) {
          const content = await api.saver.save();
          onChange(content);
        },
      });
      ref.current = editor;
    }

    //add a return function handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  return (
    <>
      <div
        id={holder}
        className="w-full min-h-[500px] h-screen border shadow bg-white p-4 rounded-xl overflow-y-auto"
      />
    </>
  );
}
