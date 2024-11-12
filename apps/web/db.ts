import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import { NextRequest } from 'next/server';

const db_user = encodeURIComponent(process.env.DB_USER || '');
const db_pass = encodeURIComponent(process.env.DB_PASS || '');
const uri = `mongodb+srv://${db_user}:${db_pass}@rateebcluster0.zdjlk.mongodb.net/?retryWrites=true&w=majority&appName=rateeb-web`

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });


const connect = async () => {
  await client.connect();
  return client;
}

export { client, connect };


export type RequestWithDB = NextRequest & {db: Db};
export type Handler = (req: RequestWithDB, params?: any) => Response | Promise<Response>;

export const withDB = (handler: Handler) => async (req: RequestWithDB, params?: any) => {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("rateeb").command({ ping: 1 });

    req.db = client.db("rateeb");

    return handler(req, params);
}