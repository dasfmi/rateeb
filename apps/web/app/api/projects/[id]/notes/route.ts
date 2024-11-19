import { withDB } from "@/db"
import { ObjectId } from "mongodb"

export const POST = withDB(async (req, { params }) => {
    console.log(params)
    const id = ObjectId.createFromHexString(params.id)
    const body = await req.json()
    body.createdAt = new Date().getTime()
    const resp = await req.db.collection("projects").findOneAndUpdate({ _id: id }, { $push: { notes: body.noteId } })
    return Response.json({ ok: true, data: resp })
})
