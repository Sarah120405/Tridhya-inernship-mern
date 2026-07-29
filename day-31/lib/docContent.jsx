export async function getDocContent(framework, path) {
  const repoApiRoot = {
    react: "https://api.github.com/repos/reactjs/react.dev/contents",
    nextjs: "https://api.github.com/repos/vercel/next.js/contents",
    redux: "https://api.github.com/repos/reduxjs/redux/contents",
  };

  const rootUrl = repoApiRoot[framework];
  if (!rootUrl) return null;

  function cleanMdxArtifacts(markdown) {
    return markdown
      .replace(/^---[\s\S]*?---\n?/, "")
      .replace(/<\/?[A-Z][a-zA-Z]*>/g, "")
      .replace(/\{\/\*.*?\*\/\}/g, "")
      .trim();
  }

  try {
    const res = await fetch(`${rootUrl}/${path}`, {
      headers: { Authorization: `Bearer ${process.env.TOKEN}` },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const file = await res.json();
    if (file.encoding !== "base64" || !file.content) return null;

    const decodedContent = Buffer.from(file.content, "base64").toString(
      "utf-8",
    );

    return {
      title: file.name.replace(/\.mdx?$/, ""),
      body: cleanMdxArtifacts(decodedContent),
    };
  } catch (err) {
    console.error(`Failed to fetch doc content for ${framework}/${path}:`, err);
    return null;
  }
}
