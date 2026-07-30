// app/page.js
export default function HomePage() {
  const generatedAt = new Date().toLocaleString();
  return (
    <section className="px-6 py-10">
      <h1 className="text-3xl font-bold">Welcome to DevDocs Hub</h1>
      <p className="text-xs text-slate-400 mt-8">
        Page generated at: {generatedAt}
      </p>
      <p className="mt-2 text-gray-600 max-w-xl">
        A reference and practice space for React, Next.js, TypeScript, and Redux
        — built while learning the Next.js App Router.
      </p>
    </section>
  );
}
