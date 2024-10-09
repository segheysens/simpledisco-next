"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  FaBars,
  FaHome,
  FaTimes,
  FaList,
  FaPencilAlt,
  FaCalendar,
} from "react-icons/fa";
import { PiDiscoBall } from "react-icons/pi";
import { Command } from "cmdk";

import { cn } from "@/lib/utils";

const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  { ssr: false }
);

const navigation = [
  { name: "Home", href: "/home", icon: FaHome, current: true },
  { name: "Meetings", href: "/meetings", icon: FaCalendar, current: false },
  { name: "Templates", href: "/templates", icon: FaPencilAlt, current: false },
  { name: "Action Plans", href: "/action-plans", icon: FaList, current: false },
];

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const currentPage = useMemo(() => {
    return (
      navigation.find((item) => item.href === pathname)?.name || "Dashboard"
    );
  }, [pathname]);

  const NavLink = ({ item }) => {
    const isActive = pathname === item.href;
    return (
      <li key={item.name}>
        <Link
          href={item.href}
          className={cn(
            isActive
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white",
            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
          )}
        >
          <item.icon aria-hidden="true" className="h-6 w-6 shrink-0" />
          {item.name}
        </Link>
      </li>
    );
  };

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="h-full">
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <FaTimes aria-hidden="true" className="h-6 w-6 text-white" />
                </button>
              </div>
            </TransitionChild>
            {/* Mobile Sidebar component */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <PiDiscoBall className="text-emerald-500 h-8 w-8" />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <NavLink key={item.name} item={item} mobile={true} />
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <div>
        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
            <div className="flex h-16 shrink-0 items-center">
              <PiDiscoBall className="text-emerald-500 h-8 w-8" />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <NavLink key={item.name} item={item} />
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto p-4 flex flex-row items-center justify-start">
                  <UserButton />
                  <p className="ml-2 text-white text-sm font-semibold leading-6">
                    My Profile
                  </p>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <FaBars aria-hidden="true" className="h-6 w-6" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-white">
            {currentPage}
          </div>
          <Link href="#">
            <span className="sr-only">Your profile</span>
            <PiDiscoBall className="text-emerald-500 h-8 w-8" />
          </Link>
        </div>

        <main className="min-h-screen py-10 lg:pl-72">
          <div className="h-full px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      <Command.Dialog
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        label="Global Command Menu"
      >
        <Command.Input placeholder="Type a command or search..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>

          <Command.Group heading="Navigation">
            {navigation.map((item) => (
              <Command.Item
                key={item.name}
                onSelect={() => {
                  router.push(item.href);
                  setCmdOpen(false);
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </div>
  );
}
