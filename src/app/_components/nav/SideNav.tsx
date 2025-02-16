"use client";

import Link from "next/link";
import React from "react";
import { FaInbox, FaRProject } from "react-icons/fa6";
import { SiOpenproject } from "react-icons/si";
import { api } from "~/trpc/react";

export default function SideNav() {
  const links = [
    { label: "Inbox", icon: <FaInbox />, href: "/inbox" },
    { label: "Projects", icon: <SiOpenproject />, href: "/projects" },
  ];
  const { data: projects } = api.project.readAll.useQuery();

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
        {projects?.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="m-2 ml-8 flex items-center gap-2 rounded py-2 pl-4 pr-2 text-sm hover:bg-primary/30">
            {project.name}{" "}
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/30">
              {project._count.tasks}
            </span>
          </Link>
        ))}
      </div>
      {/* bottom menu actions */}
    </nav>
  );
}
