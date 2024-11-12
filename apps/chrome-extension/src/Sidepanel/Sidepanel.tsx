"use client";
import { ReactNode, Suspense, useEffect, useState } from "react";
import { App } from "../apps/base.app";
import { LinkedinApp } from "../apps/Linkedin.app";

const apps = [
  {
    hostnames: ["linkedin.com"],
    app: LinkedinApp,
  },
];

export default function Sidepanel() {
  // const [notes, setNotes] = useState<Note[]>([]);
  const [url, setUrl] = useState("");
  const [app, setApp] = useState<App | null>(null);
  const [relatedUI, setRelatedUI] = useState<ReactNode>(null);

  const runApp = async (url: string) => {
    console.debug(`checking apps for ${new URL(url).hostname}`, {
      linkedin: apps[0].hostnames,
    });
    const app = apps.find((app) =>
      app.hostnames.includes(new URL(url).hostname.replace("www.", ""))
    );
    if (app) {
      const a = new app.app(url);
      console.debug(`found app ${a.name}`);
      setApp(a);
      await a.run();
      setRelatedUI(a.render());
    }
  };

  const attachNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const note = formData.get("note") as string;
    if (!note) {
      return;
    }
    app?.notes.push({ title: note });
    form.reset();
    setRelatedUI(app?.render());

    const resp = await fetch("https://rateeb.dasfmi.com/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: note, type: 'note', target: url }),
    });
    const data = await resp.json()
    // console.log({newNote: data.note})
    app?.notes.pop()
    app?.notes.push(data.note);

    // form.reset();
  };

  useEffect(() => {
    chrome.tabs.onActivated.addListener((activeInfo) => {
      chrome.tabs.get(activeInfo.tabId, (tab) => {
        console.debug("tab activated", tab.url);
        setUrl(tab.url ?? "");
        runApp(tab.url ?? "");
      });
    });

    chrome.tabs.onUpdated.addListener((_tabId, _changedInfo, tab) => {
      if (tab) {
        console.debug("url changed", tab.url);
        setUrl(tab.url ?? "");
        runApp(tab.url ?? "");
      }
    });
  }, []);

  useEffect(() => {
    const getCurrentTab = async () => {
      const queryOptions: chrome.tabs.QueryInfo = {
        active: true,
        lastFocusedWindow: true,
      };
      const [tab] = await chrome.tabs.query(queryOptions);
      return tab;
    };

    getCurrentTab().then((tab) => {
      if (tab) {
        setUrl(tab.url ?? "");
        runApp(tab.url ?? "");
        // loadNotes({ url: tab.url ?? "" });
      }
    });
  }, []);

  return (
    <main className="p-4 flex flex-col h-full gap-4">
      {url}
      <Suspense fallback={<div>Loading...</div>}>
      {relatedUI}
      </Suspense>
      <span className="flex-1" />

      <hr />
      <section>
        <form onSubmit={attachNote}>
          <input name="note" placeholder="leave a note ..." className="w-full px-4 py-2 text-lg border shadow" />
        </form>
      </section>
    </main>
  );
}
