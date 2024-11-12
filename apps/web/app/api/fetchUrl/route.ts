import { NextRequest } from "next/server"

export const GET = async (req: NextRequest) => {
    console.log(req.url)
    console.log({ url: req.nextUrl.searchParams.get('url') })
    const url = req.nextUrl.searchParams.get('url')
    const meta = await fetch(`https://api.microlink.io?url=${url}&screenshot`).then(r => r.json())

    console.log({ meta })

    return Response.json({
        success: 1,
        link: url,
        meta: {
            title: meta.data.title,
            description: meta.data.description,
            image: meta.data.image ? meta.data.image.url : meta.data.screenshot.url,
        }
    })
}