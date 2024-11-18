import { NextRequest } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3";
import S3 from "@/lib/r2";
import { ObjectId } from "mongodb";


// const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}`

// const getPresignedUploadUrl = () => {
//     const data = new FormData()
//     data.set('requireSignedURLs', 'true')
//     fetch(`${baseUrl}/images/v2/direct_upload`, {
//         headers: {
//             Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
//         },
//         method: 'POST',
//         body: data,
//     })
// }

// export const runtime = "edge";

export async function POST(request: NextRequest) {
    const filename = 'dasfmi/' + new ObjectId().toHexString() + '.jpg'
    console.log({ filename })
    const file = await request.blob()

    try {
        const resp = await S3.send(new PutObjectCommand({
            Bucket: "dftr",
            Key: filename,
            Body: Buffer.from(await file.arrayBuffer()),
            ACL: 'public-read',
        }))

        console.log({ resp })
        console.log(`https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/dftr/${filename}`)
        return Response.json({
            success: 1,
            file: {
                url: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/dftr/${filename}`
            }
        })
    } catch (err) {
        console.error(err)
        let message = 'unknown error'
        if (err instanceof Error) {
            message = err.message
        }
        return Response.json({
            success: 0,
            error: message,
        }, {
            status: 400,
        })
    }
}

// const uploadImage = async (blob: Blob) => {
//     const s3Url = 'https://e4c0222bba0fb5f7d55bc838af9973cd.r2.cloudflarestorage.com'
//     const data = new FormData()
//     data.set('file', blob)
//     const url = `${s3Url}`
//     console.log({ url })
//     const resp = await fetch(url, {
//         method: 'PUT',
//         body: data,
//         headers: {
//             Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
//             'Content-Type': 'multipart/form-data',
//         }
//     }).then(resp => resp.json())

//     return resp
// }

// export const POST = async (req: NextRequest) => {
//     const blob = await req.blob()
//     const resp = await uploadImage(blob)

//     console.log({ resp })

//     if (resp.errors) {
//         resp.errors.forEach((err) => console.error(err))
//         return Response.json({
//             success: 0,
//             errors: resp.errors,
//         }, {
//             status: 400
//         })
//     }

//     return Response.json({
//         success: 1,
//         file: {
//             url: resp.result.url,
//         }
//     })
// }