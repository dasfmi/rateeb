import type { Config } from "tailwindcss";
import { radixThemePreset } from 'radix-themes-tw';


const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [radixThemePreset],
  theme: {},
  plugins: [],
};
export default config;
