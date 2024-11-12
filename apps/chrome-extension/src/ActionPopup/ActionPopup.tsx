import { ChangeEvent, useEffect, useState } from "react";

export default function ActionPopup() {
  const [note, setNote] = useState("");
  const [url, setUrl] = useState("");
  const [tab, setTab] = useState<any>(null);
  const [tags, setTags] = useState<string[]>([]);

  const onAddNote = async () => {
    const hostname = new URL(url).hostname;

    const payload = {
      title: tab.title,
      note,
      type: "bookmark",
      url: url,
      hostname,
      tags,
    };

    try {
      const resp = await fetch("http://localhost:3000/api/notes", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (resp.ok) {
        chrome.notifications.create("success", {
          type: "progress",
          title: "Success",
          message: "note added successfully",
          iconUrl: "icon.png",
        });
      }

      chrome.notifications.create("error", {
        type: "basic",
        title: "Error",
        message: resp.statusText,
        iconUrl: "icon.png",
      });
    } catch (err) {
      alert(err);
      if (err instanceof Error) {
        chrome.notifications.create("error", {
          type: "basic",
          title: "Error",
          message: err.message,
          iconUrl: "icon.png",
        });
      }
    }
  };
  const onAddBookmark = async () => {
    console.log(note);
    console.log(url);
  };

  async function getCurrentTab() {
    const queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.

    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  const onNoteChanged = (v: ChangeEvent<HTMLTextAreaElement>) => {
    setNote(v.target.value);
  };

  const onToggleNotesPanel = async () => {
    await chrome.sidePanel.open({
      windowId: tab.windowId,
    });
  };

  const onTagsChanged = (v: ChangeEvent<HTMLInputElement>) => {
    tags.push(v.target.value)
    setTags(tags);
  }

  

  useEffect(() => {
    getCurrentTab().then((tab) => {
      setTab(tab);
      setUrl(tab.url ?? "");
      if (!tab) {
        return;
      }
    });
  });

  const initiateNewNote = () => {
    // listen to mouse click and capture the location
    document.addEventListener("click", (e) => {
      const { clientX, clientY } = e;
      console.log({ clientX, clientY });
    })
    // ready to capture mouse location
    chrome.action.setBadgeText({ text: "Choose note location" });
    document.body.style.cursor = "pointer"
  }

  return (
    <main className="p-4 flex flex-col min-w-[40ch]">
      <div className="flex items-center">
        <h1 className="text-xl leading-loose">Rateeb</h1>
        <span className="flex-1" />
        <button className="btn-primary text-xs" onClick={initiateNewNote}>
          Add note
        </button>
        <button className="btn-primary text-xs" onClick={onToggleNotesPanel}>
          Open Notes
        </button>
      </div>
      <p className="text-muted text-sm">Add a new note to this page</p>

      <div className="border rounded-lg mt-6 p-4">
        <h2 className="text-lg">{tab ? tab.title : ""}</h2>
        <p className="text-xs text-muted">{url}</p>
      </div>

      <textarea
        className="resize-none p-4 border mt-6 rounded"
        rows={4}
        defaultValue={note}
        onChange={onNoteChanged}
        placeholder="write your note here..."
      />

      <label className="mt-4 text-muted">tags:</label>
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          className="border rounded p-2 mt-4"
          placeholder="tags"
          onChange={onTagsChanged}
        />
      </div>

      <section id="actions" className="flex gap-4 mt-8">
        <button className="btn-primary" onClick={onAddNote}>
          Add Note
        </button>
        <span className="flex-1" />
        <button className="btn-muted" onClick={onAddBookmark}>
          Trash
        </button>
      </section>
    </main>
  );
}
