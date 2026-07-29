// lib/blogPosts.js
export const blogPosts = [
  {
    slug: "why-nested-layouts-matter",
    title: "Why Nested Layouts Matter",
    excerpt:
      "A look at how Next.js's App Router changes the way we think about shared UI.",
    body: "Nested layouts let you build persistent UI sections without re-rendering them on every navigation. This post explores why that matters for real applications.",
  },
  {
    slug: "server-actions-vs-route-handlers",
    title: "Server Actions vs Route Handlers",
    excerpt: "Two ways to run server-side logic in Next.js — when to use each.",
    body: "Server Actions let you call server-side functions directly from a form, no manual fetch required. Route Handlers give you a traditional API endpoint. Both have their place.",
  },
  {
    slug: "understanding-server-components",
    title: "Understanding Server Components",
    excerpt:
      "What actually runs on the server, and why it matters for performance.",
    body: "Server Components let you fetch data and render markup without shipping any JavaScript to the browser for that component at all.",
  },
];
