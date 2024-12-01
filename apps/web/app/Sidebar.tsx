"use client";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Text, Link, Flex, Spinner, Box } from "@radix-ui/themes";
import {
  CodeIcon,
  LayersIcon,
  MagnifyingGlassIcon,
  ReaderIcon,
  PersonIcon,
  VideoIcon,
  CalendarIcon,
  PlayIcon,
  ClockIcon,
  EnvelopeOpenIcon,
  BellIcon,
  FileIcon,
  ImageIcon,
  IdCardIcon,
} from "@radix-ui/react-icons";
import { WifiOffIcon, GithubIcon, Badge } from "lucide-react";
// import Link from "next/link";
import { usePathname } from "next/navigation";
import useAppStore from "@/store/app.store";

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
    label: "Feed",
    icon: ReaderIcon,
    href: "/feed",
  },
  {
    label: "Views",
    icon: LayersIcon,
    href: "/views",
  },
  {
    label: "Activity",
    type: "section",
  },
  {
    label: "Music",
    icon: PlayIcon,
    href: "/music",
  },
  {
    label: "Watch",
    icon: VideoIcon,
    href: "/watch",
  },
  {
    label: "Read later",
    icon: ReaderIcon,
    href: "/read",
  },
  {
    label: "Apps",
    type: "section",
  },
  {
    label: "Clocks",
    icon: ClockIcon,
    href: "/clocks",
  },
  {
    label: "Calendar",
    icon: CalendarIcon,
    href: "/apps/calendar",
  },
  {
    label: "Mail",
    icon: EnvelopeOpenIcon,
    href: "/apps/mail",
  },
  {
    label: "Reminders",
    icon: BellIcon,
    href: "/apps/reminders",
  },
  {
    label: "Files",
    icon: FileIcon,
    href: "/apps/files",
  },
  {
    label: "Photos",
    icon: ImageIcon,
    href: "/apps/photos",
  },
  {
    label: "Contacts",
    icon: PersonIcon,
    href: "/contacts",
  },

  {
    label: "Github",
    icon: GithubIcon,
    href: "/apps/github",
  },
  {
    label: "Explore",
    icon: IdCardIcon,
    type: "section",
  },
  {
    label: "Tags",
    icon: IdCardIcon,
    href: "/tags",
  },
];

// const bottomNav = [
//   {
//     label: "Trash",
//     icon: TrashIcon,
//     href: "/trash",
//   },
//   {
//     label: "Settings",
//     icon: SettingsIcon,
//     href: "/settings",
//   },
// ];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, isLoading, isOnline } = useAppStore();
  // const [time, setTime] = useState(formatTime(new Date(), "12h", "local"));

  // useEffect(() => {
  //   const timeUpdater = setInterval(() => {
  //     setTime(formatTime(new Date(), "12h", "local"));
  //   }, 5000);

  //   return () => {
  //     clearInterval(timeUpdater);
  //   };
  // }, []);

  return (
    <aside
      className={`${isSidebarOpen ? "block" : "hidden"} min-w-[22ch] w-auto h-screen`}
    >
      <Flex gap="2" className="items-center" p="4">
        <Link href="/" className="bg-black text-white p-1 rounded text-xs">
          <Text>dftr</Text>
        </Link>
        {isLoading === true && (
          <Badge color="gray">
            <Flex gap="2" className="items-center text-xs">
              <Spinner />
              <Text>Syncing</Text>
            </Flex>
          </Badge>
        )}
        {isOnline === false && (
          <Badge color="gray" className="rounded-xl mx-auto max-w-20">
            <Flex px="2" py="1" justify={"center"} gap="2">
              <WifiOffIcon size={12} />
              Offline
            </Flex>
          </Badge>
        )}
        <span className="flex-1" />
        <MagnifyingGlassIcon className="text-gray-10" />
      </Flex>
      <NavigationMenu.Root className="px-3">
        <NavigationMenu.List className="list-none">
          {nav.map((item, index) => (
            <NavigationMenu.Item key={index}>
              {item.type === "section" ? (
                <Box mt="4" mb="1"><Text size="1" className="uppercase text-gray-10 block mb-1">
                  {item.label}
                </Text></Box>
              ) : (
                <NavigationMenu.Link active={pathname === item.href} asChild>
                  <Link
                    href={item.href}
                    color="gray"
                    className="flex data-[active]:bg-gray-5 hover:bg-gray-4 cursor-pointer px-1.5 py-0.5 w-full"
                    underline="none"
                  >
                    <Flex gap="2" className="items-center">
                      <item.icon size={16} />
                      {item.label}
                    </Flex>
                  </Link>
                </NavigationMenu.Link>
              )}
            </NavigationMenu.Item>
          ))}
          <NavigationMenu.Indicator className="bg-gray-12" />
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
