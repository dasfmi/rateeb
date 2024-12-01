import { readdirSync, readFileSync, unlinkSync, writeFileSync, existsSync } from 'fs'
import path from 'path'

export const loadBlock = (databasePath: string, id: string) => {
    const blocksPath = path.join(databasePath, 'blocks')
    const file = readFileSync(`${blocksPath}/${id}.json`)
    return JSON.parse(file.toString())
}

export const loadFiles = (databasePath: string, { virtualCollections }: { virtualCollections: string[] }) => {
    const mem: Record<string, any[]> = {
        "blocks": [],
        "views": [],
        "files": []
    }
    console.debug('loading database')
    mem["blocks"] = []
    mem["views"] = []
    mem["files"] = []
    // prepare virtual Collections
    for (const vc of virtualCollections) {
        mem[vc] = []
    }


    // read blocks
    const blocksPath = path.join(databasePath, 'blocks')
    const dir = readdirSync(blocksPath)
    for (const p of dir.values()) {
        const file = readFileSync(`${blocksPath}/${p}`)
        const data = JSON.parse(file.toString())
        // exclude content from memory as we don't want to enlarge memory
        // instead we read from disk when we need to (on-demand)
        delete data['content']
        // make sure to inject id into db to normalize data
        const id = p.split(".")[0]
        mem["blocks"].push({ id, ...data })

        // virtual collections
        for (const vc of virtualCollections) {
            if (data[vc]) {
                mem[vc].push(...data[vc])
            }
        }
    }

    // read views
    const viewsPath = path.join(databasePath, 'views')
    const viewsDir = readdirSync(viewsPath)
    for (const p of viewsDir.values()) {
        const file = readFileSync(`${viewsPath}/${p}`)
        const data = JSON.parse(file.toString())
        // make sure to inject id into db to normalize data
        const id = p.split(".")[0]
        mem["views"].push({ id, ...data })
    }

    // read files
    // const drivePath = path.join(databasePath, 'files')
    // const drive = readdirSync(drivePath)
    // for (const p of drive.values()) {
    //     const file = readFileSync(`${drivePath}/${p}`)
    //     console.log({ file: file. })
    // }

    return mem
}

export const createEntry = (databasePath: string, collection: string, id: string, entry: any) => {
    // persist changes to storage
    writeFileSync(`${databasePath}/${collection}/${id}.json`, JSON.stringify(entry))
}

export const deleteFile = (databasePath: string, collection: string, id: string) => {
    // persist changes to storage
    const file = path.join(databasePath, collection, `${id}.json`)
    // check file exists
    if (!existsSync(file)) {
        return false
    }
    // delete file
    unlinkSync(file)
    return true
}