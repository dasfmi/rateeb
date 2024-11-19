import { withDB } from "@/db"


export const GET = withDB(async (req) => {
    const resp = await req.db.collection("projects").find().sort({ createdAt: -1 }).toArray()
    return Response.json({ ok: true, data: resp })
})

export const POST = withDB(async (req) => {
    const body = await req.json()
    body.createdAt = new Date().getTime()
    const resp = await req.db.collection("projects").insertOne(body)
    return Response.json({ ok: true, data: resp })
})