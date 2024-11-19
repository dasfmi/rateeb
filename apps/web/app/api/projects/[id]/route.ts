import { ObjectId } from 'mongodb'
import { withDB } from "@/db"

export const GET = withDB(async (req, { params }) => {
    console.log(params)
    const id = ObjectId.createFromHexString(params.id)
    const project = await req.db.collection("projects").findOne({ _id: id })
    if (!project) {
        return Response.json({
            ok: false,
        }, {
            status: 404
        })
    }
    // get notes
    const noteIds = project.notes.map((id: string) => ObjectId.createFromHexString(id))
    const notes = await req.db.collection("notes").find({ _id: { $in: noteIds } }).sort({updatedAt: -1}).toArray()
    return Response.json({ ok: true, data: { project, notes } })
})

export const PUT = withDB(async (req, params) => {
    const id = ObjectId.createFromHexString(params.id)
    const body = await req.json()
    body.createdAt = new Date().getTime()
    const resp = await req.db.collection("projects").findOneAndUpdate({ _id: id }, { $set: body })
    return Response.json({ ok: true, data: resp })
})
