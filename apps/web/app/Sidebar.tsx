"use client";
import { formatTime } from "@/services/date.service";
import usePrefStore from "@/store/pref.store";
import { Text, Separator, Link } from "@radix-ui/themes";
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
  ClockIcon,
} from "lucide-react";
// import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  {
    label: "Notes",
    icon: SquareChartGanttIcon,
    href: "/",
  },
  {
    label: "Projects",
    icon: WorkflowIcon,
    href: "/projects",
  },
  {
    label: "Clocks",
    icon: Clock10Icon,
    href: "/clocks",
  },
  {
    label: "Apps",
    icon: GroupIcon,
    type: "section",
    children: [
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
        label: "Github",
        icon: GithubIcon,
        href: "/apps/github",
      },
    ],
  },
  {
    label: "Explore",
    icon: TagsIcon,
    type: "section",
    children: [
      {
        label: "Tags",
        icon: TagsIcon,
        href: "/tags",
      },
    ],
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
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const timeUpdater = setInterval(() => {
      setTime(formatTime(new Date(), "12h", "local"));
    }, 5000);

    return () => {
      clearInterval(timeUpdater);
    };
  }, []);

  useEffect(() => {
    setOnline(navigator.onLine);
  }, [navigator.onLine]);

  return (
    <aside
      className={`${isSidebarOpen ? "block" : "hidden"} min-w-[22ch] h-screen`}
    >
      <section className="flex items-center pl-4 pt-4">
        <Link href="/" className="bg-black text-white p-1 rounded text-xs">
          <Text>dftr</Text>
        </Link>
        {online === false && (
          <div className="bg-gray-200 text-xs rounded-xl px-2 py-1 mx-auto max-w-20 items-center inline-flex gap-2">
            <WifiOffIcon size={12} />
            Offline
          </div>
        )}
        <span className="flex-1" />
        <SearchIcon size={16} className="text-gray-500" />
      </section>
      <nav className="flex flex-col h-full pl-2 mt-3 gap-0.5">
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
                      <span className="">{subitem.label}</span>
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
                pathname === item.href ? "bg-gray-200" : "hover:bg-gray-200"
              }`}
              href={item.href ?? ""}
            >
              <item.icon size={16} />
              <span className="">{item.label}</span>
            </Link>
          );
        })}
        
        {/* <span className="flex-1" /> */}

        <Text className="text-gray-600 flex items-center gap-3 px-2 mt-72">
          <ClockIcon size={16} className="" />
          {time}
        </Text>
        <Separator my="2" size="4" />

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
      </nav>
    </aside>
  );
}
