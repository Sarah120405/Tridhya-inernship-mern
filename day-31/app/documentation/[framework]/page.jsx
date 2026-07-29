// app/documentation/react/page.jsx
export default async function ReactDocPage() {
  const res = await fetch(
    "https://api.github.com/repos/reactjs/react.dev/contents/src/content",
    { next: { revalidate: 3600 } }, // cache for 1 hour, avoid hitting GitHub's rate limit every request
  );

  if (!res.ok) {
    throw new Error("Failed to fetch React docs structure"); // caught by error.js
  }

  const files = await res.json();
  return (
    <article>
      <h1 className="text-xl font-semibold">React</h1>
      <ul className="mt-4 space-y-1 text-sm text-gray-600">
        {files.map((file) => (
          <li key={file.sha}>{file.name}</li>
        ))}
      </ul>
    </article>
  );
}
