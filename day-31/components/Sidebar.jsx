// components/Sidebar.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const topics = [
  { slug: "react", label: "React" },
  { slug: "nextjs", label: "Next.js" },
  { slug: "typescript", label: "TypeScript" },
  { slug: "redux", label: "Redux" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-48 shrink-0 border-r bg-white p-4">
      <h2 className="text-xs font-semibold uppercase text-gray-400 mb-3">
        Topics
      </h2>
      <ul className="space-y-1">
        {topics.map(({ slug, label }) => {
          const href = `/documentation/${slug}`;
          const isActive = pathname === href;
          return (
            <li key={slug}>
              <Link
                href={href}
                className={`block px-2 py-1 rounded text-sm ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
