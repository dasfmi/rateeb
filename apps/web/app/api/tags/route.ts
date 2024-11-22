import { withDB } from "@/db";

export const GET = withDB(async (req) => {
    const resp = await req.db.collection("notes").find().project({ tags: 1 }).toArray();
    const tags = resp.flatMap((note) => note.tags);
    return Response.json({ ok: true, data: tags });
})