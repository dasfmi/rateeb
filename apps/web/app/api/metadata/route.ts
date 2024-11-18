// import { JSDOM } from "jsdom";
import { NextRequest } from 'next/server';
import METASCRAPER from 'metascraper';
import desc from 'metascraper-description'
import image from 'metascraper-image';
import title from 'metascraper-title';
import lang from 'metascraper-lang';
import favicon from 'metascraper-logo-favicon';
import feed from 'metascraper-feed';
import instagram from 'metascraper-instagram';
import x from 'metascraper-x';
import amazon from 'metascraper-amazon';
import spotify from 'metascraper-spotify';
import video from 'metascraper-video';

/**
 * `metascraper` is a collection of tiny packages,
 * so you can just use what you actually need.
 */
const metascraper = METASCRAPER([
    desc(),
    image(),
    title(),
    feed(),
    lang(),
    favicon(),
    // require('metascraper-youtube')(), // raises an error
    instagram(),
    x(),
    amazon(),
    spotify(),
    video(),
])

const getContent = async (url: URL) => {
    const resp = await fetch(url)

    const html = await resp.text()
    // const dom = new JSDOM(html)
    const meta = await metascraper({ url: url.toString(), html })
    console.log({ meta })

    return { ...meta, contentType: resp.headers.get('content-type') }
}


export const GET = async (req: NextRequest) => {
    console.log('received metadata request', req.nextUrl.searchParams.get('url'))

    try {
        const urlString = req.nextUrl.searchParams.get('url')
        if (!urlString) {
            return Response.json({ error: 'url is required' }, { status: 400 });
        }
        const url = new URL(urlString ?? "");
        const meta = await getContent(url)
        if (!meta) {
            return Response.json({ error: 'failed to fetch url' }, { status: 500 });
        }

        return Response.json({ url, meta }, { status: 200 });
    } catch (e) {
        console.log('error happened', e)
        return Response.json({ error: e }, { status: 500 });
    }

}
