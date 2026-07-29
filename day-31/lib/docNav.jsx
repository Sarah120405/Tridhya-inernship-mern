import fetchFilesRecursive from "./fetchFilesRecursive";

export const GITHUB_SOURCES = {
  react:
    "https://api.github.com/repos/reactjs/react.dev/contents/src/content/learn",
  nextjs: "https://api.github.com/repos/vercel/next.js/contents/docs/01-app",
  redux:
    "https://api.github.com/repos/reduxjs/redux/contents/docs/introduction",
};

function slugify(name) {
  return name
    .replace(/\.mdx?$/, "")
    .replace(/^\d+-/, "")
    .toLowerCase();
}

function titleize(slug) {
  return slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export async function getDocsNav() {
  const entries = await Promise.all(
    Object.entries(GITHUB_SOURCES).map(async ([topic, url]) => {
      try {
        const files = await fetchFilesRecursive(url, process.env.TOKEN);
        const subItems = files.slice(0, 15).map((f) => {
          const slug = slugify(f.name);
          return { slug, label: titleize(slug), path: f.path };
        });
        return { framework: topic, subItems };
      } catch (err) {
        console.error(err);
        return { framework: topic, subItems: [] };
      }
    }),
  );

  return entries;
}
