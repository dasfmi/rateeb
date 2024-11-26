"use client";
import { formatTime } from "@/services/date.service";
import useAppStore from "@/store/loadingIndicator.store";
import usePrefStore from "@/store/pref.store";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Text, Link, Flex, Spinner } from "@radix-ui/themes";
import { CodeIcon } from "@radix-ui/react-icons";
import {
  TagsIcon,
  SearchIcon,
  SettingsIcon,
  SquareChartGanttIcon,
  GroupIcon,
  Clock10Icon,
  TrashIcon,
  TvMinimalPlayIcon,
  Headphones,
  BookOpenIcon,
  WorkflowIcon,
  WifiOffIcon,
  GithubIcon,
  AlbumIcon,
  FilesIcon,
  MailIcon,
  AlarmClockIcon,
  Badge,
} from "lucide-react";
// import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  {
    label: "Today",
    icon: CodeIcon,
    href: "/",
  },
  {
    label: "Workspace",
    type: "section",
    icon: "",
  },
  {
    label: "Notes",
    icon: SquareChartGanttIcon,
    href: "/notes",
  },
  {
    label: "Projects",
    icon: WorkflowIcon,
    href: "/projects",
  },
  {
    label: "Activity",
    type: "section",
  },
  {
    label: "Music",
    icon: Headphones,
    href: "/music",
  },
  {
    label: "Watch",
    icon: TvMinimalPlayIcon,
    href: "/watch",
  },
  {
    label: "Read later",
    icon: BookOpenIcon,
    href: "/read",
  },
  {
    label: "Views",
    type: "section",
  },
  {
    label: "Clocks",
    icon: Clock10Icon,
    href: "/clocks",
  },
  {
    label: "Mail",
    icon: MailIcon,
    href: "/apps/mail",
  },
  {
    label: "Reminders",
    icon: AlarmClockIcon,
    href: "/apps/reminders",
  },
  {
    label: "Files",
    icon: FilesIcon,
    href: "/apps/files",
  },
  {
    label: "Photos",
    icon: AlbumIcon,
    href: "/apps/photos",
  },
  {
    label: "Contacts",
    icon: GroupIcon,
    href: "/contacts",
  },

  {
    label: "Github",
    icon: GithubIcon,
    href: "/apps/github",
  },
  // {
  //   label: "Apps",
  //   icon: GroupIcon,
  //   type: "section",
  //   children: [
  //     {
  //       label: "Mail",
  //       icon: MailIcon,
  //       href: "/apps/mail",
  //     },
  //     {
  //       label: "Reminders",
  //       icon: AlarmClockIcon,
  //       href: "/apps/reminders",
  //     },
  //     {
  //       label: "Files",
  //       icon: FilesIcon,
  //       href: "/apps/files",
  //     },
  //     {
  //       label: "Photos",
  //       icon: AlbumIcon,
  //       href: "/apps/photos",
  //     },
  //     {
  //       label: "Contacts",
  //       icon: GroupIcon,
  //       href: "/contacts",
  //     },
  //     {
  //       label: "Music",
  //       icon: Headphones,
  //       href: "/music",
  //     },
  //     {
  //       label: "Watch",
  //       icon: TvMinimalPlayIcon,
  //       href: "/watch",
  //     },
  //     {
  //       label: "Read later",
  //       icon: BookOpenIcon,
  //       href: "/read",
  //     },
  //     {
  //       label: "Github",
  //       icon: GithubIcon,
  //       href: "/apps/github",
  //     },
  //   ],
  // },
  {
    label: "Explore",
    icon: TagsIcon,
    type: "section",
  },
  {
    label: "Tags",
    icon: TagsIcon,
    href: "/tags",
  },
];

