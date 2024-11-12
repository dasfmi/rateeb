import { client } from "@/db";
import { Note } from "@/entity";
import { ObjectId } from "mongodb";

export const list = async (): Promise<Note[]> => {
    const notes = await client.db("rateeb").collection<Note>("notes").find({ isDeleted: { $exists: false, $ne: true } }).toArray();
    return notes
}

export const create = async (note: Note | string): Promise<Note | null> => {
    let payload: Note = {
        title: "",
        type: "note",
        tags: []
    }
    console.log({ note })
    if (typeof note === 'string') {
        payload = await processNote(note)
    } else {
        payload = note
    }
    payload.createdAt = new Date().getTime()

    const { insertedId } = await client.db("rateeb").collection<Note>("notes").insertOne(payload);
    const newNote = await client.db("rateeb").collection<Note>("notes").findOne({ _id: insertedId });

    return newNote
}


export const pinNote = async (id: string): Promise<any> => {
    return await client.db("rateeb").collection("notes").updateOne({ _id: new ObjectId(id) }, { $set: { isPinned: true } })
}

export const addTag = async (id: string, tag: string): Promise<any> => {
    return await client.db("rateeb").collection<Note[]>("notes").updateOne({ _id: new ObjectId(id) }, { $push: { tags: tag } })
}

export const deleteNote = async (id: string): Promise<any> => {
    return await client.db("rateeb").collection("notes").updateOne({ _id: new ObjectId(id) }, { $set: { isDeleted: true } })
}

export const processNote = async (text: string): Promise<any> => {
    const note: Note = {
        title: '',
        type: "note",
        tags: []
    }

    if (note.text?.startsWith('https://maps.app.goo.gl')) {
        // check if note is a location, i.e: google maps link
        note.url = note.text
        note.title = "location"
        note.description = "location"
        note.type = 'location'
    } else if (text?.startsWith('http')) {
        // check if the note is a url
        try {
            const url = new URL(text)
            // check the media type
            const meta = await fetch(`https://api.microlink.io?url=${text}&screenshot`).then(r => r.json())
            note.url = text
            note.title = meta.data.title
            note.description = meta.data.description
            note.hostname = url.hostname
            note.image = meta.data.image && meta.data.image.url ? meta.data.image.url : meta.data.screenshot.url

            if (note.hostname === 'youtube.com' || note.hostname.startsWith('www.youtube.com')) {
                note.type = "video"
            } else if (meta.headers['content-type'].startsWith('image')) {
                note.type = "image"
            } else {
                note.type = "url"
            }
        } catch (e) {
            // if we fail to fetch the url, we just save it as a text
            note.type = 'url'
            note.url = text
        }
    } else {
        note.text = text ?? ''
    }

    note.createdAt = new Date().getTime()
    return note
}