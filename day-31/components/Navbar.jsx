// components/Navbar.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/documentation", label: "Documentation" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <span className="font-semibold text-lg">DevDocs Hub</span>
      <div className="flex gap-4 text-sm">
        {links.map(({ href, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={
                isActive ? "font-medium text-blue-600" : "text-gray-600"
              }
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
