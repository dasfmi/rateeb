"use client";
import "./globals.css";
import { useEffect, useState } from "react";

import Sidebar from "./Sidebar";
import {
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Theme,
} from "@radix-ui/themes";
import useAppStore from "@/store/app.store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [, setIsMobile] = useState(false);
  const { setIsSidebarOpen, notifications, dismissNotification } =
    useAppStore();

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
      <body className="h-screen m-0 overflow-y-hidden">
        <Theme
          accentColor="brown"
          panelBackground="translucent"
          scaling="95%"
          appearance="light"
          radius="small"
        >
          <Flex
            direction="row"
            className="antialiased h-screen overflow-y-hidden bg-gray-3"
            overflowY={"hidden"}
            height={"100vh"}
            width={"screen"}
            maxWidth={"screen"}
            maxHeight={"100vh"}
            gap="0"
          >
            <Sidebar />
            <Card my="3" className="w-full bg-whiteA-12 overflow-hidden relative">
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
                      <Heading size="3">{n.title}</Heading>
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
