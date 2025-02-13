import Link from "next/link";
import React from "react";
import { FaInbox } from "react-icons/fa6";

export default function SideNav() {
  return (
    <nav className="bg-gray flex w-60 flex-col">
      {/* branding */}
      {/* main menu actions */}
      <div className="flex-1 flex-col">
        <Link
          href="/inbox"
          className="bg-primary/60 m-2 flex items-center justify-center gap-2 rounded px-4 py-2 text-2xl"
        >
          <FaInbox />
          Inbox
        </Link>
      </div>
      {/* bottom menu actions */}
    </nav>
  );
}
