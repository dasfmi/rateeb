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
    label: "Clocks",
    icon: Clock10Icon,
    href: "/clocks",
  },
  {
    label: "People",
    icon: GroupIcon,
    href: "/people",
  },
  {
    label: "Tags",
    icon: TagIcon,
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

  useEffect(() => {
    const timeUpdater = setInterval(() => {
      setTime(formatTime(new Date(), "12h", "local"));
    }, 5000);

    return () => {
      clearInterval(timeUpdater);
    };
  }, []);

  return (
    <aside className={`${isSidebarOpen ? 'block' : 'hidden'} bg-neutral-100 w-[60%] md:w-[25%] lg:w-[14%] border-r h-screen`}>
      <nav className="flex flex-col h-full p-4">
        {nav.map((item, index) => (
          <Link
            key={index}
            className={`flex items-center gap-2 py-2 px-4 rounded-2xl text-gray-700  ${
              pathname === item.href ? "bg-black !text-white" : "hover:bg-gray-300"
            }`}
            href={item.href}
          >
            <item.icon size={16} />
            <span className="">{item.label}</span>
          </Link>
        ))}
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
              pathname === item.href ? "bg-black !text-white" : "hover:bg-gray-300"
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
