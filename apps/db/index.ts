import express, { Express, Request, Response } from "express";
import { loadFiles, createEntry, deleteFile } from "./db";
import { randomUUID } from "crypto";
import cors from "cors";
import { readFileSync } from "fs";

const app: Express = express()
// app.use(bodyParser.json())
app.use(express.json());
app.use(cors());

const port = 4000

console.log('starting server...')
const databasePath = "./examples"
let mem = loadFiles(databasePath, {
    virtualCollections: ['tags']
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/views', (req: Request, res: Response) => {
    return res.json({ data: mem['views'] })
})

app.get('/reload', (req: Request, res: Response) => {
    mem = loadFiles(databasePath, {
        virtualCollections: ['tags']
    })
    return res.json({ ok: true })
})

app.get('/api/views/:id', (req: Request, res: Response) => {
    const id = req.params.id
    console.log({ id, views: mem['views'] })
    // load view from memory
    const view = mem['views'].find((view) => view.id === id)
    console.log({ view })

    // get blocks for view
    const blocks = mem['blocks'].filter((block) => view.target.tags.every((t) => block.tags && block.tags.includes(t)))

    return res.json({ data: { ...view, blocks } })
})

app.get('/api/blocks', (req: Request, res: Response) => {
    const filters = req.query
    // filter from memory
    const blocks = mem['blocks'].filter((block) => {
        // rule out all the blocks we don't want, if there is no filters then return all blocks
        for (const key in filters) {
            const v = filters[key] as string
            const [operation, value] = v.split(':')
            switch (operation) {
                case "in": {
                    if (!block[key] || !block[key].includes(value)) {
                        return false
                    }
                    break
                }
                case "eq": {
                    if (!block[key] || block[key] !== value) {
                        return false
                    }
                    break
                }
                case "contains": {
                    if (!block[key] || !block[key].toLowerCase().includes(value.toLowerCase())) {
                        return false
                    }
                    break
                }
                case "startsWith": {
                    if (!block[key] || !block[key].startsWith(value)) {
                        return false
                    }
                    break
                }
                case "gt": {
                    if (!block[key] ||  block[key] !> value) {
                        return false
                    }
                    break
                }
                case "gte": {
                    if (block[key] < value) {
                        return false
                    }
                    break
                }
            }
        }
        return true
    })
    // sort blocks my updatedAt
    blocks.sort((a, b) => b.updatedAt - a.updatedAt)
    return res.json({ data: blocks })
})

app.get('/api/tags', (req, res) => {
    return res.json({ data: mem['tags'] })
})

app.post('/api/blocks', (req, res) => {
    // create a new id
    const id = randomUUID()

    // make changes to memory
    mem['blocks'].push({ id, ...req.body })

    // persist changes to storage
    createEntry(databasePath, "blocks", id, req.body)

    return res.json({ id, ...req.body })
})


app.post('/api/views', (req, res) => {
    // create a new id
    const id = randomUUID()

    // make changes to memory
    mem['views'].push({ id, ...req.body })

    // persist changes to storage
    createEntry(databasePath, "views", id, req.body)

    return res.json({ data: { id, ...req.body } })
})

app.get('/api/blocks/homepage', (req: Request, res: Response) => {
    const id = req.params.id
    // read entry from disk
    const f = readFileSync(`${databasePath}/homepage.json`)
    const homepage = JSON.parse(f.toString())
    // const block = mem['blocks'].find((block) => block.id === id)
    homepage.id = id

    const childrenIds = homepage.blocks.map((b) => b.id)

    return res.json({ ok: true, data: homepage, children: mem['blocks'].filter((block) =>  childrenIds.includes(block.id)) })
})

app.get('/api/blocks/:id', (req: Request, res: Response) => {
    const id = req.params.id
    // read entry from disk
    const f = readFileSync(`${databasePath}/blocks/${id}.json`)
    const block = JSON.parse(f.toString())
    // const block = mem['blocks'].find((block) => block.id === id)
    block.id = id

    return res.json({ ok: true, data: block })
})

app.patch('/api/blocks/:id', (req, res) => {
    // create a new id
    const id = req.params.id

    console.log(req.body)
    // find entry index
    const index = mem['blocks'].findIndex((block) => block.id === id)

    const { action, target, value } = req.body

    // make changes to memory
    switch (action) {
        case "append": {
            // ensure target is an array to avoid exceptions
            if (!mem['blocks'][index][target]) {
                mem['blocks'][index][target] = []
            }
            mem['blocks'][index][target].push(value)
            break
        }
        case "splice": {
            const itemToDeleteIndex = mem['blocks'][index][target].findIndex((t: unknown) => t === value)
            mem['blocks'][index][target].splice(itemToDeleteIndex, 1)
            break
        }
        case "updateDocument": {
            mem['blocks'][index]["title"] = value["title"]
            mem['blocks'][index]["description"] = value["description"]
            mem['blocks'][index]["properties"] = value["properties"]
            mem['blocks'][index]["blocks"] = value["blocks"]
            mem['blocks'][index]["updatedAt"] = value["updatedAt"]
            break
        }
    }

    // persist changes to storage
    createEntry(databasePath, "blocks", id, mem['blocks'][index])

    return res.json({ id, ...req.body })
})


app.put('/api/blocks/:id', (req, res) => {
    // create a new id
    const id = req.params.id

    // find entry index
    const index = mem['blocks'].findIndex((block) => block.id === id)

    mem['blocks'][index] = { ...mem['blocks'][index], ...req.body }

    // persist changes to storage
    createEntry(databasePath, "blocks", id, mem['blocks'][index])

    return res.json({ id, ...req.body })
})

app.delete('/api/blocks/:id', (req, res) => {
    const id = req.params.id

    // find entry index
    const index = mem['blocks'].findIndex((block) => block.id === id)

    // make changes to memory
    mem['blocks'].splice(index, 1)

    // persist changes to storage
    deleteFile(databasePath, "blocks", id)

    return res.json({ id, ok: true })
})

app.listen(port, () => {
    console.log(`dftr db listening on port ${port}`)
})