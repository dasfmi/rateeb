"use client";
import { formatTime } from "@/services/date.service";
import usePrefStore from "@/store/pref.store";
import {
  TagIcon,
  SettingsIcon,
  SquareChartGanttIcon,
  GroupIcon,
  Clock10Icon,
  ClockIcon,
  TrashIcon,
  TvMinimalPlayIcon,
  Headphones,
  BookOpenIcon,
  WorkflowIcon,
  WifiOffIcon,
} from "lucide-react";
import Link from "next/link";
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
    ],
  },

  // {
  //   label: "Tags",
  //   icon: TagIcon,
  //   href: "/tags",
  // },
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
      className={`${isSidebarOpen ? "block" : "hidden"} bg-neutral-100 min-w-[22ch] w-[60%] md:w-[25%] lg:w-[14%] border-r h-screen`}
    >
      <section className="flex items-center pl-6 pr-3 mt-3">
        <span className="bg-black text-white p-1 rounded text-xs">dftr</span>
        <span className="flex-1" />
        {online === false && (
          <div className="bg-gray-200 text-xs rounded-xl px-2 py-1 mx-auto max-w-20 items-center inline-flex gap-2">
            <WifiOffIcon size={12} />
            Offline
          </div>
        )}
      </section>
      <nav className="flex flex-col h-full px-2 mt-6">
        {nav.map((item, index) => {
          if (item.type === "section") {
            return (
              <section key={index} className="mt-4">
                <span className="px-4 text-muted text-sm">{item.label}</span>
                <div className="flex flex-col">
                  {item.children.map((subitem, subItemIndex) => (
                    <Link
                      key={`${index}-${subItemIndex}`}
                      className={`flex items-center gap-2 py-2 px-4 rounded-2xl text-gray-700  ${
                        pathname === subitem.href
                          ? "bg-black !text-white"
                          : "hover:bg-gray-300"
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
              className={`flex items-center gap-2 py-2 px-4 rounded-2xl text-gray-700  ${
                pathname === item.href
                  ? "bg-black !text-white"
                  : "hover:bg-gray-300"
              }`}
              href={item.href}
            >
              <item.icon size={16} />
              <span className="">{item.label}</span>
            </Link>
          );
        })}
        <span className="flex-1" />

        <p className="text-gray-600 flex items-center gap-3 px-4">
          <ClockIcon size={16} className="" />
          {time}
        </p>
        <hr className="mt-4" />

        {bottomNav.map((item, index) => (
          <Link
            key={index}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg text-gray-700 ${
              pathname === item.href
                ? "bg-black !text-white"
                : "hover:bg-gray-300"
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
