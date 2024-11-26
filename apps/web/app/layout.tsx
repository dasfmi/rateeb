"use client";
import "./globals.css";
import { useEffect, useState } from "react";

import Sidebar from "./Sidebar";
import usePrefStore from "@/store/pref.store";
import useNotificationsStore from "@/store/notifications.store";
import { Button, Card, Flex, Heading, Theme } from "@radix-ui/themes";
import useAppStore from "@/store/loadingIndicator.store";
import { loadNotes } from "@/services/notes.client";
import useNotesStore from "@/store/notes.store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [, setIsMobile] = useState(false);
  const { setIsSidebarOpen } = usePrefStore();
  const { notifications, dismissNotification, queueNotification } =
    useNotificationsStore();
  const { setIsLoading, setIsOnline } = useAppStore();
  const { setNotes } = useNotesStore();

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const dataLoader = setInterval(() => {
      // set online status
      console.log({ online: navigator.onLine });
      setIsOnline(navigator.onLine);
      // if no connection, abort
      if (!navigator.onLine) {
        return;
      }
      // TODO: if sync is in progress, do nothing
      setIsLoading(true);
      console.log("should sync");
      loadNotes({})
        .then((data) => setNotes(data))
        .catch((err) => {
          console.log("some error occured");
          queueNotification({
            color: "danger",
            title: "Failed to load notes",
            description: err.message ? err.message : err,
          });
        })
        .finally(() => setIsLoading(false));
    }, 10_000);
    return () => {
      clearInterval(dataLoader);
    };
  }, [queueNotification, setIsLoading, setIsOnline, setNotes]);

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
      <body className="h-screen m-0 bg-[var(--gray-3)] overflow-y-hidden">
        <Theme
          accentColor="brown"
          panelBackground="translucent"
          scaling="95%"
          appearance="dark"
        >
          <Flex
            direction="row"
            className="antialiased h-screen overflow-y-hidden"
            overflowY={"auto"}
            height={"screen"}
            width={"screen"}
            maxWidth={"screen"}
            maxHeight={"screen"}
          >
            <Sidebar />
            <Card m="3" className="w-full overflow-y-auto">
              {children}
            </Card>
            {notifications.length > 0 && (
              <Card className="flex flex-col absolute z-40 top-4 right-0 left-0 mx-auto w-96 gap-4">
                {notifications.map((n, index) => (
                  <div
                    key={index}
                    className={`rounded shadow max-h-24 px-4 py-2 bg-white ${n.color === "danger" ? "bg-red-300" : "bg-sky-500"}`}
                  >
                    <div className="flex items-center">
                      {/* <h4 className="text-sm text-red-700 font-bold leading-9"> */}
                        <Heading size="3">
                        {n.title}
                        </Heading>
                      {/* </h4> */}
                      <span className="flex-1" />
                      <Button
                        className="text-xs"
                        onClick={() => dismissNotification(index)}
                        variant="ghost"
                      >
                        dismiss
                      </Button>
                    </div>
                    <p className="text-xs">{n.description}</p>
                  </div>
                ))}
              </Card>
            )}
          </Flex>
          {/* <ThemePanel /> */}
        </Theme>
      </body>
    </html>
  );
}
