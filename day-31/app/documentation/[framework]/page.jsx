// app/documentation/[framework]/page.jsx
import { notFound } from "next/navigation";

const REPO_SOURCES = {
  react: "https://api.github.com/repos/reactjs/react.dev/contents/src/content",
  nextjs: "https://api.github.com/repos/vercel/next.js/contents/docs/01-app",
  redux:
    "https://api.github.com/repos/reduxjs/redux/contents/docs/introduction",
};

export async function generateStaticParams() {
  return Object.keys(REPO_SOURCES).map((framework) => ({ framework }));
}

export default async function FrameworkDocPage({ params }) {
  const { framework } = await params;
  const url = REPO_SOURCES[framework];

  if (!url) notFound();

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${framework} docs structure`);
  }

  const files = await res.json();

  return (
    <article>
      <h1 className="text-xl font-semibold capitalize">{framework}</h1>
      <ul className="mt-4 space-y-1 text-sm text-gray-600">
        {files.map((file) => (
          <li key={file.sha}>{file.name}</li>
        ))}
      </ul>
    </article>
  );
}
