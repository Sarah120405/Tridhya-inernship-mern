// app/documentation/page.js
async function getTestTimestamp() {
  const res = await fetch("https://api.github.com/zen", {
    next: { revalidate: 20 },
  });
  const generatedAt = new Date().toLocaleString();
  return { response: res.text(), generatedAt };
}
export default async function DocumentationIndexPage() {
  const { response, generatedAt } = await getTestTimestamp();

  return (
    <div>
      <h1 className="text-xl font-semibold">Documentation</h1>
      <p className="text-xs text-slate-400 mt-4 italic">
        Revalidates every 20s: {generatedAt}
      </p>
      <p className="mt-2 text-gray-600">
        Pick a topic from the sidebar to view its notes.
      </p>
    </div>
  );
}
