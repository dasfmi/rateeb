import { MongoClient, ServerApiVersion } from 'mongodb';

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
  console.log('database connected successfully')
  return client.db("rateeb");
}


const migrateYoutubeToMedia = async () => {
    const db = await connect();

    console.log('migrating youtube to media+video');
    return await db.collection('notes').updateMany({platform: 'youtube'}, {$set: {type: 'media+video'}})
}

const migrateImageToMedia = async () => {
  const db = await connect();

  return await db.collection('notes').updateMany({type: 'image'}, {$set: {type: 'media+image'}})
}

const migratePersonToContact = async () => {
  const db = await connect();

  console.log('migrating person to contact');
  return await db.collection('notes').updateMany({type: 'person'}, {$set: {type: 'contact'}})
}

migrateYoutubeToMedia().then((resp) => console.log({resp})).catch(console.error);