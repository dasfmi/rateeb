'use client';
// loadNotes: tries to load notes from cache, if not found, fetch from the server
export const loadNotes = async ({
    query,
    type,
    noCache,
    tags,
}: {
    query?: string;
    type?: string;
    tags?: string;
    noCache?: boolean;
}) => {
    const searchParams = new URLSearchParams();
    if (query) {
        searchParams.set("title", query);
    }
    if (type) {
        searchParams.set("type", type);
    }
    if (tags) {
        searchParams.set("tags", tags);
    }

    // try load to load notes from localStorage, if not found, fetch from the server
    if (searchParams.size === 0 && !noCache) {
        const notes = localStorage.getItem("notes");
        if (notes) {
            const payload = JSON.parse(notes);
            // if payload is saved for more than 60 minutes, then fetch from the server
            if (payload.createdAt + 60 * 60 * 1000 > new Date().getTime()) {
                return payload.data;
            }
        }
    }

    const resp = await fetch("/api/notes?" + searchParams.toString());
    const { data } = await resp.json();
    // save the notes to localStorage
    if (searchParams.size === 0 && data.length > 0) {
        localStorage.setItem(
            "notes",
            JSON.stringify({ createdAt: new Date().getTime(), data })
        );
    }
    return data;
};