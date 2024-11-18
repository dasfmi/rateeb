import { client, withDB } from "@/db";
import { Note } from "@/entity";
import { create } from "@/services/note.service";
import { Filter } from "mongodb";

type NoteFilter = {
  type?: string;
  title?: Record<string, string>;
  isDeleted: boolean;
  linkedin: string;
  // $or?: Record<string, string> & {target: string, linkedin: string};
}

export async function GET(req: Request) {
  await client.connect();
  await client.db("rateeb").command({ ping: 1 });

  // build filters
  const filters: Filter<NoteFilter> = {}
  const url = new URL(req.url)


  const isDeleted = url.searchParams.get('isDeleted')
  if (isDeleted) {
    filters.isDeleted = true
  } else {
    filters.isDeleted = { $exists: false, $ne: true }
  }

  const type = url.searchParams.get('type')
  if (type) {
    filters.type = type
  }

  const title = url.searchParams.get('title')
  if (title) {
    filters.$or = [{ title: { $regex: title, $options: 'i' } }, { tags: { $in: [title] } }]
  }

  const linkedin = url.searchParams.get('linkedin')
  if (linkedin) {
    filters.$or = [{ linkedin: linkedin }, { target: linkedin }]
  }

  const tags = url.searchParams.get('tags')
  if (tags) {
    filters.tags = { $in: tags.split(',') }
  }
  // @ts-expect-error not sure how to fix filters
  const notes = await client.db("rateeb").collection<Note>("notes").find(filters).sort({ updatedAt: -1 }).toArray();

  // const findRelated = url.searchParams.get('related')
  // let related: Note[] = []
  // if (findRelated) {
  //   const targetFilter = {target: ''}
  //   if (linkedin) {
  //     targetFilter.target = linkedin
  //   }
  //   related = await client.db("rateeb").collection<Note>("notes").find(targetFilter).sort({target: -1, isPinned: -1, createdAt: -1}).toArray();
  // }

  return Response.json({ data: notes });
}

export const POST = withDB(async (req) => {
  const note = await req.json()
  const newNote = await create(note)

  return Response.json({ ok: true, data: newNote })
})
