export function extractMarkdownHeadings(markdown) {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings = [];
  const seenIds = {};
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    let id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (seenIds[id] !== undefined) {
      seenIds[id] += 1;
      id = `${id}-${seenIds[id]}`;
    } else {
      seenIds[id] = 0;
    }

    headings.push({ id, text, level });
  }

  return headings;
}
