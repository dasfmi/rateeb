"use client";
import "./globals.css";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import usePrefStore from "@/store/pref.store";
import useNotificationsStore from "@/store/notifications.store";
import { XIcon } from 'lucide-react'

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
  const { notifications, dismissNotification } = useNotificationsStore();

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
        {notifications.length > 0 && (
          <section className="flex flex-col absolute z-40 top-4 right-0 left-0 mx-auto w-96 gap-4">
            {notifications.map((n, index) => (
              <div
                key={index}
                className={`rounded shadow max-h-24 px-4 py-2 bg-white ${n.color === "danger" ? "bg-red-300" : "bg-sky-500"}`}
              >
                <div className="flex items-center">
                  <h4 className="text-sm text-red-700 font-bold leading-9">{n.title}</h4>
                  <span className="flex-1" />
                  <button className="text-xs" onClick={() => dismissNotification(index)}>dismiss</button>
                </div>
                <p className="text-xs">{n.description}</p>
              </div>
            ))}
          </section>
        )}
      </body>
    </html>
  );
}
