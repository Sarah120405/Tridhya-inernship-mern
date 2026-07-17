// api/posts.js
const API_BASE = "https://dev.to/api";

export async function getAllArticles() {
  const res = await fetch(`${API_BASE}/articles?per_page=30`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function getArticlesByTag(tag) {
  const res = await fetch(`${API_BASE}/articles?tag=${tag}&per_page=30`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function getArticleById(id) {
  const res = await fetch(`${API_BASE}/articles/${id}`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function getRelatedArticles(tag, excludeId) {
  const articles = await getArticlesByTag(tag);
  return articles.filter((a) => a.id !== excludeId).slice(0, 4);
}
export async function getCommentsForPost(id) {
  const res = await fetch(`${API_BASE}/comments?a_id=${id}`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export function extractHeadings(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const headings = doc.querySelectorAll("h1, h2, h3");

  const tocItems = Array.from(headings).map((h, index) => {
    const id = `heading-${index}`;
    h.id = id;
    return { id, text: h.textContent, level: h.tagName };
  });

  return { tocItems, htmlWithIds: doc.body.innerHTML };
}
