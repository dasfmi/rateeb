import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import MillionLint from "@million/lint";


/** @type {import('next').NextConfig} */
const nextConfig = {};

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default MillionLint.next({ rsc: true })(nextConfig);
