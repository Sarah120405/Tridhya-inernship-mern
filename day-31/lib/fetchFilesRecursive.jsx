async function fetchFilesRecursive(url, token, depth = 0, maxDepth = 3) {
  if (depth > maxDepth) return [];

  const res = await fetch(url, {
    headers: { Authorization: `Token ${token}` },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const entries = await res.json();
  const results = [];

  for (const entry of entries) {
    if (entry.type === "file" && /\.mdx?$/.test(entry.name)) {
      results.push({
        name: entry.name,
        path: entry.path,
      });
    } else if (entry.type === "dir") {
      const nested = await fetchFilesRecursive(
        entry.url,
        token,
        depth + 1,
        maxDepth,
      );
      results.push(...nested);
    }
  }

  return results;
}
export default fetchFilesRecursive;
