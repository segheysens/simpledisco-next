"use client";

import { useEffect, useState } from "react";
import { PiDiscoBall } from "react-icons/pi";

import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "#", icon: FaHome, current: true },
  { name: "Meetings", href: "#", icon: FaUsers, current: false },
  { name: "Templates", href: "#", icon: FaFolder, current: false },
  { name: "Action Plans", href: "#", icon: FaCalendarAlt, current: false },
];

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading placeholder
  }

  return <>{children}</>;
}
