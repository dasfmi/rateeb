import { client } from "@/db";
import { Block, BookmarkProperties } from "@/entity";
import { ObjectId } from "mongodb";

// export const list = async (): Promise<Block[]> => {
//     const notes = await client.db("rateeb").collection<Block>("notes").find({ isDeleted: { $exists: false, $ne: true } }).toArray();
//     return notes
// }

export const create = async (req: Block): Promise<Block | null> => {
    console.debug('received request', req)

    let payload: Block = {
        title: "",
        type: "url",
        tags: [],
        // @ts-expect-error implement types for properties
        properties: {}
    }
    if (req.type === "url") {
        const props = req.properties as BookmarkProperties
        payload = await processNote(props.url)
    } else {
        payload = req
    }

    // if (typeof req.value === 'string') {
    //     payload = await processNote(note)
    // } else if (.type === "url" && note.properties.url) {
    //     try {
    //         const url = new URL(note.properties.url)
    //         // check the media type
    //         const { meta } = await fetch(`http://localhost:3000/api/metadata?url=${encodeURIComponent(url.toString())}`).then(r => r.json())
    //         payload.properties.url = note.url
    //         payload.title = meta.title
    //         payload.description = meta.description
    //         payload.properties.hostname = url.hostname
    //         payload.properties.image = meta.image ? meta.image : ''

    //         console.log({contentType: meta.contentType})

    //         if (isYoutubeVideo(url)) {
    //             payload.type = "media+video"
    //             payload.platform = "youtube"
    //         } else if (meta.contentType.startsWith('image')) {
    //             payload.type = "media+image"
    //         } else if (note.properties.url.startsWith('https://maps.app.goo.gl') || note.url.startsWith('https://www.google.com/maps') || note.url.startsWith('https://maps.google.com')) {
    //             payload.type = 'location'
    //         } else {
    //             payload.type = "url"
    //         }
    //     } catch (e) {
    //         console.error(e)
    //         // if we fail to fetch the url, we just save it as a text
    //         payload.title = note.properties.url
    //         payload.description = 'failed to fetch information ...'
    //         payload.type = 'url'
    //         payload.properties.url = note.properties.url
    //     }
    // }  
    // else {
    //     payload = note
    // }
    payload.createdAt = new Date().getTime()
    payload.updatedAt = new Date().getTime()

    console.log({ newBlockPayload: payload })

    const newNote = await fetch('http://localhost:4000/api/blocks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    }).then((resp) => resp.json())

    return newNote
}


export const pinNote = async (id: string): Promise<any> => {
    return await client.db("rateeb").collection("notes").updateOne({ _id: new ObjectId(id) }, { $set: { isPinned: true } })
}

export const addTag = async (id: string, tag: string): Promise<any> => {
    return await client.db("rateeb").collection<Block[]>("notes").updateOne({ _id: new ObjectId(id) }, { $push: { tags: tag } })
}

export const deleteNote = async (id: string): Promise<any> => {
    return await client.db("rateeb").collection("notes").updateOne({ _id: new ObjectId(id) }, { $set: { isDeleted: true } })
}

export const processNote = async (text: string): Promise<any> => {
    const block: Block = {
        title: '',
        type: "url",
        properties: {
            url: ""
        },
        tags: []
    }

    if (text?.startsWith('http')) {
        // check if the note is a url
        try {
            const url = new URL(text)
            // check the media type
            const { meta } = await fetch(`http://localhost:3000/api/metadata?url=${encodeURIComponent(url.toString())}`).then(r => r.json())
            block.properties.url = text
            block.title = meta.title
            block.description = meta.description
            block.properties.hostname = url.hostname
            block.properties.thumbnail = meta.image ? meta.image : ''

            if (isYoutubeVideo(url)) {
                block.properties.contentType = "media+video"
                block.properties.platform = "youtube"
            } else if (meta.contentType.startsWith('image')) {
                block.properties.contentType = "media+image"
            } else if (text.startsWith('https://maps.app.goo.gl') || text.startsWith('https://www.google.com/maps') || text.startsWith('https://maps.google.com')) {
                block.properties.contentType = 'location'
                block.properties.platform = "googlemaps"
            } else {
                block.type = "url"
            }
        } catch (e) {
            console.error(e)
            // if we fail to fetch the url, we just save it as a text
            block.title = text
            block.description = 'failed to fetch information ...'
            block.type = 'url'
            block.properties.url = text
        }
    } else {
        block.title = text
        block.description = text ?? ''
    }

    block.createdAt = new Date().getTime()
    return block
}

const isYoutubeVideo = (url: URL): boolean => {
    console.log({ pathname: url.pathname })
    if (url.pathname === "/") {
        // we don't want to treat youtube homepage as video
        console.log('youtube homepage')
        return false
    }
    return url.hostname.startsWith('youtube.com') || url.hostname.startsWith('www.youtube.com') || url.host.startsWith('https://youtu.be')
}