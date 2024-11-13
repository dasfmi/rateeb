const { JSDOM } = require("jsdom");
import { NextRequest } from 'next/server';

/**
 * `metascraper` is a collection of tiny packages,
 * so you can just use what you actually need.
 */
const metascraper = require('metascraper')([
    require('metascraper-description')(),
    require('metascraper-image')(),
    require('metascraper-title')(),
    require('metascraper-feed')(),
    require('metascraper-lang')(),
    require('metascraper-logo-favicon')(),
    // require('metascraper-youtube')(), // raises an error
    require('metascraper-instagram')(),
    require('metascraper-x')(),
    require('metascraper-amazon')(),
    require('metascraper-spotify')(),
    require('metascraper-video')(),
])

const getContent = async (url: URL) => {
    const resp = await fetch(url)

    const html = await resp.text()
    const dom = new JSDOM(html)
    const meta = await metascraper({ url, html, dom })
    console.log({meta})

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
