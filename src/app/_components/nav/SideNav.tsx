import Link from "next/link";
import React from "react";
import { FaInbox, FaRProject } from "react-icons/fa6";
import { SiOpenproject } from "react-icons/si";

export default function SideNav() {
  const links = [
    { label: "Inbox", icon: <FaInbox />, href: "/inbox" },
    { label: "Projects", icon: <SiOpenproject />, href: "/projects" },
  ];
  return (
    <nav className="flex w-60 flex-col bg-gray">
      {/* branding */}
      {/* main menu actions */}
      <div className="flex-1 flex-col">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="m-2 flex items-center gap-2 rounded bg-primary/60 px-4 py-2 text-2xl">
            {link.icon}
            {link.label}
          </Link>
        ))}
      </div>
      {/* bottom menu actions */}
    </nav>
  );
}
