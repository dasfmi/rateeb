"use client";

import useAppStore from "@/store/app.store";
import { useEffect, useState } from "react";

export default function TagsIndex() {
  const { queueNotification, tags, setTags } = useAppStore();

  useEffect(() => {
    fetch("http://localhost:4000/api/tags")
      .then((res) => res.json())
      .then((data) => {
        console.log({ tags: data.data });
        setTags(data.data);
      })
      .catch((err) => {
        if (err instanceof Error) {
          queueNotification({
            color: "danger",
            title: "failed to load tags",
            description: err.message,
          });
        }
      });
  }, [queueNotification]);
  return (
    <div className="">
      <div className="flex items-center gap-3 border-b py-1.5 px-6">
        <span>Tags</span>
      </div>
      <section className="columns xl:columns-5 gap-4 py-4 px-6">
        {tags.map((tag, index) => (
          <div className="" key={index}>
            {tag}
          </div>
        ))}
      </section>
    </div>
  );
}