const bottomNav = [
  {
    label: "Trash",
    icon: TrashIcon,
    href: "/trash",
  },
  {
    label: "Settings",
    icon: SettingsIcon,
    href: "/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen } = usePrefStore();
  const [time, setTime] = useState(formatTime(new Date(), "12h", "local"));
  const { isLoading, isOnline } = useAppStore();

  useEffect(() => {
    const timeUpdater = setInterval(() => {
      setTime(formatTime(new Date(), "12h", "local"));
    }, 5000);

    return () => {
      clearInterval(timeUpdater);
    };
  }, []);

  return (
    <aside
      className={`${isSidebarOpen ? "block" : "hidden"} min-w-[22ch] h-screen`}
    >
      <Flex pt="4" gap="2" className="items-center pl-4">
        <Link href="/" className="bg-black text-white p-1 rounded text-xs">
          <Text>dftr</Text>
        </Link>
        {isLoading === true && (
          <Badge>
            <Flex gap="2" className="items-center text-xs">
              <Spinner />
              <Text>Syncing</Text>
            </Flex>
          </Badge>
          // <Box className="bg-emerald-50 px-2">
          //   <Flex gap="2" className="items-center text-xs">
          //     <Spinner />
          //     <Text>Syncing</Text>
          //   </Flex>
          // </Box>
        )}
        {isOnline === false && (
          <Badge
            color="gray"
            className="rounded-xl px-2 py-1 mx-auto max-w-20 items-center inline-flex gap-2"
          >
            <WifiOffIcon size={12} />
            Offline
          </Badge>
        )}
        <span className="flex-1" />
        <SearchIcon size={16} className="text-gray-500" />
      </Flex>
      <NavigationMenu.Root className="px-4 mt-4">
        <NavigationMenu.List className="list-none">
          {nav.map((item, index) => (
            <NavigationMenu.Item key={index}>
              {item.type === "section" ? (
                <Text size="1" className="uppercase text-gray-9 mt-6 block mb-1" key={index}>
                  {item.label}
                </Text>
              ) : (
                <NavigationMenu.Link
                  className=""
                  active={pathname === item.href}
                  asChild
                >
                  <Link href={item.href} className="text-gray-11 hover:bg-gray-4 hover:no-underline data-[active]:bg-red-4">
                    <Flex gap="2" className="items-center">
                      <item.icon size={16} />
                      {item.label}
                    </Flex>
                  </Link>
                </NavigationMenu.Link>
              )}
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>

        <div className="ViewportPosition">
          <NavigationMenu.Viewport className="NavigationMenuViewport" />
        </div>
      </NavigationMenu.Root>
      {/* <nav className="flex flex-col h-full pl-2 mt-3 gap-0.5">
        {nav.map((item, index) => {
          if (item.type === "section") {
            return (
              <section key={index} className="mt-4">
                <span className="pl-2 text-muted text-sm">{item.label}</span>
                <div className="flex flex-col">
                  {item.children.map((subitem, subItemIndex) => (
                    <Link
                      key={`${index}-${subItemIndex}`}
                      type="button"
                      underline="none"
                      color="gray"
                      className={`flex items-center gap-2 py-1 px-2 rounded ${
                        pathname === subitem.href
                          ? "bg-gray-200"
                          : "hover:bg-gray-200"
                      }`}
                      href={subitem.href}
                    >
                      <subitem.icon size={16} />
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              </section>
            );
          }

          return (
            <Link
              key={index}
              underline="none"
              className={`flex items-center gap-2 py-1 px-2 rounded  ${
                pathname === item.href ? "" : ""
              }`}
              href={item.href ?? ""}
              color="gray"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}

        <span className="flex-1" />

      

        {bottomNav.map((item, index) => (
          <Link
            key={index}
            underline="none"
            className={`flex items-center gap-2 py-1 px-2 rounded-lg ${
              pathname === item.href ? "bg-gray-200" : "hover:bg-gray-200"
            }`}
            href={item.href}
          >
            <item.icon size={16} />
            <span className="">{item.label}</span>
          </Link>
        ))}
      </nav> */}
    </aside>
  );
}
