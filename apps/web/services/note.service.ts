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

    if (typeof note === 'string') {
        payload = await processNote(note)
    } else if (note.type === "url" && note.url) {
        try {
            const url = new URL(note.url)
            // check the media type
            const { meta } = await fetch(`http://localhost:3000/api/metadata?url=${encodeURIComponent(url.toString())}`).then(r => r.json())
            payload.url = note.url
            payload.title = meta.title
            payload.description = meta.description
            payload.hostname = url.hostname
            payload.image = meta.image ? meta.image : ''

            console.log({contentType: meta.contentType})

            if (isYoutubeVideo(url)) {
                payload.type = "media+video"
                payload.platform = "youtube"
            } else if (meta.contentType.startsWith('image')) {
                payload.type = "media+image"
            } else if (note.url.startsWith('https://maps.app.goo.gl') || note.url.startsWith('https://www.google.com/maps') || note.url.startsWith('https://maps.google.com')) {
                payload.type = 'location'
            } else {
                payload.type = "url"
            }
        } catch (e) {
            console.error(e)
            // if we fail to fetch the url, we just save it as a text
            payload.title = note.url
            payload.description = 'failed to fetch information ...'
            payload.type = 'url'
            payload.url = note.url
        }
    }  
    else {
        payload = note
    }
    payload.createdAt = new Date().getTime()
    payload.updatedAt = new Date().getTime()

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

    if (text?.startsWith('http')) {
        // check if the note is a url
        try {
            const url = new URL(text)
            // check the media type
            const { meta } = await fetch(`http://localhost:3000/api/metadata?url=${encodeURIComponent(url.toString())}`).then(r => r.json())
            note.url = text
            note.title = meta.title
            note.description = meta.description
            note.hostname = url.hostname
            note.image = meta.image ? meta.image : ''

            console.log({contentType: meta.contentType})

            if (isYoutubeVideo(url)) {
                note.type = "media+video"
                note.platform = "youtube"
            } else if (meta.contentType.startsWith('image')) {
                note.type = "media+image"
            } else if (text.startsWith('https://maps.app.goo.gl') || text.startsWith('https://www.google.com/maps') || text.startsWith('https://maps.google.com')) {
                note.type = 'location'
            } else {
                note.type = "url"
            }
        } catch (e) {
            console.error(e)
            // if we fail to fetch the url, we just save it as a text
            note.title = text
            note.description = 'failed to fetch information ...'
            note.type = 'url'
            note.url = text
        }
    } else {
        note.title = text
        note.description = text ?? ''
    }

    note.createdAt = new Date().getTime()
    return note
}

const isYoutubeVideo = (url: URL): boolean => {
    console.log({pathname: url.pathname})
    if (url.pathname === "/") {
        // we don't want to treat youtube homepage as video
        console.log('youtube homepage')
        return false
    }
    return url.hostname.startsWith('youtube.com') || url.hostname.startsWith('www.youtube.com') || url.host.startsWith('https://youtu.be')
}