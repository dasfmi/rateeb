import { withDB } from "@/db";
import { pinNote, deleteNote, addTag } from "@/services/note.service";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export const GET = withDB(async (req, { params }) => {
  const id = ObjectId.createFromHexString(params.id)
  const resp = await req.db.collection("notes").findOne({ _id: id })

  return Response.json({ ok: true, data: resp })
})

export const PUT = withDB(async (req, { params }) => {
  const body = await req.json()
  const id = ObjectId.createFromHexString(params.id)
  const resp = req.db.collection("notes").updateOne({ _id: id }, { $set: body })

  return Response.json({ ok: true, message: 'note updated', data: resp })
})

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const body = await req.json()
  if (body.action === 'pin') {
    const resp = await pinNote(params.id)
    return Response.json({ ok: true, message: 'note pinned', data: resp })
  } else if (body.action === 'addTag') {
    const resp = await addTag(params.id, body.tag)
    return Response.json({ ok: true, message: 'tag added to note', data: resp })
  } else if (body.action === 'deleteTag') {
    
  }

  return Response.json({ ok: false, error: 'invalid action' })
}

export const DELETE = withDB(async (req, { params }) => {
  const resp = await deleteNote(params.id)
  return Response.json({ ok: true, message: 'note deleted', data: resp })
})