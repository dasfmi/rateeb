"use client";
import "./globals.css";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import usePrefStore from "@/store/pref.store";

// export const metadata: Metadata = {
//   title: "Rateeb",
//   description: "My second brain",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [, setIsMobile] = useState(false);
  const { setIsSidebarOpen } = usePrefStore();

  // create an event listener
  useEffect(() => {
    //choose the screen size
    const handleResize = () => {
      if (window.innerWidth < 720) {
        setIsMobile(true);
        setIsSidebarOpen(false);
      } else {
        setIsMobile(false);
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  }, [setIsSidebarOpen]);

  return (
    <html lang="en">
      <body className="antialiased flex h-screen max-h-screen overflow-y-auto w-screen max-w-screen">
        <Sidebar />
        <main className="flex-1 h-screen overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
