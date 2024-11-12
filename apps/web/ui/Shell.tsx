'use client';

import { useState } from "react";
import { redirect } from "next/navigation";
import { LoaderIcon } from "lucide-react";

export default function Shell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const addNewNote = async (e: FormData) => {
    setIsLoading(true)
    const text = e.get('input')?.toString()

    let note: any = {
      type: 'note',
      text: text,
    }

    const resp = await fetch('/api/notes', {
      method: 'post',
      body: JSON.stringify(note)
    })

    const data = await resp.json()
    console.log(data)
    setIsLoading(false)
    // redirect('/')
  }


  return (
    <div className="container">
      <div className="flex flex-col py-4">
        <div className="flex">
          <h1>{title}</h1>
          <span className="flex-1" />
          <form action={addNewNote}>
            <input className="rounded-xl border focus:outline-none px-4 py-2" name="input" />
            <button type="submit" className="btn-primary" disabled={isLoading}>{ isLoading ?  <span className="animate-spin"><LoaderIcon size={12} /></span> : 'Create' }</button>
            </form>
        </div>
        {children}
      </div>
    </div>
  );
}
