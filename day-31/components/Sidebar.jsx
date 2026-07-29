"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar({ nav }) {
  const pathname = usePathname();
  const [openFrameworks, setOpenFrameworks] = useState(() =>
    nav.reduce((acc, { framework }) => ({ ...acc, [framework]: true }), {}),
  );

  const toggleFramework = (framework) =>
    setOpenFrameworks((prev) => ({ ...prev, [framework]: !prev[framework] }));

  return (
    <aside className="w-56 shrink-0 border-r bg-white p-4">
      <h2 className="text-xs font-semibold uppercase text-gray-400 mb-3">
        Documentation
      </h2>

      {nav.map(({ framework, subItems }) => {
        const frameworkHref = `/documentation/${framework}`;
        const isFrameworkActive = pathname.startsWith(frameworkHref);
        const isOpen = openFrameworks[framework];

        return (
          <div key={`${framework}-${subItems}`} className="mb-2">
            <div className="flex items-center justify-between">
              <Link
                href={frameworkHref}
                className={`px-2 py-1 text-sm font-medium capitalize ${
                  isFrameworkActive ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {framework}
              </Link>
              <button
                onClick={() => toggleFramework(framework)}
                className="px-2 text-gray-400"
                aria-label={`Toggle ${framework} section`}
              >
                {isOpen ? "▾" : "▸"}
              </button>
            </div>

            {isOpen && subItems.length > 0 && (
              <ul className="ml-3 mt-1 space-y-1 border-l pl-3">
                {subItems.map(({ slug, label }) => {
                  const href = `${frameworkHref}/${slug}`;
                  const isActive = pathname === href;

                  return (
                    <li key={`${framework}-${slug}`}>
                      <Link
                        href={href}
                        className={`block px-2 py-1 rounded text-sm ${
                          isActive
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </aside>
  );
}
